export type WorkSpaceProps = {
  data: {
    subscription: {
      plan: 'FREE' | 'PRO'
    } | null
    workspace: {
      id: string
      name: string
      type: 'PUBLIC' | 'PERSONAL'
    }[]
    members: {
      WorkSpace: {
        id: string
        name: string
        type: 'PUBLIC' | 'PERSONAL'
      }
    }[]
  }
}

export type NotificationProps = {
  status: number
  data: {
    _count: {
      notification: number
    }
  }
}

export type FolderProps = {
  status: number
  data: {
    name: string
    createdAt: Date
    _count: {
      videos: number
    }
  }
}

export type VideosProps = {
  status: number
  data: {
    User: {
      firstname: string | null
      lastname: string | null
      image: string | null
    } | null
    id: string
    processing: boolean
    Folder: {
      id: string
      name: string
    } | null
    createdAt: Date
    title: string | null
    source: string
  }[]
}

export type TranscriptSegment = {
  start: number
  end: number
  text: string
}

export type VideoProps = {
  status: number
  data: {
    User: {
      firstname: string | null
      lastname: string | null
      image: string | null
      clerkId: string
      trial: boolean
      subscription: {
        plan: 'PRO' | 'FREE'
      } | null
    } | null
    description: string | null
    views: number
    likes: number
    processing: boolean
    summary: string
    transcriptSegments: TranscriptSegment[] | null
    createdAt: Date
    title: string | null
    source: string
  }
  author: boolean
}

export type CommentRepliesProps = {
  id: string
  comment: string
  createdAt: Date
  commentId: string | null
  userId: string | null
  videoId: string | null
  User: {
    id: string
    email: string
    firstname: string | null
    lastname: string | null
    createdAt: Date
    clerkId: string
    image: string | null
    trial: boolean
    firstView: boolean
  } | null
}

export type VideoCommentProps = {
  data: {
    User: {
      id: string
      email: string
      firstname: string | null
      lastname: string | null
      createdAt: Date
      clerkId: string
      image: string | null
      trial: boolean
      firstView: boolean
    } | null
    reply: CommentRepliesProps[]
    id: string
    comment: string
    createdAt: Date
    commentId: string | null
    userId: string | null
    videoId: string | null
  }[]
}

export type FolderItem = {
  _count: {
    videos: number
  }
  id: string
  name: string
  createdAt: Date
  workSpaceId: string | null
}

export type FoldersProps = {
  status: number
  data: FolderItem[]
}

export type WorkspaceDataResponse = {
  workspace: Array<{ 
    id: string
    name: string
    type: string 
  }>
  members: Array<{ 
    WorkSpace: { 
      id: string
      name: string
      type: string 
    } | null 
  }>
}

export type SubscriptionPlan = 'FREE' | 'PRO'

export type WorkspaceType = 'PUBLIC' | 'PERSONAL'

export type UserProfileResponse = {
  status: number
  data: { 
    id: string
    image: string 
  }
}

