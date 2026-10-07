import React from 'react'
import type { GlobalSettings } from '../../../../shared/global-settings-types'
import { SearchableSetting } from './SearchableSetting'
import { SettingsSwitchRow } from './SettingsFormControls'
import { getCompactProjectRowsEntry } from './appearance-sidebar-search'

export function CompactProjectRowsSetting({
  settings,
  updateSettings
}: {
  settings: GlobalSettings
  updateSettings: (updates: Partial<GlobalSettings>) => void
}): React.JSX.Element {
  const entry = getCompactProjectRowsEntry()
  return (
    <SearchableSetting
      title={entry.title}
      description={entry.description}
      keywords={entry.keywords}
    >
      <SettingsSwitchRow
        label={entry.title}
        description={entry.description}
        checked={settings.compactProjectRows === true}
        onChange={() =>
          updateSettings({ compactProjectRows: !(settings.compactProjectRows === true) })
        }
      />
    </SearchableSetting>
  )
}
