import { describe, expect, it } from 'vitest'
import { safeRedirect } from './safeRedirect'

describe('safeRedirect', () => {
  it('allows an internal absolute path', () => {
    expect(safeRedirect('/my-courses')).toBe('/my-courses')
  })

  it.each([
    'https://evil.com',
    '//evil.com',
    '/\\evil.com',
  ])('rejects unsafe redirect %s', (value) => {
    expect(safeRedirect(value)).toBe('/my-courses')
  })

  it('uses a caller-provided fallback', () => {
    expect(safeRedirect(null, '/login')).toBe('/login')
  })
})
