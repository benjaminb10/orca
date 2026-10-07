import React from 'react'
import type { AppState } from '@/store/types'
import type { ProjectGroup } from '../../../../../../shared/project-group-types'
import { getRepoHeaderCreateState } from '../../repo-header-create-state'
import { ProjectHeaderActions } from '../../ProjectHeaderActions'
import type { GroupHeaderRow } from '../grouping/row-types'
import {
  RepoHeaderCreateWorkspaceButton,
  RepoHeaderProjectActionsMenu,
  type RepoHeaderProjectActions
} from './repo-header-project-actions'

export type CompactProjectRowActionsContext = {
  projectGroups: readonly ProjectGroup[]
  sshConnectionStates: AppState['sshConnectionStates']
  projectActions: RepoHeaderProjectActions
}

// Why: the folded header still owns project actions (… and +), so a compact row keeps them on hover.
export function CompactProjectRowActions({
  ctx,
  header
}: {
  ctx: CompactProjectRowActionsContext
  header: GroupHeaderRow
}): React.JSX.Element | null {
  const { repo } = header
  if (!repo) {
    return null
  }
  const createState = getRepoHeaderCreateState({
    repo,
    label: header.label,
    sshStatus: repo.connectionId
      ? (ctx.sshConnectionStates.get(repo.connectionId)?.status ?? null)
      : null
  })
  return (
    <ProjectHeaderActions
      // Why: the row's pointerdown arms a worktree drag; the action buttons must not.
      onPointerDown={(event) => event.stopPropagation()}
    >
      <RepoHeaderProjectActionsMenu
        repo={repo}
        label={header.label}
        projectGroups={ctx.projectGroups}
        actions={ctx.projectActions}
      />
      <RepoHeaderCreateWorkspaceButton
        repo={repo}
        label={header.label}
        createState={createState}
        onCreateForRepo={ctx.projectActions.onCreateForRepo}
      />
    </ProjectHeaderActions>
  )
}
