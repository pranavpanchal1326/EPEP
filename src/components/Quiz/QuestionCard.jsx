import React from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useMotionConfig } from '../../hooks/useMotionConfig';
import { Check, X, Zap } from 'lucide-react';
import { STAGGER_CONTAINER, STAGGER_ITEM, BUTTON_PRESS } from '../../lib/motionVariants';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const QuestionCard = ({ question, selectedAnswer, isRevealed, onSelect, onNext, isLast, timeLeft, isTimerActive }) => {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const { disableTranslation } = useMotionConfig();
  const timeMV = useMotionValue(timeLeft);
  
  React.useEffect(() => { timeMV.set(timeLeft); }, [timeLeft]);
  
  const timerColor = useTransform(timeMV, [0, 8, 15, 30], ["#C0392B", "#C0392B", "#D4900A", "#2D5A3D"]);
  const timerWidth = useTransform(timeMV, [0, 30], ["0%", "100%"]);

  const diffs = { easy: { color: '#2D5A3D', label: 'Easy' }, medium: { color: '#D4900A', label: 'Medium' }, hard: { color: '#C0392B', label: 'Hard' } };
  const diff = diffs[question.difficulty] || diffs.easy;

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[1100] bg-bg-base flex flex-col safe-top overflow-hidden">
        {/* Mobile Header: Progress & Timer */}
        <div className="w-full flex flex-col gap-1 pt-4 px-6">
          <div className="w-full h-1 bg-border-soft rounded-full overflow-hidden">
            <motion.div style={{ width: timerWidth, backgroundColor: timerColor }} className="h-full" />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
             <span>Time Remaining</span>
             <motion.span style={{ color: timerColor }}>{timeLeft}s</motion.span>
          </div>
        </div>

        <div className="flex-1 px-6 flex flex-col justify-center py-8">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: diff.color }} />
             <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">{diff.label} Level</span>
          </div>

          <AnimatePresence>
            {question.isMythBuster && !isRevealed && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-accent text-xs font-bold mb-4">
                <Zap size={14} fill="currentColor" /> Myth Buster Opportunity
              </motion.div>
            )}
          </AnimatePresence>

          <h2 className="font-display text-2xl text-text-primary leading-tight mb-8">{question.question}</h2>

          <motion.div className="flex flex-col gap-3" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
            {question.options.map((option, index) => {
              const isCorrect = index === question.correct; const isSelected = index === selectedAnswer; const isWrong = isSelected && !isCorrect;
              return (
                <motion.button
                  key={index} variants={STAGGER_ITEM} onClick={() => onSelect(index)} disabled={isRevealed}
                  animate={{ 
                    backgroundColor: isRevealed && isCorrect ? "#EBF2ED" : isRevealed && isWrong ? "#FDF2F2" : isSelected ? "#EBF2ED" : "#FFFFFF",
                    borderColor: isRevealed && isCorrect ? "#2D5A3D" : isRevealed && isWrong ? "#C0392B" : isSelected ? "#2D5A3D" : "#E8E4DC"
                  }}
                  className="w-full min-h-[60px] p-4 rounded-xl border-2 flex items-center gap-4 text-left shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className={"w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm " + (isSelected || (isRevealed && isCorrect) ? 'bg-accent text-white' : 'bg-bg-base text-text-muted')}>{['A','B','C','D'][index]}</div>
                  <span className="flex-1 font-body text-[15px] font-medium leading-tight">{option}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <AnimatePresence>
          {isRevealed && (
             <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="bg-surface border-t border-border-soft p-6 safe-bottom">
                <div className="flex items-center justify-between mb-4">
                   <span className={"font-bold text-lg " + (selectedAnswer === question.correct ? 'text-accent' : 'text-error')}>{selectedAnswer === question.correct ? 'Correct!' : 'Incorrect'}</span>
                   <motion.button variants={BUTTON_PRESS} onClick={onNext} className="bg-accent text-white px-6 py-3 rounded-lg font-bold shadow-lg">{isLast ? 'See Results' : 'Next'}</motion.button>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{question.explanation}</p>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop/Tablet fallback
  return (
    <div className="w-full max-w-[680px] mx-auto">
      <div className="flex justify-center mb-6">
         <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="#E8E4DC" strokeWidth="4" />
              <motion.circle cx="32" cy="32" r="26" fill="none" stroke={timerColor} strokeWidth="4" strokeLinecap="round" strokeDasharray={163.36} animate={{ strokeDashoffset: 163.36 * (1 - timeLeft/30) }} transition={{ duration: 0.9, ease: "linear" }} transform="rotate(-90 32 32)" />
              <text x="32" y="37" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="14" fontWeight="700" fill={timerColor}>{timeLeft}</text>
            </svg>
         </div>
      </div>
      <div className="bg-white rounded-[16px] border border-[#E8E4DC] p-8 shadow-sm relative overflow-hidden">
        <h2 className="font-body text-xl font-bold mb-6">{question.question}</h2>
        <div className="flex flex-col gap-3">
          {question.options.map((option, index) => (
             <button key={index} onClick={() => onSelect(index)} disabled={isRevealed} className={"w-full p-5 rounded-xl border-2 text-left transition-all " + (selectedAnswer === index ? 'border-accent bg-accent-light' : 'border-border-soft')}>{option}</button>
          ))}
        </div>
        {isRevealed && <div className="mt-8 pt-8 border-t border-border-soft"><p className="text-text-secondary">{question.explanation}</p><button onClick={onNext} className="mt-6 bg-accent text-white px-8 py-3 rounded-lg font-bold">{isLast ? 'See My Results' : 'Next Question'}</button></div>}
      </div>
    </div>
  );
};
export default QuestionCard;