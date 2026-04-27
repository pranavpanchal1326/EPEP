/**
 * @fileoverview Input Sanitisation Utilities - EPEP Security Layer
 * @module sanitise
 */

/**
 * Sanitise a user text input.
 *
 * @param {unknown} input
 * @param {number} [maxLen=500]
 * @returns {string}
 */
export const sanitiseInput = (input, maxLen = 500) => {
  if (typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, maxLen)
}

/**
 * Sanitise a search query.
 *
 * @param {unknown} query
 * @param {number} [max=200]
 * @returns {string}
 */
export const sanitiseQuery = (query, max = 200) => {
  if (typeof query !== 'string') return ''
  return query
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, max)
}

/**
 * Validate a top-level API response shape.
 *
 * @param {unknown} data
 * @param {string[]} [required=[]]
 * @returns {boolean}
 */
export const isValidAPIResponse = (data, required = []) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false
  return required.every((key) => key in data)
}
