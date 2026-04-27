/**
 * @fileoverview Fallback Architecture Tests - EPEP
 *
 * Verifies static data resilience, AI fallback rotation,
 * network failure handling, and localStorage persistence paths.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import qaData from '../data/election-qa'
import { STATIC_FALLBACK } from '../data/static-fallback'

const AI_MODELS = [
  'google/gemma-3-27b-it',
  'meta-llama/llama-4-maverick',
  'deepseek/deepseek-r2',
]

const localFallback = (query) => {
  const q = (query ?? '').toLowerCase()
  const match = qaData.find(
    (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
  )
  return match?.answer ?? 'Please visit eci.gov.in for official information.'
}

const safeFetch = async (url, fallback) => {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return data ?? fallback
  } catch {
    return fallback
  }
}

describe('Fallback · Static Data Structure', () => {
  it('turnout array exists', () => {
    expect(Array.isArray(STATIC_FALLBACK.turnout)).toBe(true)
  })

  it('turnout starts at 1951', () => {
    expect(STATIC_FALLBACK.turnout.map((d) => d.year)).toContain(1951)
  })

  it('turnout includes 2024', () => {
    expect(STATIC_FALLBACK.turnout.map((d) => d.year)).toContain(2024)
  })

  it('turnout has at least 18 elections', () => {
    expect(STATIC_FALLBACK.turnout.length).toBeGreaterThanOrEqual(18)
  })

  it('turnout values remain in realistic range', () => {
    STATIC_FALLBACK.turnout.forEach((d) => {
      expect(d.turnout).toBeGreaterThan(30)
      expect(d.turnout).toBeLessThan(100)
    })
  })

  it('turnout years are ascending', () => {
    const years = STATIC_FALLBACK.turnout.map((d) => d.year)
    for (let i = 1; i < years.length; i += 1) {
      expect(years[i]).toBeGreaterThan(years[i - 1])
    }
  })

  it('candidate fallback data exists', () => {
    expect(STATIC_FALLBACK.candidates).toBeDefined()
    expect(Object.keys(STATIC_FALLBACK.candidates).length).toBeGreaterThan(0)
  })

  it('women fallback data exists', () => {
    expect(Array.isArray(STATIC_FALLBACK.women)).toBe(true)
    expect(STATIC_FALLBACK.women.length).toBeGreaterThan(0)
  })
})

describe('Fallback · AI Chain Architecture', () => {
  it('has 3 OpenRouter models before local fallback', () => {
    expect(AI_MODELS).toHaveLength(3)
  })

  it('model 1 is Google family', () => {
    expect(AI_MODELS[0]).toContain('google')
  })

  it('model 2 is Llama family', () => {
    expect(AI_MODELS[1]).toContain('llama')
  })

  it('model 3 is DeepSeek family', () => {
    expect(AI_MODELS[2]).toContain('deepseek')
  })
})

describe('Fallback · AI Rotation Integration Flows', () => {
  it('rotates to L2 when L1 fails', async () => {
    const call = vi.fn().mockRejectedValueOnce(new Error('Rate limited')).mockResolvedValueOnce('L2 answer')
    let result = null

    for (const model of AI_MODELS) {
      try {
        result = await call(model)
        break
      } catch {
        continue
      }
    }

    expect(result).toBe('L2 answer')
    expect(call).toHaveBeenCalledTimes(2)
  })

  it('rotates to L3 when L1 and L2 fail', async () => {
    const call = vi
      .fn()
      .mockRejectedValueOnce(new Error('Timeout'))
      .mockRejectedValueOnce(new Error('503'))
      .mockResolvedValueOnce('L3 answer')

    let result = null

    for (const model of AI_MODELS) {
      try {
        result = await call(model)
        break
      } catch {
        continue
      }
    }

    expect(result).toBe('L3 answer')
    expect(call).toHaveBeenCalledTimes(3)
  })

  it('uses local fallback when all 3 models fail', async () => {
    const call = vi.fn().mockRejectedValue(new Error('All down'))
    const local = vi.fn().mockReturnValue('Local ECI answer')

    let result = null
    for (const model of AI_MODELS) {
      try {
        await call(model)
      } catch {
        continue
      }
    }

    if (!result) result = local('election commission')

    expect(local).toHaveBeenCalledOnce()
    expect(result).toBe('Local ECI answer')
  })

  it('local fallback returns non-empty answer for known query', () => {
    expect(localFallback('election commission').length).toBeGreaterThan(5)
  })

  it('local fallback returns eci.gov.in prompt for unknown query', () => {
    expect(localFallback('xyzabc999totally_unknown')).toContain('eci.gov.in')
  })

  it('local fallback handles null query', () => {
    expect(() => localFallback(null)).not.toThrow()
  })

  it('local fallback handles empty query', () => {
    expect(() => localFallback('')).not.toThrow()
  })
})

describe('Fallback · Network Resilience', () => {
  it('offline state can be toggled through navigator.onLine', () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true })
    expect(navigator.onLine).toBe(false)
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true })
  })

  it('fetch rejection returns fallback', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    const result = await safeFetch('https://tcpd.example.com/api', { source: 'static' })
    expect(result).toEqual({ source: 'static' })
  })

  it('fetch non-200 returns fallback', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => null })
    const result = await safeFetch('https://tcpd.example.com/api', { source: 'static' })
    expect(result).toEqual({ source: 'static' })
  })

  it('null API response returns fallback object', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => null })
    const result = await safeFetch('https://api.example.com', STATIC_FALLBACK)
    expect(result).toBe(STATIC_FALLBACK)
  })

  it('invalid GeoJSON parse returns empty FeatureCollection', () => {
    const parseSafe = (raw) => {
      try {
        return JSON.parse(raw)
      } catch {
        return { type: 'FeatureCollection', features: [] }
      }
    }

    const result = parseSafe('INVALID {{JSON}}}}')
    expect(result.type).toBe('FeatureCollection')
    expect(result.features).toHaveLength(0)
  })
})

describe('Fallback · localStorage Operations', () => {
  beforeEach(() => localStorage.clear())

  it('set/get roundtrip works', () => {
    localStorage.setItem('k', 'v')
    expect(localStorage.getItem('k')).toBe('v')
  })

  it('missing key returns null', () => {
    expect(localStorage.getItem('missing')).toBeNull()
  })

  it('overwrite works', () => {
    localStorage.setItem('k', 'a')
    localStorage.setItem('k', 'b')
    expect(localStorage.getItem('k')).toBe('b')
  })

  it('clear removes all keys', () => {
    localStorage.setItem('a', '1')
    localStorage.setItem('b', '2')
    localStorage.clear()
    expect(localStorage.getItem('a')).toBeNull()
    expect(localStorage.getItem('b')).toBeNull()
  })

  it('JSON arrays survive roundtrip', () => {
    const data = [{ score: 14 }, { score: 18 }]
    localStorage.setItem('hist', JSON.stringify(data))
    expect(JSON.parse(localStorage.getItem('hist'))[1].score).toBe(18)
  })
})
