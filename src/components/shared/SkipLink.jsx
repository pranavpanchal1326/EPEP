/**
 * @fileoverview Skip Navigation Link - WCAG 2.1 AA
 * @module SkipLink
 */

const SkipLink = () => (
  <a
    href="#main-content"
    style={{
      position: 'absolute',
      top: '-100%',
      left: '16px',
      zIndex: 9999,
      padding: '12px 24px',
      background: '#2D5A3D',
      color: '#FFFFFF',
      borderRadius: '0 0 8px 8px',
      fontFamily: 'DM Sans, sans-serif',
      fontSize: '14px',
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'top 200ms ease',
    }}
    onFocus={(e) => {
      e.currentTarget.style.top = '0'
    }}
    onBlur={(e) => {
      e.currentTarget.style.top = '-100%'
    }}
  >
    Skip to main content
  </a>
)

export default SkipLink
