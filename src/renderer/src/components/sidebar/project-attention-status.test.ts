import { describe, expect, it } from 'vitest'
import { pickMostUrgentWorktreeStatus } from './project-attention-status'

describe('pickMostUrgentWorktreeStatus', () => {
  it('prefers a question over finished and running work', () => {
    expect(pickMostUrgentWorktreeStatus(['working', 'done', 'permission'])).toBe('permission')
  })

  it('surfaces a finished agent ahead of one still working', () => {
    expect(pickMostUrgentWorktreeStatus(['working', 'inactive', 'done'])).toBe('done')
  })

  it('falls back to inactive when there is nothing to show', () => {
    expect(pickMostUrgentWorktreeStatus([])).toBe('inactive')
    expect(pickMostUrgentWorktreeStatus(['inactive', 'active'])).toBe('active')
  })
})
