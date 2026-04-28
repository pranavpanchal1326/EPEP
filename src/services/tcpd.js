/**
 * @fileoverview TCPD Lok Dhaba API Service — EPEP Election Data
 * @module tcpd
 *
 * Integration with the Trivedi Centre for Political Data (TCPD)
 * Lok Dhaba API — providing Indian election results from 1962-2024.
 *
 * Fallback strategy:
 *   1. Live TCPD API → most current data
 *   2. data.gov.in   → official government backup
 *   3. static-fallback.js → bundled 18-election dataset
 *
 * @see https://tcpd.ashoka.edu.in/lok-dhaba
 * @see src/data/static-fallback.js
 */

const BASE = import.meta.env.VITE_TCPD_BASE_URL

/**
 * Fetch election results from TCPD.
 *
 * @param {string|number} year          - Election year
 * @param {string} [electionType='GE'] - Election type (default 'GE' for General Election)
 * @returns {Promise<Array|Object|null>} Results data or null on failure
 */
export const fetchElectionResults = async (year, electionType = 'GE') => {
  try {
    const res = await fetch(`${BASE}/elections?year=${year}&type=${electionType}`)
    if (!res.ok) {
      console.warn('[EPEP TCPD] fetchElectionResults failed:', `HTTP ${res.status}`)
      return null
    }
    return await res.json()
  } catch (err) {
    console.error('[EPEP TCPD] fetchElectionResults failed:', err.message)
    return null
  }
}

/**
 * Fetch constituency data from TCPD.
 *
 * @param {string} constituency - Name of the constituency
 * @returns {Promise<Object|null>} Constituency profile or null on failure
 */
export const fetchConstituencyData = async (constituency) => {
  try {
    const res = await fetch(`${BASE}/constituency?name=${encodeURIComponent(constituency)}`)
    if (!res.ok) {
      console.warn('[EPEP TCPD] fetchConstituencyData failed:', `HTTP ${res.status}`)
      return null
    }
    return await res.json()
  } catch (err) {
    console.error('[EPEP TCPD] fetchConstituencyData failed:', err.message)
    return null
  }
}

/**
 * Fetch party performance data from TCPD.
 *
 * @returns {Promise<Array|Object|null>} Party performance statistics or null on failure
 */
export const fetchPartyPerformance = async () => {
  try {
    const res = await fetch(`${BASE}/parties?type=GE`)
    if (!res.ok) {
      console.warn('[EPEP TCPD] fetchPartyPerformance failed:', `HTTP ${res.status}`)
      return null
    }
    return await res.json()
  } catch (err) {
    console.error('[EPEP TCPD] fetchPartyPerformance failed:', err.message)
    return null
  }
}
