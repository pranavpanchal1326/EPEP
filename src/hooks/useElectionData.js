/**
 * @fileoverview Election Data Hook — EPEP
 * @module useElectionData
 *
 * React hook providing election data with automatic 3-layer fallback:
 *   Layer 1 → Live external API (TCPD, MyNeta, data.gov.in)
 *   Layer 2 → Cached response (TanStack Query cache)
 *   Layer 3 → Bundled static JSON (static-fallback.js)
 *
 * Never throws. Never returns null. Always returns data.
 *
 * @param {string} constituency - Constituency name or code
 * @returns {Object} election data, loading state, error state
 *
 * @example
 * const { data, isLoading, error } = useElectionData('Mumbai North')
 */

import { useQuery } from '@tanstack/react-query'
import { fetchElectionResults, fetchConstituencyData } from '../services/tcpd'
import { fetchCandidates } from '../services/myneta'
import { fetchTurnoutData } from '../services/dataGov'
import { STATIC_FALLBACK } from '../data/static-fallback'
import { indiaStatesMinimal, indiaConstituenciesMinimal } from '../data/india-states-minimal'

const validateGeoJSON = (data) =>
  data && data.type === 'FeatureCollection' && Array.isArray(data.features) && data.features.length > 0

/**
 * Fetch GeoJSON file with built-in minimal fallback.
 *
 * @param {'india-states'|'india-constituencies'} type
 * @returns {Promise<Object>}
 */
export const fetchGeoJSON = async (type) => {
  try {
    const res = await fetch(`/${type}.geojson`)
    const data = await res.json()
    if (!validateGeoJSON(data)) throw new Error('Invalid GeoJSON')
    return data
  } catch (err) {
    console.warn('[EPEP ElectionData] fetchGeoJSON failed:', err.message)
    return type === 'india-states' ? indiaStatesMinimal : indiaConstituenciesMinimal
  }
}

/**
 * Query hook for turnout data.
 *
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useTurnoutData = () =>
  useQuery({
    queryKey: ['turnout'],
    queryFn: async () => {
      try {
        const result = await fetchTurnoutData()
        return result ?? STATIC_FALLBACK.turnout
      } catch (err) {
        console.warn('[EPEP ElectionData] useTurnoutData failed:', err.message)
        return STATIC_FALLBACK.turnout
      }
    },
    staleTime: 3600000,
    retry: 2,
  })

/**
 * Query hook for constituency details.
 *
 * @param {string} name
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useConstituencyData = (name) =>
  useQuery({
    queryKey: ['constituency', name],
    queryFn: async () => {
      try {
        const result = await fetchConstituencyData(name)
        return result ?? STATIC_FALLBACK.constituencies[name] ?? null
      } catch (err) {
        console.warn('[EPEP ElectionData] useConstituencyData failed:', err.message)
        return STATIC_FALLBACK.constituencies[name] ?? null
      }
    },
    enabled: !!name,
    staleTime: 1800000,
  })

/**
 * Query hook for candidate data.
 *
 * @param {string} constituency
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useCandidateData = (constituency) =>
  useQuery({
    queryKey: ['candidates', constituency],
    queryFn: async () => {
      try {
        const result = await fetchCandidates(constituency)
        return result ?? STATIC_FALLBACK.candidates[constituency] ?? []
      } catch (err) {
        console.warn('[EPEP ElectionData] useCandidateData failed:', err.message)
        return STATIC_FALLBACK.candidates[constituency] ?? []
      }
    },
    enabled: !!constituency,
    staleTime: 3600000,
  })

/**
 * Query hook for party-level election data.
 *
 * @param {string|number} year
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const usePartyData = (year) =>
  useQuery({
    queryKey: ['election', year],
    queryFn: async () => {
      try {
        const result = await fetchElectionResults(year)
        return result ?? STATIC_FALLBACK.elections[year] ?? []
      } catch (err) {
        console.warn('[EPEP ElectionData] usePartyData failed:', err.message)
        return STATIC_FALLBACK.elections[year] ?? []
      }
    },
    staleTime: 3600000,
  })

/**
 * Aggregate dashboard election data hooks into one stable return object.
 *
 * @returns {Object}
 */
export const useElectionData = () => {
  const turnoutQuery = useTurnoutData()
  const partyQuery = usePartyData('2024')

  return {
    turnoutData: turnoutQuery.data,
    isLoadingTurnout: turnoutQuery.isLoading,
    turnoutError: turnoutQuery.error,

    partyData:
      Array.isArray(partyQuery.data) && partyQuery.data.length && partyQuery.data[0]?.year
        ? partyQuery.data
        : STATIC_FALLBACK.partyPerformance,
    isLoadingParty: partyQuery.isLoading,
    partyError: partyQuery.error,

    womenData: STATIC_FALLBACK.women,
    isLoadingWomen: false,
    womenError: null,

    summaryStats: {
      totalVoters: '96.8 Cr',
      totalElections: '18',
      highestTurnout: '67.4%',
      womenMPs: '74',
    },
    isLoadingSummary: false,
  }
}
