/**
 * @fileoverview EPEP Global Test Environment Setup
 *
 * Configures the jsdom browser simulation environment for all test suites.
 * Mocks browser APIs that are unavailable in Node.js.
 */

import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'

const buildStorage = () => {
  let store = {}
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => {
      store[k] = String(v)
    },
    removeItem: (k) => {
      delete store[k]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (i) => Object.keys(store)[i] ?? null,
  }
}

Object.defineProperty(window, 'localStorage', { value: buildStorage(), writable: true })
Object.defineProperty(window, 'sessionStorage', { value: buildStorage(), writable: true })

global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

Object.defineProperty(navigator, 'onLine', { writable: true, value: true })

global.fetch = vi.fn()
window.scrollTo = vi.fn()

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  vi.clearAllMocks()
})
