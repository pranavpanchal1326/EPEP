/**
 * @fileoverview data.gov.in API Service — EPEP
 * @module dataGov
 *
 * Integration with India's official Open Government Data platform.
 * Provides verified electoral statistics as a secondary data source.
 *
 * Used as: Layer 2 in the election data fallback chain.
 * @see https://data.gov.in
 */

const BASE = import.meta.env.VITE_DATA_GOV_BASE_URL
const KEY = import.meta.env.VITE_DATA_GOV_API_KEY

/**
 * Fetch voter turnout data by year.
 *
 * @returns {Promise<Object|null>} Turnout statistics or null on failure
 */
export const fetchTurnoutData = async () => {
  try {
    const res = await fetch(`${BASE}/7c0e8f27-e6c3-4d4b-b4d2-1b73e5d06b02?api-key=${KEY}&format=json&limit=20`)
    if (!res.ok) {
      console.warn('[EPEP DataGov] fetchTurnoutData failed:', `HTTP ${res.status}`)
      return null
    }
    return await res.json()
  } catch (err) {
    console.error('[EPEP DataGov] fetchTurnoutData failed:', err.message)
    return null
  }
}

/**
 * Fetch state-wise election data.
 *
 * @param {string} state - Name of the Indian state
 * @returns {Promise<Object|null>} State-level electoral data or null on failure
 */
export const fetchStateData = async (state) => {
  try {
    const res = await fetch(`${BASE}/3a1ab4d0-b3a4-4c3b-b6b6-4d3e9a4c2a1b?api-key=${KEY}&format=json&filters[state_name]=${state}`)
    if (!res.ok) {
      console.warn('[EPEP DataGov] fetchStateData failed:', `HTTP ${res.status}`)
      return null
    }
    return await res.json()
  } catch (err) {
    console.error('[EPEP DataGov] fetchStateData failed:', err.message)
    return null
  }
}
