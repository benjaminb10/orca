import React, { useCallback } from 'react'
import { useAppStore } from '@/store'
import type { AppState } from '@/store/types'
import { getWorktreeMapFromState } from '@/store/selectors'
import StatusIndicator from '../../StatusIndicator'
import { useWorktreeActivityStatuses } from '../../use-worktree-activity-statuses'
import { pickCompactProjectTargetWorktree } from '../../compact-project-activation'
import { buildProjectAttentionFromState } from '../../project-attention-order'

// Why the click target's status: the workspace that ranks the project (and that a click opens)
// is the one whose dot the row shows, so dot, Attention order and click never disagree.
function selectProjectStatusWorktreeId(
  state: AppState,
  worktreeIds: readonly string[]
): string | undefined {
  const worktreeMap = getWorktreeMapFromState(state)
  const worktrees = worktreeIds.flatMap((id) => {
    const worktree = worktreeMap.get(id)
    return worktree ? [worktree] : []
  })
  return pickCompactProjectTargetWorktree(
    worktrees,
    buildProjectAttentionFromState(state, worktrees)
  )?.id
}

export const ProjectAttentionStatusIndicator = React.memo(function ProjectAttentionStatusIndicator({
  worktreeIds
}: {
  worktreeIds: readonly string[]
}): React.JSX.Element | null {
  const selectWorktreeId = useCallback(
    (state: AppState) => selectProjectStatusWorktreeId(state, worktreeIds),
    [worktreeIds]
  )
  const statusWorktreeId = useAppStore(selectWorktreeId)
  const statuses = useWorktreeActivityStatuses(worktreeIds)
  const status = statusWorktreeId ? statuses.get(statusWorktreeId) : undefined
  if (!status) {
    return null
  }
  return <StatusIndicator status={status} data-project-attention-status="" />
})
