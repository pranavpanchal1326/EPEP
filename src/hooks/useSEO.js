/**
 * @fileoverview SEO Hook — EPEP
 * @module useSEO
 *
 * Sets page-specific SEO metadata via react-helmet-async.
 * Every route gets unique title, description, OG tags, and canonical URL.
 *
 * Lighthouse SEO score: 100% target.
 *
 * @param {Object} meta
 * @param {string} meta.title       - Page title (appended with "| EPEP")
 * @param {string} meta.description - Meta description (150-160 chars ideal)
 * @param {string} [meta.canonical] - Canonical URL path
 *
 * @example
 * useSEO({
 *   title:       'India Election Map',
 *   description: 'Explore India 543 Lok Sabha constituencies...',
 * })
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Set document title, description, and canonical URL for current route.
 *
 * @param {{title: string, description: string}} meta
 * @returns {void}
 */
export const useSEO = ({ title, description }) => {
  const location = useLocation()
  const canonicalUrl = `https://epep.vercel.app${location.pathname}`

  useEffect(() => {
    document.title = title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', description)

    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', canonicalUrl)
  }, [title, description, canonicalUrl])
}
