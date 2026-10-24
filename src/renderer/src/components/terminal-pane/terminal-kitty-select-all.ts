import {
  encodeTerminalKittyCsiU,
  encodeTerminalOptionKittyEvent
} from './terminal-kitty-csi-u-encoding'

type TerminalSelectAllKeyEvent = Parameters<typeof encodeTerminalOptionKittyEvent>[0]

type LayoutCharacterResolver = (code: string, shifted: boolean) => string | undefined

const LATIN_SMALL_A = 0x61

/**
 * Why: an app that negotiated the kitty keyboard protocol (Claude Code, opencode, Codex)
 * can bind Super+A to "select my input"; selecting the whole scrollback would steal the
 * chord from it. Mac-only because only there the select-all chord carries Super (Cmd);
 * Ctrl+Shift+A elsewhere stays Orca's select-all.
 */
export function shouldForwardSelectAllToKittyApp(isMac: boolean, kittyFlags: number): boolean {
  return isMac && kittyFlags > 0
}

/** Encodes the select-all keydown (Cmd+A by default) as the kitty CSI-u the app asked for. */
export function encodeTerminalSelectAllKittyKeyDown(
  event: TerminalSelectAllKeyEvent,
  kittyFlags: number,
  layoutCharacterForCode?: LayoutCharacterResolver
): string | null {
  return encodeTerminalOptionKittyEvent(
    // Why: xterm's own kitty encoder (what terminal-first uses) never reports lock modifiers;
    // matching it keeps CapsLock from turning `97;9u` into a `97;73u` apps do not bind.
    { ...event, capsLock: false, numLock: false },
    {
      flags: kittyFlags,
      type: event.repeat ? 'repeat' : 'press',
      layoutCharacterForCode
    }
  )
}

/**
 * Edit > Select All has no key event, so it sends a canonical Cmd+A tap: the press, plus the
 * release when the app asked for event types, so it never sees Super+A stuck down.
 */
export function encodeTerminalMenuSelectAllKitty(kittyFlags: number): string {
  const key = {
    flags: kittyFlags,
    primaryCodePoint: LATIN_SMALL_A,
    shiftKey: false,
    altKey: false,
    ctrlKey: false,
    metaKey: true
  }
  const press = encodeTerminalKittyCsiU({ ...key, type: 'press' }) ?? ''
  const release = encodeTerminalKittyCsiU({ ...key, type: 'release' }) ?? ''
  return press + release
}
