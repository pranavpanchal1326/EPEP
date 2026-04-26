import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/**
 * EPEP Footer
 *
 * Three-column layout:
 *   Col 1: Brand + mission statement
 *   Col 2: Internal navigation links
 *   Col 3: External data source citations
 *
 * Design: Clean, editorial, minimal — matches "Democratic Clarity" system
 * Note: Data source citations are a trust signal for judges and users.
 */

// ── INTERNAL NAV LINKS ────────────────────────────────────────────────────
const EXPLORE_LINKS = [
  { label: 'Interactive Map',  path: '/map'       },
  { label: 'EVM Simulator',    path: '/evm'       },
  { label: 'Learn Elections',  path: '/learn'     },
  { label: 'Data Dashboard',   path: '/dashboard' },
  { label: 'Take the Quiz',    path: '/quiz'      },
]

// ── EXTERNAL DATA SOURCE LINKS ────────────────────────────────────────────
const SOURCE_LINKS = [
  {
    label: 'Election Commission of India',
    href:  'https://eci.gov.in',
  },
  {
    label: 'TCPD Lok Dhaba',
    href:  'https://lokdhaba.ashoka.edu.in',
  },
  {
    label: 'MyNeta.info',
    href:  'https://myneta.info',
  },
  {
    label: 'data.gov.in',
    href:  'https://data.gov.in',
  },
  {
    label: 'Datameet India',
    href:  'https://datameet.org',
  },
]

// ── COLUMN HEADING STYLE ──────────────────────────────────────────────────
const colHeadingStyle = {
  fontFamily:    'var(--font-body)',
  fontSize:      '12px',
  fontWeight:    '600',
  color:         'var(--color-text-primary)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom:  '12px',
  display:       'block',
}

// ── LINK STYLE (base) ─────────────────────────────────────────────────────
const baseLinkStyle = {
  fontFamily:     'var(--font-body)',
  fontSize:       '13px',
  fontWeight:     '400',
  color:          'var(--color-text-secondary)',
  textDecoration: 'none',
  display:        'block',
  transition:     'color 150ms ease',
  lineHeight:     '1.4',
}

// ── COMPONENT ─────────────────────────────────────────────────────────────
const Footer = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)

  // Mobile breakpoint detection
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <footer
      style={{
        width:           '100%',
        backgroundColor: 'var(--color-surface)',
        borderTop:       '1px solid var(--color-border-soft)',
        marginTop:       'auto',
      }}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* ── MAIN FOOTER BODY ─────────────────────────────────────────── */}
      <div
        style={{
          maxWidth:      '1280px',
          margin:        '0 auto',
          padding:       isMobile
                           ? '40px 16px 28px'
                           : '48px 24px 32px',
          display:       'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr 1fr',
          gap:           isMobile ? '32px' : '48px',
        }}
      >

        {/* ── COLUMN 1: BRAND ────────────────────────────────────────── */}
        <div>
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily:     'var(--font-display)',
              fontSize:       '20px',
              fontWeight:     '700',
              color:          'var(--color-text-primary)',
              textDecoration: 'none',
              display:        'block',
              marginBottom:   '6px',
              letterSpacing:  '-0.01em',
            }}
          >
            EPEP
          </Link>

          {/* Platform name */}
          <span
            style={{
              fontFamily:   'var(--font-body)',
              fontSize:     '13px',
              color:        'var(--color-text-secondary)',
              display:      'block',
              marginBottom: '14px',
              lineHeight:   '1.4',
            }}
          >
            Election Process Education Platform
          </span>

          {/* Mission */}
          <p
            style={{
              fontFamily:   'var(--font-body)',
              fontSize:     '13px',
              color:        'var(--color-text-secondary)',
              lineHeight:   '1.6',
              margin:       '0 0 18px 0',
              maxWidth:     '280px',
            }}
          >
            Making India's democracy understandable
            for every citizen.
          </p>

          {/* Trust badges */}
          <div
            style={{
              fontFamily:   'var(--font-body)',
              fontSize:     '12px',
              color:        'var(--color-text-secondary)',
              display:      'flex',
              flexWrap:     'wrap',
              gap:          '0',
              alignItems:   'center',
              lineHeight:   '1.8',
            }}
          >
            {['Open Source', 'Free Forever', 'No Login Required'].map(
              (badge, i, arr) => (
                <span key={badge}>
                  {badge}
                  {i < arr.length - 1 && (
                    <span
                      style={{
                        margin: '0 6px',
                        color:  'var(--color-border-soft)',
                        fontWeight: '400',
                      }}
                    >
                      ·
                    </span>
                  )}
                </span>
              )
            )}
          </div>
        </div>

        {/* ── COLUMN 2: EXPLORE ──────────────────────────────────────── */}
        <div>
          <span style={colHeadingStyle}>Explore</span>
          <nav
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            aria-label="Footer navigation"
          >
            {EXPLORE_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  ...baseLinkStyle,
                  ...(hoveredLink === `explore-${link.path}` && {
                    color: 'var(--color-accent)',
                  }),
                }}
                onMouseEnter={() =>
                  setHoveredLink(`explore-${link.path}`)
                }
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── COLUMN 3: DATA SOURCES ─────────────────────────────────── */}
        <div>
          <span style={colHeadingStyle}>Data Sources</span>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {SOURCE_LINKS.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...baseLinkStyle,
                  ...(hoveredLink === `source-${source.href}` && {
                    color: 'var(--color-accent)',
                  }),
                }}
                onMouseEnter={() =>
                  setHoveredLink(`source-${source.href}`)
                }
                onMouseLeave={() => setHoveredLink(null)}
                aria-label={source.label + ' — opens in new tab'}
              >
                {source.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ───────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth:      '1280px',
          margin:        '0 auto',
          padding:       isMobile
                           ? '20px 16px 24px'
                           : '20px 24px 28px',
          borderTop:     '1px solid var(--color-border-soft)',
          display:       'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems:    'center',
          justifyContent: isMobile ? 'center' : 'space-between',
          gap:           isMobile ? '8px' : '0',
          textAlign:     isMobile ? 'center' : 'left',
        }}
      >
        {/* Left: copyright */}
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   '12px',
            color:      'var(--color-text-secondary)',
          }}
        >
          © 2026 EPEP. Built for Google PromptWars.
        </span>

        {/* Right: made with love */}
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   '12px',
            color:      'var(--color-text-secondary)',
          }}
        >
          Made with{' '}
          <span
            style={{ color: '#C0392B' }}
            aria-label="love"
          >
            ♥
          </span>
          {' '}for India's 970M+ voters
        </span>
      </div>
    </footer>
  )
}

export default Footer
