/**
 * @fileoverview Media Query Hook — EPEP
 * @module useMediaQuery
 *
 * Reactive hook for CSS media query matching.
 * Used throughout EPEP for responsive behaviour:
 *   - Map: side panel vs bottom sheet
 *   - EVM: side-by-side vs stacked layout
 *   - Dashboard: chart height 400px vs 280px
 *   - Chat: corner drawer vs full-screen sheet
 *
 * @param {string}  query - CSS media query string
 * @returns {boolean}       True when query matches current viewport
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 639px)')
 * const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)')
 */

import { useState, useEffect } from 'react'

/**
 * Reactively evaluate a media query string.
 *
 * @param {string} query
 * @returns {boolean}
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) setMatches(media.matches)

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query, matches])

  return matches
}
