import { beforeAll, describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

beforeAll(() => {
  window.scrollTo = vi.fn()
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('MAYIN FRIDAY')).toBeDefined()
  })
})
