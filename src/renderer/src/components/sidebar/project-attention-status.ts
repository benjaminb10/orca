import type { WorktreeStatus } from '@/lib/worktree-status'

// Why this order: mirrors the Smart attention classes (needs you, then news, then work in flight, then quiet).
const WORKTREE_STATUS_URGENCY: readonly WorktreeStatus[] = [
  'permission',
  'failed',
  'unconfirmed',
  'done',
  'working',
  'monitoring',
  'interrupted',
  'active',
  'inactive'
]

/** The status a project header shows for its workspaces: the one that most needs the user. */
export function pickMostUrgentWorktreeStatus(statuses: Iterable<WorktreeStatus>): WorktreeStatus {
  let best = WORKTREE_STATUS_URGENCY.length - 1
  for (const status of statuses) {
    const rank = WORKTREE_STATUS_URGENCY.indexOf(status)
    if (rank !== -1 && rank < best) {
      best = rank
    }
  }
  return WORKTREE_STATUS_URGENCY[best] ?? 'inactive'
}
