/**
 * @fileoverview Security Sanitization Utility Tests - EPEP
 */

import { describe, it, expect } from 'vitest'
import { sanitiseInput, sanitiseQuery, isValidAPIResponse } from '../lib/sanitise'

describe('sanitiseInput', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitiseInput(null)).toBe('')
    expect(sanitiseInput(undefined)).toBe('')
    expect(sanitiseInput(42)).toBe('')
  })

  it('strips html tags', () => {
    expect(sanitiseInput('<b>Hello</b>')).toBe('Hello')
  })

  it('strips javascript protocol', () => {
    expect(sanitiseInput('javascript:alert(1)')).toBe('alert(1)')
  })

  it('strips inline event handlers', () => {
    expect(sanitiseInput('onclick=alert(1)')).toBe('alert(1)')
  })

  it('trims surrounding spaces', () => {
    expect(sanitiseInput('  hello  ')).toBe('hello')
  })

  it('enforces max length', () => {
    expect(sanitiseInput('a'.repeat(600), 500)).toHaveLength(500)
  })
})

describe('sanitiseQuery', () => {
  it('returns empty string for non-string query', () => {
    expect(sanitiseQuery(null)).toBe('')
  })

  it('strips html and trims text', () => {
    expect(sanitiseQuery('  <i>query</i>  ')).toBe('query')
  })

  it('enforces query max length', () => {
    expect(sanitiseQuery('a'.repeat(300), 200)).toHaveLength(200)
  })
})

describe('isValidAPIResponse', () => {
  it('rejects null, arrays, and primitives', () => {
    expect(isValidAPIResponse(null, ['a'])).toBe(false)
    expect(isValidAPIResponse([], ['a'])).toBe(false)
    expect(isValidAPIResponse('text', ['a'])).toBe(false)
  })

  it('validates required keys in object', () => {
    expect(isValidAPIResponse({ a: 1, b: 2 }, ['a', 'b'])).toBe(true)
    expect(isValidAPIResponse({ a: 1 }, ['a', 'b'])).toBe(false)
  })

  it('passes for empty required list with object input', () => {
    expect(isValidAPIResponse({ ok: true })).toBe(true)
  })
})
