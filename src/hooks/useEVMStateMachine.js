import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useEVMStateMachine Hook
 * Orchestrates the 6-phase voting flow for the EPEP EVM Simulator.
 */
export const useEVMStateMachine = (candidates = []) => {
  const [phase, setPhase] = useState('idle');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteTimestamp, setVoteTimestamp] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [mockResults, setMockResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const timers = useRef({ enabling: null, voting: null });

  const clearTimers = useCallback(() => {
    if (timers.current.enabling) clearTimeout(timers.current.enabling);
    if (timers.current.voting) clearTimeout(timers.current.voting);
  }, []);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  const generateSessionId = () => {
    return 'EVM-' + Date.now().toString(36).toUpperCase() + '-' + 
           Math.random().toString(36).slice(2, 6).toUpperCase();
  };

  const enableMachine = useCallback(() => {
    if (phase !== 'idle') {
      setErrorMessage('Machine already active or in process');
      return;
    }
    setPhase('enabling');
    timers.current.enabling = setTimeout(() => {
      setPhase('enabled');
    }, 1500);
  }, [phase]);

  const castVote = useCallback((serialNumber) => {
    if (phase !== 'enabled') return;
    
    setSelectedCandidate(serialNumber);
    setPhase('voting');
    
    timers.current.voting = setTimeout(() => {
      setVoteTimestamp(new Date());
      setSessionId(generateSessionId());
      setPhase('voted');
    }, 800);
  }, [phase]);

  const viewResults = useCallback(() => {
    if (phase !== 'voted') return;

    const results = [...candidates, { serialNumber: 999, name: 'NOTA' }].map(c => {
      const isWinner = c.serialNumber === selectedCandidate;
      return {
        serialNumber: c.serialNumber,
        name: c.name,
        votes: isWinner 
          ? Math.floor(Math.random() * 30000) + 45000 
          : Math.floor(Math.random() * 35000) + 8000
      };
    });

    setMockResults(results.sort((a, b) => b.votes - a.votes));
    setPhase('results');
  }, [phase, candidates, selectedCandidate]);

  const resetMachine = useCallback(() => {
    clearTimers();
    setPhase('idle');
    setSelectedCandidate(null);
    setVoteTimestamp(null);
    setSessionId(null);
    setMockResults(null);
    setErrorMessage(null);
  }, [clearTimers]);

  const dismissError = () => setErrorMessage(null);

  return {
    phase,
    selectedCandidate,
    voteTimestamp,
    sessionId,
    mockResults,
    errorMessage,
    isTransitioning: phase === 'enabling' || phase === 'voting',
    enableMachine,
    castVote,
    viewResults,
    resetMachine,
    dismissError
  };
};
