'use client'

import { useState, useRef, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { UploadIcon } from 'lucide-react'
import { getUserProfile } from '@/actions/user'

type UploadVideoDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: () => void
}

/**
 * Upload Video Dialog Component
 * 
 * Dialog component for uploading video files to the Crystal platform.
 * Supports optional title/description metadata, progress tracking, and file validation.
 * 
 * Features:
 * - File type validation (MP4, WebM, MOV, AVI)
 * - File size validation (100MB limit)
 * - Upload progress bar with percentage
 * - Optional title and description fields
 * - Error handling and user feedback
 * - Automatic video list refresh on success
 * 
 * Upload Flow:
 * 1. User selects video file
 * 2. Optional metadata entry (title/description)
 * 3. File validation (type and size)
 * 4. Upload to Express server with progress tracking
 * 5. Server processes video (S3 upload, AI processing)
 * 6. Success toast and list refresh
 * 
 * AI Processing:
 * - Files under 25MB: Full AI processing (transcription, title, description)
 * - Files over 25MB: Upload only, no AI processing
 * - User-provided metadata is used when available
 */
export function UploadVideoDialog({ open, onOpenChange, onUploadComplete }: UploadVideoDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
  const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload MP4, WebM, MOV, or AVI files.'
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 100MB limit.'
    }
    return null
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setSelectedFile(null)
      return
    }

    setError('')
    setSelectedFile(file)
  }

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('Please select a video file')
      return
    }

    setUploading(true)
    setError('')
    setUploadProgress(0)

    try {
      const userProfile = await getUserProfile()
      
      if (!userProfile || userProfile.status !== 200 || !userProfile.data?.id) {
        throw new Error('Unable to get user information')
      }

      const formData = new FormData()
      formData.append('video', selectedFile)
      formData.append('userId', userProfile.data.id)
      
      if (title.trim()) {
        formData.append('title', title.trim())
      }
      if (description.trim()) {
        formData.append('description', description.trim())
      }

      const uploadUrl = process.env.NEXT_PUBLIC_EXPRESS_UPLOAD_URL || 'http://localhost:5001/upload'

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(percentComplete)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          toast.success('Video uploaded successfully! Processing will begin shortly.')
          
          resetForm()
          onOpenChange(false)
          
          if (onUploadComplete) {
            onUploadComplete()
          }
        } else {
          const response = JSON.parse(xhr.responseText)
          throw new Error(response.error || 'Upload failed')
        }
      })

      xhr.addEventListener('error', () => {
        throw new Error('Network error during upload')
      })

      xhr.open('POST', uploadUrl)
      xhr.send(formData)

    } catch (err) {
      console.error('Upload error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.'
      setError(errorMessage)
      toast.error('Upload failed: ' + (err instanceof Error ? err.message : 'Please try again'))
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    setUploadProgress(0)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCancel = () => {
    if (!uploading) {
      resetForm()
      onOpenChange(false)
    }
  }

  const fileSizeDisplay = selectedFile 
    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` 
    : ''

  const showAiWarning = selectedFile && selectedFile.size > 25 * 1024 * 1024

  return (
    <Dialog open={open} onOpenChange={uploading ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Upload a video file to your workspace. Supported formats: MP4, WebM, MOV, AVI (max 100MB)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
              onChange={handleFileChange}
              disabled={uploading}
              className="cursor-pointer"
            />
            {selectedFile && (
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span className="truncate">{selectedFile.name}</span>
                <span className="ml-2">{fileSizeDisplay}</span>
              </div>
            )}
            {showAiWarning && (
              <p className="mt-2 text-sm text-yellow-600">
                ⚠️ File exceeds 25MB - AI processing will be skipped
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Title (optional)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={uploading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Description (optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              disabled={uploading}
              rows={3}
            />
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || uploading}
              className="bg-[#9D9D9D] hover:bg-[#8D8D8D]"
            >
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

