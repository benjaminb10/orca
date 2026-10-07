import React from 'react'
import StatusIndicator from '../../StatusIndicator'
import { useWorktreeActivityStatuses } from '../../use-worktree-activity-statuses'
import { pickMostUrgentWorktreeStatus } from '../../project-attention-status'

export const ProjectAttentionStatusIndicator = React.memo(function ProjectAttentionStatusIndicator({
  worktreeIds
}: {
  worktreeIds: readonly string[]
}): React.JSX.Element {
  const statuses = useWorktreeActivityStatuses(worktreeIds)
  return (
    <StatusIndicator
      status={pickMostUrgentWorktreeStatus(statuses.values())}
      data-project-attention-status=""
    />
  )
})
