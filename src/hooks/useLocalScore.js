import { useState, useMemo, useCallback, useEffect } from 'react'
import { storage } from '../services/storage'
import { STORAGE_KEYS } from '../data/constants'

export const useLocalScore = (currentStats, currentMythBusterScore) => {
  const [bestScore, setBestScore] = useState(() => storage.get(STORAGE_KEYS.QUIZ_BEST_SCORE))
  const [sessionCount, setSessionCount] = useState(() => {
    const raw = storage.get(STORAGE_KEYS.QUIZ_SESSION_COUNT)
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
    storage.set(STORAGE_KEYS.QUIZ_SESSION_COUNT, newCount)
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
      storage.set(STORAGE_KEYS.QUIZ_BEST_SCORE, newBest)
      setBestScore(newBest)
    }
  }, [bestScore, sessionCount])

  const clearScore = useCallback(() => {
    try {
    storage.remove(STORAGE_KEYS.QUIZ_BEST_SCORE)
    storage.remove(STORAGE_KEYS.QUIZ_SESSION_COUNT)
    setBestScore(null)
    setSessionCount(0)
    } catch {
      // localStorage may be unavailable (incognito/quota)
    }
  }, [])

  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__epep_clearScore = clearScore
      window.__epep_bestScore = () => storage.get(STORAGE_KEYS.QUIZ_BEST_SCORE)
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