/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      // ── COLOUR SYSTEM ──────────────────────────────────────────
      colors: {
        background: '#F8F7F4',
        surface: '#FFFFFF',
        border: '#E8E4DC',
        'text-primary': '#1A1814',
        'text-muted': '#6B6560',
        accent: '#2D5A3D',
        'accent-light': '#EBF2ED',
        'evm-surface': '#1A1814',
        error: '#C0392B',

        // Optional aliases used in some components
        'bg-base': '#F8F7F4',
        'border-soft': '#E8E4DC',
        'text-secondary': '#6B6560',
      },

      // ── TYPOGRAPHY ─────────────────────────────────────────────
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        // Hero headings ONLY — authoritative editorial luxury
        sans:    ['"DM Sans"', 'Inter', 'sans-serif'],
        body:    ['"DM Sans"', 'Inter', 'sans-serif'],
        // All body text, UI labels, descriptions
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        // Numbers, vote counts, dates, stats
      },

      // ── TYPE SCALE ─────────────────────────────────────────────
      fontSize: {
        'h1':    ['48px', { lineHeight: '1.15', fontWeight: '700' }],
        'h2':    ['36px', { lineHeight: '1.2',  fontWeight: '700' }],
        'h3':    ['24px', { lineHeight: '1.3',  fontWeight: '600' }],
        'h4':    ['18px', { lineHeight: '1.4',  fontWeight: '600' }],
        'body':  ['16px', { lineHeight: '1.6',  fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5',  fontWeight: '400' }],
        'data':  ['14px', { lineHeight: '1.4',  fontWeight: '400' }],
        // data → override with JetBrains Mono in component
      },

      // ── SPACING SYSTEM ─────────────────────────────────────────
      // Base unit: 4px — everything is a multiple of 4
      spacing: {
        '0':   '0px',
        '1':   '4px',
        '2':   '8px',
        '3':   '12px',
        '4':   '16px',
        '5':   '20px',
        '6':   '24px',   // Card internal padding
        '7':   '28px',
        '8':   '32px',
        '9':   '36px',
        '10':  '40px',
        '12':  '48px',
        '14':  '56px',
        '16':  '64px',
        '20':  '80px',
        '24':  '96px',
        '30':  '120px',  // Section vertical gaps
        '32':  '128px',
        '40':  '160px',
        '48':  '192px',
        '64':  '256px',
      },

      // ── BORDER RADIUS ──────────────────────────────────────────
      borderRadius: {
        'none':  '0px',
        'sm':    '4px',
        'md':    '8px',    // Buttons
        'lg':    '12px',
        'xl':    '16px',   // Cards
        '2xl':   '24px',
        'full':  '9999px', // Pills, tags
      },

      // ── MAX WIDTH ──────────────────────────────────────────────
      maxWidth: {
        'content': '1280px',  // Main content container max width
        'text':    '720px',   // Reading width for long text
      },

      // ── SHADOWS (elevation) ────────────────────────────────────
      // No heavy shadows — only whisper-thin elevation
      boxShadow: {
        'card':     '0 2px 12px rgba(0, 0, 0, 0.06)',
        'floating': '0 8px 32px rgba(0, 0, 0, 0.10)',
        'navbar':   '0 1px 0px #E8E4DC',
        'evm-glow': '0 0 20px rgba(45, 90, 61, 0.25)',  // green glow on vote
        'none':     'none',
      },

      // ── TRANSITIONS ────────────────────────────────────────────
      transitionDuration: {
        '150': '150ms',  // Map hover
        '200': '200ms',  // Card hover
        '300': '300ms',  // Drawer open
        '400': '400ms',  // Page load fade
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Overshoot spring
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ── GRID ───────────────────────────────────────────────────
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        'gutter': '24px',  // 12-column grid gutters
      },

    },
  },
  plugins: [],
}
