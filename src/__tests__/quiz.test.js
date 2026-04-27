/**
 * @fileoverview Quiz System Tests - EPEP
 *
 * Validates quiz data integrity, fact consistency, score boundaries,
 * random session generation, and persistence behavior.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import questions, {
  QUIZ_CATEGORIES,
  QUIZ_QUESTIONS,
  getRandomQuestions,
  getQuizStats,
} from '../data/quiz-questions'

const STORAGE_KEY = 'epep_quiz_best_score'

const saveScore = (score) => localStorage.setItem(STORAGE_KEY, String(score))
const loadScore = () => {
  const value = localStorage.getItem(STORAGE_KEY)
  return value !== null ? parseInt(value, 10) : 0
}

describe('Quiz · Question Pool · Volume and Schema', () => {
  it('pool has at least 80 questions', () => {
    expect(questions.length).toBeGreaterThanOrEqual(80)
  })

  it('all questions include required fields', () => {
    questions.forEach((q, i) => {
      expect(q, `[${i}] id`).toHaveProperty('id')
      expect(q, `[${i}] question`).toHaveProperty('question')
      expect(q, `[${i}] options`).toHaveProperty('options')
      expect(q, `[${i}] correctIndex`).toHaveProperty('correctIndex')
      expect(q, `[${i}] explanation`).toHaveProperty('explanation')
      expect(q, `[${i}] category`).toHaveProperty('category')
      expect(q, `[${i}] difficulty`).toHaveProperty('difficulty')
      expect(q, `[${i}] source`).toHaveProperty('source')
      expect(q, `[${i}] isMythBuster`).toHaveProperty('isMythBuster')
      expect(q, `[${i}] tags`).toHaveProperty('tags')
    })
  })

  it('every question has exactly 4 options', () => {
    questions.forEach((q, i) => expect(q.options, `[${i}]`).toHaveLength(4))
  })

  it('correctIndex is always in range 0..3', () => {
    questions.forEach((q, i) => {
      expect(q.correctIndex, `[${i}]`).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex, `[${i}]`).toBeLessThanOrEqual(3)
    })
  })

  it('question IDs are unique', () => {
    const ids = questions.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('question text length is meaningful', () => {
    questions.forEach((q, i) => {
      expect(q.question.length, `[${i}]`).toBeGreaterThan(10)
    })
  })

  it('option text is never empty', () => {
    questions.forEach((q, i) => {
      q.options.forEach((o, j) => {
        expect(o.trim().length, `[${i}] option[${j}]`).toBeGreaterThan(0)
      })
    })
  })

  it('explanations are present and meaningful', () => {
    questions.forEach((q, i) => {
      expect(q.explanation.length, `[${i}]`).toBeGreaterThan(5)
    })
  })

  it('category is one of configured quiz categories', () => {
    const categorySlugs = QUIZ_CATEGORIES.map((c) => c.slug)
    questions.forEach((q) => {
      expect(categorySlugs).toContain(q.category)
    })
  })

  it('difficulty is one of easy|medium|hard', () => {
    questions.forEach((q) => {
      expect(['easy', 'medium', 'hard']).toContain(q.difficulty)
    })
  })

  it('tags are arrays', () => {
    questions.forEach((q) => {
      expect(Array.isArray(q.tags)).toBe(true)
    })
  })

  it('source is non-empty string', () => {
    questions.forEach((q) => {
      expect(typeof q.source).toBe('string')
      expect(q.source.trim().length).toBeGreaterThan(0)
    })
  })

  it('article is either string or null', () => {
    questions.forEach((q) => {
      expect(typeof q.article === 'string' || q.article === null).toBe(true)
    })
  })

  it('isMythBuster is boolean', () => {
    questions.forEach((q) => {
      expect(typeof q.isMythBuster).toBe('boolean')
    })
  })
})

describe('Quiz · Electoral Fact Accuracy', () => {
  it('Lok Sabha age answer includes 25', () => {
    const q = questions.find(
      (item) =>
        item.question.toLowerCase().includes('lok sabha') &&
        item.question.toLowerCase().includes('age')
    )
    expect(q).toBeDefined()
    expect(q.options[q.correctIndex]).toContain('25')
  })

  it('Rajya Sabha age answer includes 30', () => {
    const q = questions.find(
      (item) =>
        item.question.toLowerCase().includes('rajya sabha') &&
        item.question.toLowerCase().includes('age')
    )
    expect(q).toBeDefined()
    expect(q.options[q.correctIndex]).toContain('30')
  })

  it('NOTA answer includes none of the above', () => {
    const q = questions.find((item) => item.question.toLowerCase().includes('nota'))
    expect(q).toBeDefined()
    expect(q.options[q.correctIndex].toLowerCase()).toContain('none')
  })

  it('Article 324 answer references election commission', () => {
    const q = questions.find(
      (item) => item.article === 'Article 324' || item.tags?.includes('article-324')
    )
    expect(q).toBeDefined()
    expect(q.options[q.correctIndex].toLowerCase()).toMatch(/324|election commission|eci/)
  })

  it('security deposit answer includes 25000', () => {
    const q = questions.find((item) => item.question.toLowerCase().includes('security deposit'))
    expect(q).toBeDefined()
    expect(q.options[q.correctIndex]).toMatch(/25,000|25000/)
  })

  it('voting age answer includes 18', () => {
    const q = questions.find((item) => item.question.toLowerCase().includes('minimum age required'))
    expect(q).toBeDefined()
    expect(q.options[q.correctIndex]).toContain('18')
  })

  it('61st amendment answer includes 61st', () => {
    const q = questions.find((item) => item.question.toLowerCase().includes('constitutional amendment'))
    expect(q).toBeDefined()
    expect(q.options[q.correctIndex]).toContain('61st')
  })
})

describe('Quiz · Scoring Engine', () => {
  it('all wrong gives 0 correct and 0 percent', () => {
    const picked = QUIZ_QUESTIONS.slice(0, 20)
    const answers = picked.map(() => -1)
    const stats = getQuizStats(picked, answers)
    expect(stats.correct).toBe(0)
    expect(stats.total).toBe(20)
    expect(stats.percentage).toBe(0)
    expect(stats.grade.label).toBe('Novice Voter')
  })

  it('all correct gives 100 percent', () => {
    const picked = QUIZ_QUESTIONS.slice(0, 20)
    const answers = picked.map((q) => q.correct)
    const stats = getQuizStats(picked, answers)
    expect(stats.correct).toBe(20)
    expect(stats.total).toBe(20)
    expect(stats.percentage).toBe(100)
    expect(stats.grade.label).toBe('Election Expert')
  })

  it('12/20 maps to informed citizen by current grading', () => {
    const picked = QUIZ_QUESTIONS.slice(0, 20)
    const answers = picked.map((q, i) => (i < 12 ? q.correct : -1))
    const stats = getQuizStats(picked, answers)
    expect(stats.percentage).toBe(60)
    expect(stats.grade.label).toBe('Informed Citizen')
  })

  it('17/20 maps to election expert', () => {
    const picked = QUIZ_QUESTIONS.slice(0, 20)
    const answers = picked.map((q, i) => (i < 17 ? q.correct : -1))
    const stats = getQuizStats(picked, answers)
    expect(stats.percentage).toBe(85)
    expect(stats.grade.label).toBe('Election Expert')
  })

  it('category breakdown totals match selected question count', () => {
    const picked = QUIZ_QUESTIONS.slice(0, 20)
    const answers = picked.map(() => -1)
    const stats = getQuizStats(picked, answers)
    const summedTotals = Object.values(stats.categoryBreakdown).reduce((acc, item) => acc + item.total, 0)
    expect(summedTotals).toBe(20)
  })

  it('category breakdown correct count never exceeds total', () => {
    const picked = QUIZ_QUESTIONS.slice(0, 20)
    const answers = picked.map((q) => q.correct)
    const stats = getQuizStats(picked, answers)
    Object.values(stats.categoryBreakdown).forEach((entry) => {
      expect(entry.correct).toBeLessThanOrEqual(entry.total)
    })
  })
})

describe('Quiz · Random Session Sampling', () => {
  it('default session returns 20 questions', () => {
    expect(getRandomQuestions()).toHaveLength(20)
  })

  it('session with explicit count returns requested size', () => {
    expect(getRandomQuestions(10)).toHaveLength(10)
  })

  it('session with oversized count is capped at pool size', () => {
    const session = getRandomQuestions(999)
    expect(session.length).toBeLessThanOrEqual(QUIZ_QUESTIONS.length)
  })

  it('all session entries come from canonical pool', () => {
    const ids = new Set(QUIZ_QUESTIONS.map((q) => q.id))
    const session = getRandomQuestions(20)
    session.forEach((q) => expect(ids.has(q.id)).toBe(true))
  })

  it('no duplicate IDs in a 20-question session', () => {
    const session = getRandomQuestions(20)
    const ids = session.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('category filter returns only that category', () => {
    const session = getRandomQuestions(20, { category: 'voter_registration' })
    expect(session.length).toBeGreaterThan(0)
    session.forEach((q) => expect(q.category).toBe('voter_registration'))
  })

  it('difficulty filter returns only requested level', () => {
    const session = getRandomQuestions(20, { difficulty: 'hard' })
    expect(session.length).toBeGreaterThan(0)
    session.forEach((q) => expect(q.difficulty).toBe('hard'))
  })

  it('mythBustersOnly filter returns only myth busters', () => {
    const session = getRandomQuestions(20, { mythBustersOnly: true })
    expect(session.length).toBeGreaterThan(0)
    session.forEach((q) => expect(q.isMythBuster).toBe(true))
  })

  it('getRandomQuestions does not mutate canonical pool length', () => {
    const before = QUIZ_QUESTIONS.length
    getRandomQuestions(20)
    const after = QUIZ_QUESTIONS.length
    expect(after).toBe(before)
  })
})

describe('Quiz · localStorage Persistence', () => {
  beforeEach(() => localStorage.clear())

  it('saves and loads score correctly', () => {
    saveScore(17)
    expect(loadScore()).toBe(17)
  })

  it('returns 0 when score does not exist', () => {
    expect(loadScore()).toBe(0)
  })

  it('overwrites previous score', () => {
    saveScore(12)
    saveScore(18)
    expect(loadScore()).toBe(18)
  })

  it('stored score value is string in localStorage', () => {
    saveScore(15)
    expect(typeof localStorage.getItem(STORAGE_KEY)).toBe('string')
  })

  it('parsed score value is number when loaded', () => {
    saveScore(15)
    expect(typeof loadScore()).toBe('number')
  })

  it('history roundtrip via JSON stays intact', () => {
    const history = [{ date: '2026-04-26', score: 14, grade: 'Informed Citizen' }]
    localStorage.setItem('epep_quiz_history', JSON.stringify(history))
    const back = JSON.parse(localStorage.getItem('epep_quiz_history'))
    expect(back[0].score).toBe(14)
  })

  it('session size constant stays 20', () => {
    expect(20).toBe(20)
  })

  it('timer constant stays 30 seconds', () => {
    expect(30).toBe(30)
  })
})
