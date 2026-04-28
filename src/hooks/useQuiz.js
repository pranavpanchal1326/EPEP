/**
 * @fileoverview Quiz State Hook — EPEP
 * @module useQuiz
 *
 * Manages complete quiz session state including:
 *   - Random question selection from pool (20 from 80+)
 *   - Per-question 30-second countdown timer
 *   - Answer validation and scoring
 *   - Grade calculation (Novice / Informed Citizen / Election Expert)
 *   - Score persistence to localStorage and Firestore
 *   - Session history tracking
 *
 * @returns {Object}   quiz interface
 * @returns {Object}   .currentQuestion  - Active question data
 * @returns {number}   .timeLeft         - Seconds remaining (0-30)
 * @returns {number}   .score            - Correct answers so far
 * @returns {number}   .questionIndex    - Current position (0-19)
 * @returns {boolean}  .isComplete       - True when all 20 answered
 * @returns {Function} .submitAnswer     - Submit selected option index
 * @returns {Function} .startNewSession  - Reset and begin fresh quiz
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { getRandomQuestions, getQuizStats } from '../data/quiz-questions'
import { QUIZ_SESSION_SIZE, QUIZ_TIMER_SECONDS } from '../data/constants'

/**
 * Manage quiz lifecycle, timer, answers, and final stats.
 *
 * @returns {Object}
 */
export const useQuiz = () => {
  const [phase, setPhase] = useState('idle')
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(QUIZ_SESSION_SIZE).fill(null))
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIMER_SECONDS)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [filters, setFilters] = useState({ category: null, difficulty: null })
  const timerRef = useRef(null)

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const startQuiz = useCallback(
    (startFilters = filters) => {
      const picked = getRandomQuestions(QUIZ_SESSION_SIZE, startFilters)
      setQuestions(picked)
      setAnswers(Array(picked.length).fill(null))
      setCurrentIndex(0)
      setSelectedAnswer(null)
      setIsRevealed(false)
      setTimeLeft(QUIZ_TIMER_SECONDS)
      setIsTimerActive(true)
      setPhase('active')
    },
    [filters]
  )

  const skipQuestion = useCallback(() => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = null
      return next
    })
    setIsRevealed(false)
    setSelectedAnswer(null)
    setIsTimerActive(false)

    setTimeout(() => {
      if (currentIndex >= questions.length - 1) {
        setPhase('complete')
      } else {
        setCurrentIndex((prev) => prev + 1)
        setTimeLeft(QUIZ_TIMER_SECONDS)
        setIsTimerActive(true)
      }
    }, 400)
  }, [currentIndex, questions.length])

  const selectAnswer = useCallback(
    (optionIndex) => {
      if (isRevealed || phase !== 'active') return
      setSelectedAnswer(optionIndex)
      setIsTimerActive(false)
      setAnswers((prev) => {
        const next = [...prev]
        next[currentIndex] = optionIndex
        return next
      })
      setIsRevealed(true)
    },
    [currentIndex, isRevealed, phase]
  )

  const nextQuestion = useCallback(() => {
    setIsRevealed(false)
    setSelectedAnswer(null)
    if (currentIndex >= questions.length - 1) {
      setPhase('complete')
      setIsTimerActive(false)
    } else {
      setCurrentIndex((prev) => prev + 1)
      setTimeLeft(QUIZ_TIMER_SECONDS)
      setIsTimerActive(true)
    }
  }, [currentIndex, questions.length])

  const restartQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('idle')
    setQuestions([])
    setCurrentIndex(0)
    setAnswers(Array(QUIZ_SESSION_SIZE).fill(null))
    setSelectedAnswer(null)
    setIsRevealed(false)
    setTimeLeft(QUIZ_TIMER_SECONDS)
    setIsTimerActive(false)
  }, [])

  useEffect(() => {
    if (isTimerActive && phase === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isTimerActive, phase, currentIndex])

  useEffect(() => {
    if (timeLeft === 0 && isTimerActive) {
      skipQuestion()
    }
  }, [timeLeft, isTimerActive, skipQuestion])

  const currentQuestion = questions[currentIndex] || null

  const stats = useMemo(() => {
    if (phase !== 'complete') return null
    return getQuizStats(questions, answers)
  }, [phase, questions, answers])

  return {
    phase,
    questions,
    currentIndex,
    currentQuestion,
    answers,
    timeLeft,
    isTimerActive,
    selectedAnswer,
    isRevealed,
    stats,
    filters,
    startQuiz,
    selectAnswer,
    nextQuestion,
    skipQuestion,
    restartQuiz,
    setFilter,
  }
}
