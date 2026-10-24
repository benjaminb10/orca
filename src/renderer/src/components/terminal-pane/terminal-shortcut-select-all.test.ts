import { describe, expect, it } from 'vitest'
import {
  resolveTerminalShortcutAction,
  type TerminalShortcutEvent
} from './terminal-shortcut-policy'

function event(overrides: Partial<TerminalShortcutEvent>): TerminalShortcutEvent {
  return {
    key: 'a',
    code: 'KeyA',
    metaKey: false,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    repeat: false,
    ...overrides
  }
}

describe('terminal select-all shortcut', () => {
  it('uses Cmd+A on macOS', () => {
    expect(resolveTerminalShortcutAction(event({ metaKey: true }), true)).toEqual({
      type: 'selectAll'
    })
    expect(resolveTerminalShortcutAction(event({ metaKey: true, repeat: true }), true)).toEqual({
      type: 'selectAll'
    })
  })

  it('uses Ctrl+Shift+A without stealing bare Ctrl+A off macOS', () => {
    expect(resolveTerminalShortcutAction(event({ ctrlKey: true, shiftKey: true }), false)).toEqual({
      type: 'selectAll'
    })
    expect(resolveTerminalShortcutAction(event({ ctrlKey: true }), false)).toBeNull()
  })

  it('forwards Cmd+A as kitty Super+A when the macOS pane negotiated the protocol', () => {
    const kitty = (flags: number) => () => flags
    const resolve = (overrides: Partial<TerminalShortcutEvent>, flags: number) =>
      resolveTerminalShortcutAction(
        event({ metaKey: true, ...overrides }),
        true,
        'false',
        0,
        false,
        undefined,
        undefined,
        kitty(flags)
      )

    expect(resolve({}, 1)).toEqual({ type: 'sendInput', data: '\x1b[97;9u', selectAllChord: true })
    // Why: CapsLock is not reported, matching xterm's own kitty encoder.
    expect(resolve({ getModifierState: (key) => key === 'CapsLock' }, 1)).toEqual({
      type: 'sendInput',
      data: '\x1b[97;9u',
      selectAllChord: true
    })
    // Report-event-types apps get the repeat they asked for.
    expect(resolve({ repeat: true }, 3)).toEqual({
      type: 'sendInput',
      data: '\x1b[97;9:2u',
      selectAllChord: true
    })
    expect(resolve({}, 0)).toEqual({ type: 'selectAll' })
  })

  it('keeps Ctrl+Shift+A as select-all off macOS even with kitty flags', () => {
    expect(
      resolveTerminalShortcutAction(
        event({ ctrlKey: true, shiftKey: true }),
        false,
        'false',
        0,
        false,
        undefined,
        undefined,
        () => 1
      )
    ).toEqual({ type: 'selectAll' })
  })
})
