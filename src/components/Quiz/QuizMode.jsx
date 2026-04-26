import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronRight, Zap, RefreshCw } from 'lucide-react';
import { useQuiz } from '../../hooks/useQuiz';
import { QUIZ_CATEGORIES } from '../../data/quiz-questions';
import QuestionCard from './QuestionCard';
import ScoreScreen from './ScoreScreen';
import ErrorBoundary from '../shared/ErrorBoundary';

const QuizErrorFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-[#F8F7F4]">
    <p className="font-['DM_Sans'] text-[#6B6560] text-center">
      Something went wrong with the quiz. Please refresh and try again.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="bg-[#2D5A3D] text-white px-6 py-3 rounded-lg font-['DM_Sans'] font-semibold hover:opacity-90 transition-opacity"
    >
      Refresh
    </button>
  </div>
);

const QuizMode = () => {
  const {
    phase, questions, currentIndex, currentQuestion, answers,
    timeLeft, isTimerActive, selectedAnswer, isRevealed, stats, filters,
    startQuiz, selectAnswer, nextQuestion, restartQuiz, setFilter
  } = useQuiz();

  useEffect(() => {
    const handler = (e) => {
      if (phase !== 'active') return;
      if (!isRevealed && ['1','2','3','4'].includes(e.key)) {
        selectAnswer(parseInt(e.key) - 1);
      }
      if (isRevealed && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        nextQuestion();
      }
      if (phase === 'complete' && e.key === 'Escape') {
        restartQuiz();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, isRevealed, selectAnswer, nextQuestion, restartQuiz]);

  const mythBusterScore = useMemo(() => {
    if (phase !== 'complete') return null;
    const mbQs = questions.filter(q => q.isMythBuster);
    const mbCorrect = mbQs.filter(q => {
      const qIndex = questions.indexOf(q);
      return answers[qIndex] === q.correct;
    }).length;
    return { correct: mbCorrect, total: mbQs.length };
  }, [phase, questions, answers]);

  const renderIdle = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto text-center px-6"
    >
      <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold text-[#1A1814] mb-4">
        Test Your Election IQ
      </h1>
      <p className="font-['DM_Sans'] text-lg md:text-xl text-[#6B6560] mb-8">
        20 questions · 30 seconds each · All from verified sources
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {["80+ Questions", "9 Categories", "Based on ECI Data"].map(stat => (
          <span key={stat} className="px-4 py-2 rounded-full border border-[#E8E4DC] font-['DM_Sans'] text-sm text-[#6B6560]">
            {stat}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E4DC] max-w-lg mx-auto mb-8 text-left">
        <h3 className="font-['DM_Sans'] font-semibold text-[#1A1814] mb-6">Customise Your Quiz</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Category</label>
            <select 
              className="w-full p-3 bg-[#F8F7F4] border border-[#E8E4DC] rounded-lg font-['DM_Sans'] outline-none focus:ring-1 focus:ring-[#2D5A3D]"
              value={filters.category || ''}
              onChange={(e) => setFilter('category', e.target.value || null)}
            >
              <option value="">All Categories</option>
              {QUIZ_CATEGORIES.map(cat => (
                <option key={cat.slug} value={cat.slug}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6B6560] uppercase tracking-wider mb-2">Difficulty</label>
            <select 
              className="w-full p-3 bg-[#F8F7F4] border border-[#E8E4DC] rounded-lg font-['DM_Sans'] outline-none focus:ring-1 focus:ring-[#2D5A3D]"
              value={filters.difficulty || ''}
              onChange={(e) => setFilter('difficulty', e.target.value || null)}
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <p className="mt-4 font-['DM_Sans'] text-[13px] text-[#6B6560] italic">
          Leave as default for a mixed quiz
        </p>
      </div>

      <button
        onClick={() => startQuiz()}
        className="w-full md:w-[280px] bg-[#2D5A3D] text-white py-4 rounded-xl font-['DM_Sans'] font-semibold text-lg shadow-lg active:scale-[0.97] transition-all"
      >
        Start Quiz
      </button>
    </motion.div>
  );

  const renderActive = () => (
    <div className="max-w-[680px] mx-auto w-full px-6">
      <div className="w-full h-1 bg-[#E8E4DC] rounded-full overflow-hidden mb-6">
        <motion.div 
          layoutId="progress-fill"
          className="h-full bg-[#2D5A3D]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex items-center justify-between mb-8">
        <span className="font-['DM_Sans'] text-sm text-[#6B6560]">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="px-3 py-1 rounded-full bg-[#EBF2ED] text-[#2D5A3D] text-xs font-bold font-['DM_Sans']">
          {QUIZ_CATEGORIES.find(c => c.slug === currentQuestion.category)?.label}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            isRevealed={isRevealed}
            onSelect={selectAnswer}
            onNext={nextQuestion}
            isLast={currentIndex === questions.length - 1}
            timeLeft={timeLeft}
            isTimerActive={isTimerActive}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-20 pb-12 flex flex-col">
      <ErrorBoundary fallback={<QuizErrorFallback />}>
        {phase === 'idle' && renderIdle()}
        {phase === 'active' && renderActive()}
        {phase === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <ScoreScreen
              stats={stats}
              questions={questions}
              answers={answers}
              onRestart={restartQuiz}
              mythBusterScore={mythBusterScore}
            />
          </motion.div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default QuizMode;