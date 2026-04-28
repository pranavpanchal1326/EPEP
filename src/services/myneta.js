/**
 * @fileoverview MyNeta Candidate Data Service — EPEP
 * @module myneta
 *
 * Fetches candidate disclosure data from MyNeta.info — including
 * criminal records, asset declarations, and education qualifications.
 * Used in the India Map state panel and EVM Simulator.
 *
 * Fallback: Bundled static candidate data in static-fallback.js.
 *
 * @see https://myneta.info
 */

const BASE = import.meta.env.VITE_MYNETA_BASE_URL

/**
 * Fetch constituency candidate list from MyNeta.
 *
 * @param {string} constituency - Name of the constituency
 * @param {number} [year=2024] - Election year
 * @returns {Promise<Array|Object|null>} Candidate list or null on failure
 */
export const fetchCandidates = async (constituency, year = 2024) => {
  try {
    const res = await fetch(`${BASE}/candidates?constituency=${encodeURIComponent(constituency)}&year=${year}`)
    if (!res.ok) {
      console.warn('[EPEP MyNeta] fetchCandidates failed:', `HTTP ${res.status}`)
      return null
    }
    return await res.json()
  } catch (err) {
    console.error('[EPEP MyNeta] fetchCandidates failed:', err.message)
    return null
  }
}

/**
 * Fetch detailed data for a single candidate from MyNeta.
 *
 * @param {string|number} candidateId - Unique ID of the candidate
 * @returns {Promise<Object|null>} Candidate profile or null on failure
 */
export const fetchCandidateDetail = async (candidateId) => {
  try {
    const res = await fetch(`${BASE}/candidate/${candidateId}`)
    if (!res.ok) {
      console.warn('[EPEP MyNeta] fetchCandidateDetail failed:', `HTTP ${res.status}`)
      return null
    }
    return await res.json()
  } catch (err) {
    console.error('[EPEP MyNeta] fetchCandidateDetail failed:', err.message)
    return null
  }
}
