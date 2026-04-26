import { create } from 'zustand'

/**
 * EPEP Global Store — Zustand
 * Single source of truth for all application state.
 */
export const useAppStore = create((set, get) => ({
  // ── MAP SLICE ──
  selectedState:        null,
  selectedConstituency: null,
  mapViewMode:          'state',

  setSelectedState: (stateName) => set({ selectedState: stateName, selectedConstituency: null }),
  setSelectedConstituency: (constituencyName) => set({ selectedConstituency: constituencyName }),
  setMapViewMode: (mode) => set({ mapViewMode: mode }),
  clearMapSelection: () => set({ selectedState: null, selectedConstituency: null, mapViewMode: 'state' }),

  // ── CHAT SLICE ──
  chatOpen:    false,
  chatMessages: [],
  chatLoading: false,
  chatError:   null,
  activeModel: 'llama-4-maverick',
  openChat:  () => set({ chatOpen: true }),
  closeChat: () => set({ chatOpen: false }),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, { id: crypto.randomUUID(), timestamp: new Date().toISOString(), ...message }]
  })),
  setChatLoading: (loading) => set({ chatLoading: loading }),
  setChatError:   (error)   => set({ chatError: error }),
  setActiveModel: (model)   => set({ activeModel: model }),
  clearChat: () => set({ chatMessages: [], chatError: null, chatLoading: false, activeModel: 'llama-4-maverick' }),

  // ── QUIZ SLICE ──
  quizActive:      false,
  quizQuestions:   [],
  quizCurrentIndex: 0,
  quizAnswers:     [],
  quizScore:       0,
  quizComplete:    false,
  quizBestScore:   (() => { try { const stored = localStorage.getItem('epep_quiz_best_score'); return stored ? parseInt(stored, 10) : 0; } catch { return 0; } })(),
  startQuiz: (questions) => set({ quizActive: true, quizQuestions: questions, quizCurrentIndex: 0, quizAnswers: [], quizScore: 0, quizComplete: false }),
  submitAnswer: (answer) => set((state) => {
    const newAnswers = [...state.quizAnswers, answer];
    const newScore = answer.isCorrect ? state.quizScore + 1 : state.quizScore;
    const isLastQ = state.quizCurrentIndex >= state.quizQuestions.length - 1;
    if (isLastQ && newScore > state.quizBestScore) {
      try { localStorage.setItem('epep_quiz_best_score', String(newScore)); } catch { /* ignore */ }
    }
    return { quizAnswers: newAnswers, quizScore: newScore, quizCurrentIndex: isLastQ ? state.quizCurrentIndex : state.quizCurrentIndex + 1, quizComplete: isLastQ, quizBestScore: Math.max(state.quizBestScore, newScore) };
  }),
  resetQuiz: () => set({ quizActive: false, quizQuestions: [], quizCurrentIndex: 0, quizAnswers: [], quizScore: 0, quizComplete: false }),

  // ── UI SLICE ──
  isOffline: false,
  isFirstVisit: (() => { try { const visited = localStorage.getItem('epep_visited'); if (!visited) { localStorage.setItem('epep_visited', 'true'); return true; } return false; } catch { return false; } })(),
  apiStatus: { tcpd: 'unknown', myneta: 'unknown', openrouter: 'unknown' },
  setOffline: (status) => set({ isOffline: status }),
  setApiStatus: (api, status) => set((state) => ({ apiStatus: { ...state.apiStatus, [api]: status } })),

  // ── EVM SLICE ──
  selectedConstituencyId: 'UP-73', 
  votingStep: 'select-constituency',
  selectedCandidateIndex: null,
  voteConfirmed: false,
  totalVotesCast: 0,
  isBallotEnabled: false,
  isVotingLocked: false,

  setConstituency: (id) => set({ selectedConstituencyId: id, votingStep: 'enable-voting' }),
  enableBallot: () => set({ isBallotEnabled: true, votingStep: 'select-candidate' }),
  selectCandidate: (index) => set({ selectedCandidateIndex: index, votingStep: 'confirm-vote' }),
  confirmVote: () => set((state) => ({
    voteConfirmed: true,
    totalVotesCast: state.totalVotesCast + 1,
    votingStep: 'vvpat-display',
    isVotingLocked: true
  })),
  resetVoting: () => set({
    votingStep: 'enable-voting',
    selectedCandidateIndex: null,
    voteConfirmed: false,
    isBallotEnabled: false,
    isVotingLocked: false
  }),
  setStep: (step) => set({ votingStep: step }),

  // ── DASHBOARD SLICE ──
  dashboardFilters: {
    electionType: 'lok_sabha',
    state: 'all',
    parties: [],
    yearRange: [1951, 2024],
  },
  setElectionType: (type) => set((state) => ({
    dashboardFilters: { ...state.dashboardFilters, electionType: type }
  })),
  setState_: (stateSlug) => set((state) => ({
    dashboardFilters: { ...state.dashboardFilters, state: stateSlug }
  })),
  setParties: (parties) => set((state) => ({
    dashboardFilters: { ...state.dashboardFilters, parties }
  })),
  setYearRange: (range) => set((state) => ({
    dashboardFilters: { ...state.dashboardFilters, yearRange: range }
  })),
  scrollToTurnoutChart: null,
  setScrollToTurnoutChart: (fn) => set({ scrollToTurnoutChart: fn }),
}))

export const useStore = useAppStore;
export const useEPEPStore = useAppStore;

export const initOfflineListener = () => {
  const { setOffline } = useAppStore.getState()
  const handleOffline = () => setOffline(true)
  const handleOnline  = () => setOffline(false)
  window.addEventListener('offline', handleOffline)
  window.addEventListener('online',  handleOnline)
  setOffline(!navigator.onLine)
  return () => {
    window.removeEventListener('offline', handleOffline)
    window.removeEventListener('online',  handleOnline)
  }
}

export const selectors = {
  // ... existing selectors
  selectedState:        (s) => s.selectedState,
  selectedConstituency: (s) => s.selectedConstituency,
  mapViewMode:          (s) => s.mapViewMode,
  chatOpen:             (s) => s.chatOpen,
  chatMessages:         (s) => s.chatMessages,
  chatLoading:          (s) => s.chatLoading,
  activeModel:          (s) => s.activeModel,
  quizActive:           (s) => s.quizActive,
  quizCurrentIndex:     (s) => s.quizCurrentIndex,
  quizScore:            (s) => s.quizScore,
  quizComplete:         (s) => s.quizComplete,
  quizBestScore:        (s) => s.quizBestScore,
  isOffline:            (s) => s.isOffline,
  apiStatus:            (s) => s.apiStatus,
  selectedConstituencyId: (s) => s.selectedConstituencyId,
  votingStep:             (s) => s.votingStep,
  isBallotEnabled:        (s) => s.isBallotEnabled,
  isVotingLocked:         (s) => s.isVotingLocked,
  totalVotesCast:         (s) => s.totalVotesCast,
  dashboardFilters:       (s) => s.dashboardFilters
}