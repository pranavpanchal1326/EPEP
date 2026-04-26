import { useState, useMemo, useCallback, useEffect } from 'react'

const BEST_KEY = 'epep_quiz_best_score'
const COUNT_KEY = 'epep_quiz_session_count'

const safeRead = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const useLocalScore = (currentStats, currentMythBusterScore) => {
  const [bestScore, setBestScore] = useState(() => safeRead(BEST_KEY))
  const [sessionCount, setSessionCount] = useState(() => {
    const raw = safeRead(COUNT_KEY)
    return typeof raw === 'number' ? raw : 0
  })

  const isNewBest = useMemo(() => {
    if (!currentStats) return false
    if (!bestScore) return true
    return currentStats.percentage > bestScore.percentage
  }, [currentStats, bestScore])

  const isTied = useMemo(() => {
    if (!currentStats || !bestScore || isNewBest) return false
    return currentStats.percentage === bestScore.percentage
  }, [currentStats, bestScore, isNewBest])

  const scoreDelta = useMemo(() => {
    if (!currentStats || !bestScore) return null
    return currentStats.percentage - bestScore.percentage
  }, [currentStats, bestScore])

  const saveScore = useCallback((stats, mythBusterScore) => {
    if (!stats) return
    const newCount = sessionCount + 1
    safeWrite(COUNT_KEY, newCount)
    setSessionCount(newCount)

    const shouldUpdate = !bestScore || stats.percentage > bestScore.percentage
    if (shouldUpdate) {
      const newBest = {
        percentage: stats.percentage,
        correct: stats.correct,
        total: stats.total,
        grade: stats.grade,
        mythBusterScore,
        achievedAt: new Date().toISOString(),
        sessionCount: newCount
      }
      safeWrite(BEST_KEY, newBest)
      setBestScore(newBest)
    }
  }, [bestScore, sessionCount])

  const clearScore = useCallback(() => {
    try {
      localStorage.removeItem(BEST_KEY)
      localStorage.removeItem(COUNT_KEY)
      setBestScore(null)
      setSessionCount(0)
    } catch {
      // localStorage may be unavailable (incognito/quota)
    }
  }, [])

  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__epep_clearScore = clearScore
      window.__epep_bestScore = () => safeRead(BEST_KEY)
    }
    return () => {
      if (import.meta.env.DEV) {
        delete window.__epep_clearScore
        delete window.__epep_bestScore
      }
    }
  }, [clearScore])

  return { bestScore, sessionCount, isNewBest, isTied, saveScore, clearScore, scoreDelta }
};