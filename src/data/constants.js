/**
 * @fileoverview EPEP Electoral and Application Constants
 * @module constants
 *
 * Single source of truth for electoral and application constants.
 */

export const LOK_SABHA_SEATS = 543
export const RAJYA_SABHA_SEATS = 245
export const LOK_SABHA_TERM_YEARS = 5
export const ECI_ARTICLE = 324

export const VOTING_AGE = 18
export const MIN_AGE_LOK_SABHA = 25
export const MIN_AGE_RAJYA_SABHA = 30
export const MIN_AGE_STATE_ASSEMBLY = 25

export const SECURITY_DEPOSIT_GENERAL = 25000
export const SECURITY_DEPOSIT_SCST = 12500
export const DEPOSIT_FORFEITURE_FRACTION = 1 / 6

export const EVM_FIRST_USED_YEAR = 1982
export const NOTA_INTRODUCED_YEAR = 2013

export const PHASES_2024 = 7
export const REGISTERED_VOTERS_2024 = 970000000

export const QUIZ_SESSION_SIZE = 20
export const QUIZ_POOL_MINIMUM = 80
export const QUIZ_TIMER_SECONDS = 30
export const QUIZ_HISTORY_LIMIT = 5

export const GRADE_EXPERT_MIN_PCT = 80
export const GRADE_INFORMED_MIN_PCT = 50

export const GRADES = Object.freeze({
  EXPERT: 'Election Expert',
  INFORMED: 'Informed Citizen',
  NOVICE: 'Novice',
})

export const AI_MAX_RESPONSE_WORDS = 150
export const AI_CHAT_HISTORY_LIMIT = 6
export const AI_TEMPERATURE = 0.2

export const AI_MODELS = Object.freeze([
  'google/gemma-3-27b-it',
  'meta-llama/llama-4-maverick',
  'deepseek/deepseek-r2',
])

export const STORAGE_KEYS = Object.freeze({
  QUIZ_BEST_SCORE: 'quiz_best_score',
  QUIZ_HISTORY: 'quiz_history',
  LAST_CONSTITUENCY: 'last_constituency',
  CHAT_HISTORY: 'chat_history',
  UPDATE_DISMISSED: 'update_dismissed',
  INSTALL_DISMISSED: 'install_dismissed',
  VISITED: 'visited',
  QUIZ_SESSION_COUNT: 'quiz_session_count',
})

export const QA_CATEGORIES = Object.freeze([
  'Voter Registration',
  'Nomination Process',
  'Model Code of Conduct',
  'Voting Day',
  'Counting and Results',
  'Election Commission',
  'Political Parties',
  'Electoral Bonds',
  'Reservation and Constituencies',
])
