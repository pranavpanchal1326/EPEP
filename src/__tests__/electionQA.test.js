/**
 * @fileoverview Election Q&A Database Tests - EPEP
 *
 * Validates volume, schema, source credibility, category spread,
 * and search behavior for the Q&A knowledge base.
 */

import { describe, it, expect } from 'vitest'
import qaData, { searchQA } from '../data/election-qa'

const VALID_SOURCE_HINTS = [
  'eci',
  'constitution',
  'representation of the people',
  'rpa',
  'supreme court',
  'symbols',
  'delimitation',
]

const REQUIRED_CATEGORIES = [
  'Voter Registration',
  'Voting Day',
  'Nomination Process',
  'Model Code of Conduct',
  'Political Parties',
  'Election Finance',
  'Counting & Results',
  'Election Commission',
  'Reservation',
]

const safeSearch = (data, query) => {
  if (!query?.trim()) return data
  const lower = query.toLowerCase().trim()
  return data.filter(
    (d) =>
      d.question.toLowerCase().includes(lower) ||
      d.answer.toLowerCase().includes(lower) ||
      d.category.toLowerCase().includes(lower)
  )
}

describe('Q&A · Volume and Schema', () => {
  it('has at least 20 entries', () => {
    expect(qaData.length).toBeGreaterThanOrEqual(20)
  })

  it('every entry has required core fields', () => {
    qaData.forEach((d, i) => {
      expect(d, `[${i}]`).toHaveProperty('id')
      expect(d, `[${i}]`).toHaveProperty('question')
      expect(d, `[${i}]`).toHaveProperty('answer')
      expect(d, `[${i}]`).toHaveProperty('category')
      expect(d, `[${i}]`).toHaveProperty('source')
      expect(d, `[${i}]`).toHaveProperty('sourceUrl')
      expect(d, `[${i}]`).toHaveProperty('tags')
    })
  })

  it('question text is not too short', () => {
    qaData.forEach((d, i) => {
      expect(d.question.length, `[${i}]`).toBeGreaterThan(5)
    })
  })

  it('answer text is not too short', () => {
    qaData.forEach((d, i) => {
      expect(d.answer.length, `[${i}]`).toBeGreaterThan(10)
    })
  })

  it('category is non-empty', () => {
    qaData.forEach((d, i) => {
      expect(d.category.trim().length, `[${i}]`).toBeGreaterThan(0)
    })
  })

  it('tags are arrays', () => {
    qaData.forEach((d) => {
      expect(Array.isArray(d.tags)).toBe(true)
    })
  })

  it('source URL looks like HTTP(S)', () => {
    qaData.forEach((d) => {
      expect(d.sourceUrl).toMatch(/^https?:\/\//)
    })
  })

  it('IDs are unique', () => {
    const ids = qaData.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Q&A · Source and Category Integrity', () => {
  it('every source references a civic authority or official doc', () => {
    qaData.forEach((d, i) => {
      const source = d.source.toLowerCase()
      const valid = VALID_SOURCE_HINTS.some((hint) => source.includes(hint))
      expect(valid, `[${i}] invalid source: ${d.source}`).toBe(true)
    })
  })

  it('covers all required civic categories', () => {
    const allCategories = new Set(qaData.map((q) => q.category))
    REQUIRED_CATEGORIES.forEach((cat) => {
      expect(allCategories.has(cat), `Missing category: ${cat}`).toBe(true)
    })
  })
})

describe('Q&A · Exported Search Behavior', () => {
  it('null query returns all results', () => {
    expect(searchQA(null)).toHaveLength(qaData.length)
  })

  it('empty query returns all results', () => {
    expect(searchQA('')).toHaveLength(qaData.length)
  })

  it('search for evm returns one or more results', () => {
    expect(searchQA('evm').length).toBeGreaterThan(0)
  })

  it('search for voter registration intent returns one or more results', () => {
    expect(searchQA('register').length).toBeGreaterThan(0)
  })

  it('search for model code returns one or more results', () => {
    expect(searchQA('model code').length).toBeGreaterThan(0)
  })

  it('search for nonsense returns no results', () => {
    expect(searchQA('xyzabc999notreal')).toHaveLength(0)
  })

  it('search is case-insensitive for common terms', () => {
    const a = searchQA('evm').length
    const b = searchQA('EVM').length
    const c = searchQA('EvM').length
    expect(a).toBe(b)
    expect(b).toBe(c)
  })

  it('search does not throw on long input', () => {
    expect(() => searchQA('x'.repeat(500))).not.toThrow()
  })

  it('search does not throw on special characters', () => {
    expect(() => searchQA('<script>alert(1)</script>')).not.toThrow()
  })
})

describe('Q&A · Safe Search Utility Edge Cases', () => {
  it('trimmed whitespace query returns all', () => {
    expect(safeSearch(qaData, '   ')).toHaveLength(qaData.length)
  })

  it('single-char query does not throw', () => {
    expect(() => safeSearch(qaData, 'a')).not.toThrow()
  })

  it('search utility supports category lookup', () => {
    const results = safeSearch(qaData, 'Election Commission')
    expect(results.length).toBeGreaterThan(0)
  })

  it('search utility handles null input safely', () => {
    expect(() => safeSearch(qaData, null)).not.toThrow()
  })
})
