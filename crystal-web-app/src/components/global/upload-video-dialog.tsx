'use client'

import { useState, useRef, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { UploadIcon, CheckCircle2, Video } from 'lucide-react'
import { getUserProfile } from '@/actions/user'

type UploadPhase = 'idle' | 'uploading' | 'processing' | 'complete'

type UploadVideoDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete?: () => void
  workspaceId?: string | null
}

/**
 * Upload Video Dialog Component
 * 
 * Dialog component for uploading video files to the Crystal platform.
 * Provides a multi-phase upload experience with distinct visual states
 * for uploading, processing, and completion.
 * 
 * Features:
 * - File type validation (MP4, WebM, MOV, AVI)
 * - File size validation (100MB limit)
 * - Multi-phase progress: Upload -> Processing -> Complete
 * - Indeterminate progress bar during server processing
 * - Success state with navigation to uploaded video
 * 
 * Upload Phases:
 * - idle: File selection and metadata entry
 * - uploading: Determinate progress bar showing upload percentage
 * - processing: Indeterminate progress bar while server processes
 * - complete: Success message with "View Video" button
 */
export function UploadVideoDialog({ open, onOpenChange, onUploadComplete, workspaceId: propWorkspaceId }: UploadVideoDialogProps) {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [videoId, setVideoId] = useState<string | null>(null)
  const [workspaceId, setWorkspaceId] = useState<string | null>(propWorkspaceId || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
  const MAX_FILE_SIZE = 100 * 1024 * 1024

  const isProcessing = phase === 'uploading' || phase === 'processing'

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

    setPhase('uploading')
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
          
          // Transition to processing phase when upload reaches 100%
          if (percentComplete === 100) {
            setPhase('processing')
          }
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            
            // Store video and workspace IDs for navigation
            if (response.videoId) {
              setVideoId(response.videoId)
            }
            if (response.workspaceId) {
              setWorkspaceId(response.workspaceId)
            }
            
            setPhase('complete')
            toast.success('Video uploaded and processed successfully!')
            
            if (onUploadComplete) {
              onUploadComplete()
            }
          } catch {
            setPhase('complete')
            toast.success('Video uploaded successfully!')
          }
        } else {
          try {
            const response = JSON.parse(xhr.responseText)
            throw new Error(response.error || 'Upload failed')
          } catch {
            throw new Error('Upload failed')
          }
        }
      })

      xhr.addEventListener('error', () => {
        setPhase('idle')
        setError('Network error during upload')
        toast.error('Network error during upload')
      })

      xhr.open('POST', uploadUrl)
      xhr.send(formData)

    } catch (err) {
      console.error('Upload error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Upload failed. Please try again.'
      setError(errorMessage)
      setPhase('idle')
      toast.error('Upload failed: ' + (err instanceof Error ? err.message : 'Please try again'))
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    setUploadProgress(0)
    setError('')
    setPhase('idle')
    setVideoId(null)
    setWorkspaceId(propWorkspaceId || null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      resetForm()
      onOpenChange(false)
    }
  }

  const handleViewVideo = () => {
    if (videoId && workspaceId) {
      router.push(`/dashboard/${workspaceId}/video/${videoId}`)
      handleClose()
    }
  }

  const fileSizeDisplay = selectedFile 
    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` 
    : ''

  const showAiWarning = selectedFile && selectedFile.size > 25 * 1024 * 1024

  // Success/Complete state
  if (phase === 'complete') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Upload Complete!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your video has been uploaded and processed successfully.
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              {videoId && workspaceId && (
                <Button onClick={handleViewVideo} className="bg-brand hover:bg-brand-hover">
                  <Video className="mr-2 h-4 w-4" />
                  View Video
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={isProcessing ? undefined : handleClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogDescription>
            Upload a video file to your workspace. Supported formats: MP4, WebM, MOV, AVI (max 100MB)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpload} className="space-y-4 overflow-hidden">
          <div className="overflow-hidden">
            <Input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
              onChange={handleFileChange}
              disabled={isProcessing}
              className="cursor-pointer w-full max-w-full overflow-hidden text-ellipsis"
            />
            {selectedFile && (
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground gap-2 max-w-full overflow-hidden">
                <span className="truncate min-w-0 flex-1 block overflow-hidden text-ellipsis">{selectedFile.name}</span>
                <span className="flex-shrink-0 whitespace-nowrap">{fileSizeDisplay}</span>
              </div>
            )}
            {showAiWarning && (
              <p className="mt-2 text-sm text-yellow-600">
                Note: File exceeds 25MB - AI processing will be skipped
              </p>
            )}
          </div>

          <div className="overflow-hidden">
            <label className="text-sm font-medium mb-1.5 block">
              Title (optional)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={isProcessing}
              className="w-full"
            />
          </div>

          <div className="overflow-hidden">
            <label className="text-sm font-medium mb-1.5 block">
              Description (optional)
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              disabled={isProcessing}
              rows={3}
              className="w-full resize-none"
            />
          </div>

          {/* Uploading Phase - Determinate Progress */}
          {phase === 'uploading' && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Processing Phase - Indeterminate Progress */}
          {phase === 'processing' && (
            <div className="space-y-2">
              <div className="relative">
                <Progress value={100} className="[&>div]:animate-pulse" />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Processing video...
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
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile || isProcessing}
              className="bg-[#9D9D9D] hover:bg-[#8D8D8D]"
            >
              {phase === 'uploading' ? (
                <>Uploading...</>
              ) : phase === 'processing' ? (
                <>Processing...</>
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
