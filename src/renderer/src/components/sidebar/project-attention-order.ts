import type { AppState } from '@/store/types'
import type { Worktree } from '../../../../shared/worktree/types'
import { buildAttentionByWorktree, type WorktreeAttention } from './smart-attention'

type ProjectAttentionState = Pick<
  AppState,
  | 'tabsByWorktree'
  | 'agentStatusByPaneKey'
  | 'runtimePaneTitlesByTabId'
  | 'ptyIdsByTabId'
  | 'migrationUnsupportedByPtyId'
  | 'terminalLayoutsByTabId'
>

/** Per-worktree Smart attention, the input the "Attention" project order ranks projects by. */
export function buildProjectAttentionFromState(
  state: ProjectAttentionState,
  worktrees: readonly Worktree[],
  now = Date.now()
): Map<string, WorktreeAttention> {
  return buildAttentionByWorktree(
    [...worktrees],
    state.tabsByWorktree,
    state.agentStatusByPaneKey,
    state.runtimePaneTitlesByTabId,
    state.ptyIdsByTabId,
    now,
    state.migrationUnsupportedByPtyId,
    state.terminalLayoutsByTabId
  )
}
