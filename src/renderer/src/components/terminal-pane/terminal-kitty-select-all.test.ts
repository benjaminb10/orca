import { describe, expect, it } from 'vitest'
import {
  encodeTerminalMenuSelectAllKitty,
  shouldForwardSelectAllToKittyApp
} from './terminal-kitty-select-all'

describe('terminal kitty select-all forwarding', () => {
  it('forwards only on macOS once the app negotiated kitty flags', () => {
    expect(shouldForwardSelectAllToKittyApp(true, 1)).toBe(true)
    expect(shouldForwardSelectAllToKittyApp(true, 0)).toBe(false)
    expect(shouldForwardSelectAllToKittyApp(false, 1)).toBe(false)
  })

  it('encodes the Edit-menu select-all as a Cmd+A tap', () => {
    expect(encodeTerminalMenuSelectAllKitty(1)).toBe('\x1b[97;9u')
    // Why: with event types the app also needs the release, or Super+A looks held.
    expect(encodeTerminalMenuSelectAllKitty(3)).toBe('\x1b[97;9u\x1b[97;9:3u')
  })
})
