import React from 'react'
import { searchContent } from '@/actions/search'
import { SearchResult } from '@/actions/search'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Folder, Video, Building2, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'

interface SearchPageProps {
  params: Promise<{ workspaceid: string }>
  searchParams: Promise<{ query?: string }>
}

/**
 * Search Results Page
 * 
 * This page displays search results for workspaces, folders, and videos.
 * It shows all content that matches the search query with proper categorization
 * and navigation links to the respective content.
 * 
 * Features:
 * - Displays search results in categorized sections
 * - Shows workspace, folder, and video information
 * - Provides navigation links to found content
 * - Handles empty search states
 * - Responsive design with proper spacing
 * 
 * @param params - URL parameters containing the workspace ID
 * @param searchParams - URL search parameters containing the query
 * @returns JSX element with search results display
 */
export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { workspaceid } = await params
  const { query } = await searchParams

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Search for content
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a search term to find workspaces, folders, and videos
          </p>
        </div>
      </div>
    )
  }

  const searchResults = await searchContent(query)

  if (searchResults.status !== 200) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Search Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {searchResults.message || 'An error occurred while searching'}
          </p>
        </div>
      </div>
    )
  }

  const results = searchResults.data || []
  const workspaces = results.filter(item => item.type === 'workspace')
  const folders = results.filter(item => item.type === 'folder')
  const videos = results.filter(item => item.type === 'video')

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workspace':
        return <Building2 className="h-5 w-5" />
      case 'folder':
        return <Folder className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workspace':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'folder':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'video':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  const getItemLink = (item: SearchResult) => {
    switch (item.type) {
      case 'workspace':
        return `/dashboard/${item.workspaceId}`
      case 'folder':
        return `/dashboard/${item.workspaceId}/folder/${item.id}`
      case 'video':
        return `/dashboard/${item.workspaceId}/video/${item.id}`
      default:
        return '#'
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">Search Results</h1>
        <Badge variant="outline" className="text-sm">
          "{query}"
        </Badge>
      </div>

      {/* Results Summary */}
      <div className="text-gray-600 dark:text-gray-400">
        Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
      </div>

      {/* No Results */}
      {results.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try searching with different keywords or check your spelling
            </p>
          </div>
        </div>
      )}

      {/* Workspaces Section */}
      {workspaces.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Workspaces ({workspaces.length})
          </h2>
          <div className="grid gap-4">
            {workspaces.map((workspace) => (
              <Card key={workspace.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(workspace.type)}
                      <div>
                        <CardTitle className="text-lg">{workspace.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Workspace
                        </p>
                      </div>
                    </div>
                    <Badge className={getTypeColor(workspace.type)}>
                      Workspace
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(workspace.createdAt)}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={getItemLink(workspace)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Open Workspace →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Folders Section */}
      {folders.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Folders ({folders.length})
          </h2>
          <div className="grid gap-4">
            {folders.map((folder) => (
              <Card key={folder.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(folder.type)}
                      <div>
                        <CardTitle className="text-lg">{folder.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Folder in {folder.workspaceName}
                        </p>
                      </div>
                    </div>
                    <Badge className={getTypeColor(folder.type)}>
                      Folder
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(folder.createdAt)}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={getItemLink(folder)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Open Folder →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Video className="h-5 w-5" />
            Videos ({videos.length})
          </h2>
          <div className="grid gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(video.type)}
                      <div>
                        <CardTitle className="text-lg">{video.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Video in {video.workspaceName}
                          {video.folderName && ` • ${video.folderName}`}
                        </p>
                      </div>
                    </div>
                    <Badge className={getTypeColor(video.type)}>
                      Video
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {video.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(video.createdAt)}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={getItemLink(video)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Open Video →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}