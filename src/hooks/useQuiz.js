import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getRandomQuestions, getQuizStats } from '../data/quiz-questions';

export const useQuiz = () => {
  const [phase, setPhase] = useState('idle');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(20).fill(null));
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [filters, setFilters] = useState({ category: null, difficulty: null });
  const timerRef = useRef(null);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const startQuiz = useCallback((startFilters = filters) => {
    const picked = getRandomQuestions(20, startFilters);
    setQuestions(picked);
    setAnswers(Array(picked.length).fill(null));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setTimeLeft(30);
    setIsTimerActive(true);
    setPhase('active');
  }, [filters]);

  const skipQuestion = useCallback(() => {
    setAnswers(prev => {
      const next = [...prev];
      next[currentIndex] = null;
      return next;
    });
    setIsRevealed(false);
    setSelectedAnswer(null);
    setIsTimerActive(false);

    setTimeout(() => {
      if (currentIndex >= questions.length - 1) {
        setPhase('complete');
      } else {
        setCurrentIndex(prev => prev + 1);
        setTimeLeft(30);
        setIsTimerActive(true);
      }
    }, 400);
  }, [currentIndex, questions.length]);

  const selectAnswer = useCallback((optionIndex) => {
    if (isRevealed || phase !== 'active') return;
    setSelectedAnswer(optionIndex);
    setIsTimerActive(false);
    setAnswers(prev => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
    setIsRevealed(true);
  }, [currentIndex, isRevealed, phase]);

  const nextQuestion = useCallback(() => {
    setIsRevealed(false);
    setSelectedAnswer(null);
    if (currentIndex >= questions.length - 1) {
      setPhase('complete');
      setIsTimerActive(false);
    } else {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(30);
      setIsTimerActive(true);
    }
  }, [currentIndex, questions.length]);

  const restartQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('idle');
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers(Array(20).fill(null));
    setSelectedAnswer(null);
    setIsRevealed(false);
    setTimeLeft(30);
    setIsTimerActive(false);
  }, []);

  useEffect(() => {
    if (isTimerActive && phase === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerActive, phase, currentIndex]);

  useEffect(() => {
    if (timeLeft === 0 && isTimerActive) {
      skipQuestion();
    }
  }, [timeLeft, isTimerActive, skipQuestion]);

  const currentQuestion = questions[currentIndex] || null;

  const stats = useMemo(() => {
    if (phase !== 'complete') return null;
    return getQuizStats(questions, answers);
  }, [phase, questions, answers]);

  return {
    phase, questions, currentIndex, currentQuestion, answers,
    timeLeft, isTimerActive, selectedAnswer, isRevealed, stats, filters,
    startQuiz, selectAnswer, nextQuestion, skipQuestion, restartQuiz, setFilter
  };
};