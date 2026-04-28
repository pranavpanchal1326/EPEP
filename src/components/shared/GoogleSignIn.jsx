/**
 * @fileoverview Google Sign-In Button — EPEP Auth Component
 * @module GoogleSignIn
 *
 * Optional authentication button that appears on the Quiz score screen.
 * When signed in, the user's score is saved to Firestore with their
 * Google display name for the leaderboard.
 *
 * Design follows EPEP design system exactly:
 *   - DM Sans typography
 *   - Forest green accent #2D5A3D
 *   - 8px border radius
 *   - BUTTON_PRESS scale animation
 *
 * The component is entirely optional — the quiz works perfectly
 * without authentication. Sign-in only adds leaderboard capability.
 *
 * @param {Object}   props
 * @param {Object}   props.user       - Firebase user object (null if not signed in)
 * @param {boolean}  props.isLoading  - Auth loading state
 * @param {Function} props.onSignIn   - Sign-in trigger function
 * @param {Function} props.onSignOut  - Sign-out trigger function
 *
 * @example
 * <GoogleSignIn
 *   user={user}
 *   isLoading={isLoading}
 *   onSignIn={signIn}
 *   onSignOut={signOut}
 * />
 */

import PropTypes from 'prop-types'

/**
 * GoogleSignIn button component
 * @param {Object} props
 */
const GoogleSignIn = ({ user, isLoading, onSignIn, onSignOut }) => {
  if (isLoading) return null

  if (user) {
    return (
      <div style={{
        display:       'flex',
        alignItems:    'center',
        gap:           '10px',
        padding:       '10px 16px',
        background:    '#EBF2ED',
        borderRadius:  '8px',
        fontFamily:    'DM Sans, sans-serif',
        fontSize:      '14px',
        color:         '#1A1814',
      }}>
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName ?? 'User'}
            width={24}
            height={24}
            style={{ borderRadius: '50%' }}
          />
        )}
        <span>{user.displayName ?? 'Signed in'}</span>
        <button
          type="button"
          onClick={onSignOut}
          aria-label="Sign out of Google account"
          style={{
            background:   'transparent',
            border:       '1px solid #2D5A3D',
            borderRadius: '6px',
            padding:      '4px 10px',
            cursor:       'pointer',
            color:        '#2D5A3D',
            fontFamily:   'DM Sans, sans-serif',
            fontSize:     '12px',
          }}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onSignIn}
      aria-label="Sign in with Google to save score to leaderboard"
      style={{
        display:       'flex',
        alignItems:    'center',
        gap:           '8px',
        padding:       '10px 20px',
        background:    '#FFFFFF',
        border:        '1px solid #E8E4DC',
        borderRadius:  '8px',
        cursor:        'pointer',
        fontFamily:    'DM Sans, sans-serif',
        fontSize:      '14px',
        color:         '#1A1814',
        transition:    'transform 200ms ease',
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
      onMouseUp={e   => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
        <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
        <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
        <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
      </svg>
      Sign in with Google to join leaderboard
    </button>
  )
}

GoogleSignIn.propTypes = {
  user:      PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onSignIn:  PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
}

GoogleSignIn.defaultProps = {
  user: null,
}

export default GoogleSignIn
