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
      Workspace: {
        id: string
        name: string
        type: 'PUBLIC' | 'PERSONAL'
      }
    }[]
  }
}