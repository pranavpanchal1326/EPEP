/**
 * @fileoverview Quiz Score Screen — EPEP
 * @module ScoreScreen
 *
 * Final screen shown after quiz completion. Features:
 *   - Score visualization with NumberReveal
 *   - Grade-based celebration (Confetti for Experts)
 *   - Personal Best tracking via useLocalScore
 *   - Optional Google Sign-In for global leaderboard
 *   - Persistence to both localStorage and Firestore
 *
 * @param {Object}   props
 * @param {Object}   props.stats      - Quiz performance summary
 * @param {Array}    props.questions  - List of questions asked
 * @param {Array}    props.answers    - User's answers
 * @param {Object}   props.mythBusterScore - Extra credit score
 * @param {Function} props.onRestart  - Reset callback
 */
import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Check, X, Clock, ChevronDown, ChevronUp, Copy } from 'lucide-react'
import PropTypes from 'prop-types'
import { QUIZ_CATEGORIES } from '../../data/quiz-questions'
import { useLocalScore } from '../../hooks/useLocalScore'
import PersonalBest from './PersonalBest'
import NumberReveal from '../shared/NumberReveal'
import { FADE_IN_SCALE, BUTTON_PRESS } from '../../lib/motionVariants'
import { saveQuizResult, trackEvent } from '../../lib/firebase'
import useAuth from '../../hooks/useAuth'
import GoogleSignIn from '../shared/GoogleSignIn'
import Leaderboard from './Leaderboard'

const ScoreScreen = ({ stats, questions, answers, mythBusterScore, onRestart }) => {
  const navigate = useNavigate(); const tryAgainRef = useRef(null);
  const { bestScore, sessionCount, isNewBest, isTied, saveScore, scoreDelta } = useLocalScore(stats, mythBusterScore);
  const { user, isLoading, isSignedIn, signIn, signOut } = useAuth();
  const [scoreSaved, setScoreSaved] = useState(false);
  useEffect(() => {
    saveScore(stats, mythBusterScore);
    trackEvent('quiz_completed', {
      score: stats.correct,
      total: stats.total,
      percentage: stats.percentage,
      grade: stats.grade?.label,
    });

    saveQuizResult({
      score: stats.correct,
      percentage: Math.round((stats.correct / 20) * 100),
      grade: stats.grade?.label ?? 'Unknown',
      userId: user?.uid ?? 'anonymous',
      displayName: user?.displayName ?? 'Anonymous Voter',
      isSignedIn,
    }).then(() => setScoreSaved(true));
  }, []);
  useEffect(() => {
    if (stats.grade.label === "Election Expert") {
      const style = document.createElement('style'); style.id = 'confetti-style';
      style.textContent = "@keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }";
      document.head.appendChild(style);
      const timer = setTimeout(() => {
        const colors = ['#2D5A3D', '#D4900A', '#F8F7F4', '#1A1814', '#EBF2ED']
        const pieces = [];
        for (let i = 0; i < 60; i++) {
          const el = document.createElement('div'); el.className = 'confetti-piece';
          el.style.cssText = "position: fixed; width: " + (4 + Math.random() * 6) + "px; height: " + (4 + Math.random() * 6) + "px; background: " + colors[Math.floor(Math.random() * colors.length)] + "; border-radius: " + (Math.random() > 0.5 ? '50%' : '2px') + "; left: " + (Math.random() * 100) + "vw; top: -20px; z-index: 9999; pointer-events: none; animation: confettiFall " + (1.5 + Math.random() * 2) + "s ease-in forwards; animation-delay: " + (Math.random() * 0.8) + "s;";
          document.body.appendChild(el); pieces.push(el);
        }
        setTimeout(() => pieces.forEach(p => p.remove()), 4000);
      }, 600);
      return () => { document.getElementById('confetti-style')?.remove(); document.querySelectorAll('.confetti-piece').forEach(p => p.remove()); clearTimeout(timer); }
    }
  }, [stats.grade.label]);

  return (
    <div className="max-w-4xl mx-auto px-6 pb-24 pt-10 font-['DM_Sans']">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-3xl border border-[#E8E4DC] pt-12 pb-10 shadow-sm mb-8 text-center overflow-hidden">
        <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.15, 1] }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl mb-4">{stats.grade.emoji}</motion.div>
        <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-bold leading-none mb-4" style={{ color: stats.grade.color }}>
          <NumberReveal value={stats.correct} /> <span className="text-2xl md:text-4xl text-text-muted opacity-40">/ {stats.total}</span>
        </h1>
        <div className="flex flex-col items-center px-6">
          <div className="w-full max-w-[280px] h-2 bg-[#E8E4DC] rounded-full overflow-hidden"><motion.div role="progressbar" initial={{ width: 0 }} animate={{ width: stats.percentage + "%" }} transition={{ duration: 1, delay: 0.6 }} className="h-full" style={{ backgroundColor: stats.grade.color }} /></div>
          <motion.div variants={FADE_IN_SCALE} initial="initial" animate="animate" transition={{ delay: 1 }} className="mt-6">
             <h2 className="text-xl md:text-3xl font-bold mb-2" style={{ color: stats.grade.color }}>{stats.grade.label}</h2>
             <p className="text-sm md:text-base text-text-muted max-w-md">Outstanding knowledge! You know India's election process better than most citizens.</p>
          </motion.div>
        </div>
      </motion.div>

      <PersonalBest bestScore={bestScore} isNewBest={isNewBest} isTied={isTied} scoreDelta={scoreDelta} sessionCount={sessionCount} currentPercentage={stats.percentage} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Correct", value: stats.correct, color: "#2D5A3D" },
          { label: "Wrong", value: stats.total - stats.correct, color: "#C0392B" },
          { label: "Score", value: stats.percentage, color: stats.grade.color, suffix: "%" },
          { label: "Myths", value: mythBusterScore.correct + "/" + mythBusterScore.total, color: "#92610A", raw: true }
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }} className="bg-white rounded-2xl border border-border-soft p-5 text-center shadow-sm">
            <div className="font-mono text-2xl md:text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.raw ? stat.value : <NumberReveal value={stat.value} suffix={stat.suffix} />}</div>
            <div className="text-[10px] md:text-xs text-text-muted uppercase tracking-widest font-bold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <motion.button ref={tryAgainRef} autoFocus variants={BUTTON_PRESS} whileHover={{ translateY: -1 }} onClick={onRestart} className="flex-1 bg-accent text-white py-5 px-8 rounded-xl font-bold text-lg shadow-lg">Play Again</motion.button>
        <motion.button variants={BUTTON_PRESS} whileHover={{ translateY: -1 }} onClick={() => navigate('/education')} className="flex-1 bg-transparent border-2 border-accent text-accent py-5 px-8 rounded-xl font-bold text-lg hover:bg-accent-light transition-colors">Explore Hub</motion.button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <GoogleSignIn
          user={user}
          isLoading={isLoading}
          onSignIn={signIn}
          onSignOut={signOut}
        />
        <Leaderboard refreshTrigger={scoreSaved} />
      </div>
    </div>
  )
}
ScoreScreen.propTypes = {
  stats: PropTypes.shape({
    correct:    PropTypes.number.isRequired,
    total:      PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
    grade:      PropTypes.shape({
      label: PropTypes.string.isRequired,
      emoji: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  questions: PropTypes.array.isRequired,
  answers:   PropTypes.array.isRequired,
  mythBusterScore: PropTypes.shape({
    correct: PropTypes.number.isRequired,
    total:   PropTypes.number.isRequired,
  }).isRequired,
  onRestart: PropTypes.func.isRequired,
}

export default ScoreScreen;
