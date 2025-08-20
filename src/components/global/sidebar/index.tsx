import React from 'react';

type Props = {
  actionWorkspaceId: string;
};

function Sidebar({ actionWorkspaceId }: Props) {
  return (
    <div>Sidebar {actionWorkspaceId && actionWorkspaceId}</div>
  );
}

export default Sidebar;