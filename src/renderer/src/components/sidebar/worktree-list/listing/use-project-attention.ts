import { useMemo } from 'react'
import { useAppStore } from '@/store'
import type { Worktree } from '../../../../../../shared/worktree/types'
import type { WorktreeAttention } from '../../smart-attention'
import { buildProjectAttentionFromState } from '../../project-attention-order'

// Why settledSortEpoch: like the Smart worktree sort, projects reorder on coalesced
// activity bumps instead of on every agent-status tick, so rows don't jump under the cursor.
export function useProjectAttentionByWorktree(
  enabled: boolean,
  worktrees: readonly Worktree[]
): Map<string, WorktreeAttention> | undefined {
  const settledSortEpoch = useAppStore((s) => s.settledSortEpoch)
  return useMemo(
    () => (enabled ? buildProjectAttentionFromState(useAppStore.getState(), worktrees) : undefined),
    // settledSortEpoch is an intentional trigger not read in the memo.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [enabled, worktrees, settledSortEpoch]
  )
}
