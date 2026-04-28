/**
 * @fileoverview Quiz Leaderboard — EPEP Firestore Integration
 * @module Leaderboard
 *
 * Displays top quiz scores fetched from Firebase Firestore.
 * Rendered on the ScoreScreen after quiz completion.
 *
 * Data flow:
 *   ScoreScreen completes → saveQuizResult() → Firestore
 *   Leaderboard mounts    → getLeaderboard() → Firestore → display
 *
 * Fallback: If Firestore unavailable, component renders nothing.
 * The quiz experience is never degraded by leaderboard failure.
 *
 * @param {Object}  props
 * @param {boolean} props.refreshTrigger - Flip to trigger data refresh
 *
 * @example
 * <Leaderboard refreshTrigger={scoreJustSaved} />
 */

import { useState, useEffect } from 'react'
import PropTypes                from 'prop-types'
import { getLeaderboard }       from '../../lib/firebase'

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} id          - Firestore document ID
 * @property {string} displayName - User display name
 * @property {number} percentage  - Score percentage (0-100)
 * @property {string} grade       - Grade label
 */

/**
 * Leaderboard component — shows top Firestore quiz scores
 * @param {Object} props
 */
const Leaderboard = ({ refreshTrigger }) => {
  const [scores,    setScores]    = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      const data = await getLeaderboard(10)
      if (!cancelled) {
        setScores(data)
        setIsLoading(false)
      }
    }

    load()

    // Cleanup — prevent state update on unmounted component
    return () => { cancelled = true }
  }, [refreshTrigger])

  // Don't render anything if no data and not loading
  if (!isLoading && scores.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Quiz leaderboard — top scores"
      style={{
        marginTop:    '24px',
        padding:      '20px',
        background:   '#FFFFFF',
        border:       '1px solid #E8E4DC',
        borderRadius: '16px',
        fontFamily:   'DM Sans, sans-serif',
        maxWidth:     '400px',
        margin:       '24px auto 0',
      }}
    >
      <h3 style={{
        color:        '#1A1814',
        fontSize:     '16px',
        fontWeight:   600,
        marginBottom: '16px',
      }}>
        🏆 Top Scores
      </h3>

      {isLoading ? (
        <p style={{ color: '#6B6560', fontSize: '14px' }}>
          Loading leaderboard...
        </p>
      ) : (
        <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {scores.map((entry, index) => (
            <li
              key={entry.id}
              style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'center',
                padding:        '8px 0',
                borderBottom:   index < scores.length - 1
                  ? '1px solid #E8E4DC' : 'none',
              }}
            >
              <span style={{ color: '#6B6560', fontSize: '13px', minWidth: '24px' }}>
                {index + 1}.
              </span>
              <span style={{
                color:    '#1A1814',
                fontSize: '14px',
                flexGrow: 1,
                padding:  '0 8px',
              }}>
                {entry.displayName ?? 'Anonymous Voter'}
              </span>
              <span style={{
                color:      '#2D5A3D',
                fontSize:   '14px',
                fontWeight: 600,
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {entry.percentage}%
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

Leaderboard.propTypes = {
  /** Flip this boolean to trigger a leaderboard data refresh */
  refreshTrigger: PropTypes.bool,
}

Leaderboard.defaultProps = {
  refreshTrigger: false,
}

export default Leaderboard
