export type WorkSpaceProps = {
  data: {
    subscription: {
      plan: 'FREE' | 'PRO'
    } | null
    workspace: {
      id: string
      name: string
      type: 'PERSONAL' | 'PUBLIC'
    }[]
    members: {
      Workspace: {
        id: string
        name: string
        type: 'PERSONAL' | 'PUBLIC'
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
    _count: {
      videos: number
    }
  }
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
    processing: boolean
    summary: string
    createdAt: Date
    title: string | null
    source: string
  }
  author: boolean
}

