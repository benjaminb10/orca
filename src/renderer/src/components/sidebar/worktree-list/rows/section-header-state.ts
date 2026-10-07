import type { FolderWorkspacePathStatus } from '../../../../../../shared/folder-workspace-path-status'
import { isConfirmedStaleFolderPathStatus } from '../../../../../../shared/folder-workspace-path-status'
import type { GroupHeaderRow } from '../grouping/row-types'

// Why: repo/project/status/pinned share compact section chrome; flat "All" stays a simple label.
// A collapsed compact project opens by activating one of its workspaces, so only the expanded
// (active) project keeps the chevron to fold itself away.
export function getSectionHeaderExpansion(args: {
  row: GroupHeaderRow
  isCollapsed: boolean
  collapsible: boolean
}): { showCollapseAffordance: boolean; ariaExpanded: boolean | undefined } {
  const { row, isCollapsed } = args
  const isCompactProject = row.compactProjectActive !== undefined
  const showCollapseAffordance =
    row.count > 0 && args.collapsible && (!isCompactProject || row.compactProjectActive === true)
  return {
    showCollapseAffordance,
    ariaExpanded: isCompactProject
      ? row.compactProjectActive === true && !isCollapsed
      : showCollapseAffordance
        ? !isCollapsed
        : undefined
  }
}

export function activateSectionHeader(args: {
  row: GroupHeaderRow
  isCollapsed: boolean
  toggle: () => void
  activateCompactProject: (worktreeIds: readonly string[]) => void
}): void {
  const { row } = args
  if (row.compactProjectActive === undefined) {
    args.toggle()
    return
  }
  // Why: reopening must not land on a project the chevron folded earlier.
  if (args.isCollapsed) {
    args.toggle()
  }
  if (!row.compactProjectActive && row.projectWorktreeIds?.length) {
    args.activateCompactProject(row.projectWorktreeIds)
  }
}

// The folder-scan project group whose parent path is gone can't create new workspaces.
export function isFolderWorkspaceCreateDisabled(status: FolderWorkspacePathStatus | null): boolean {
  return (
    status?.exists === false &&
    (isConfirmedStaleFolderPathStatus(status) || status.reason === 'ambiguous-connection')
  )
}
