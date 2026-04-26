import { motion } from 'framer-motion'

const PersonalBest = ({ bestScore, isNewBest, isTied, scoreDelta, sessionCount, currentPercentage }) => {
  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const renderState = () => {
    // State A: First time ever
    if (scoreDelta === null) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="bg-[#EBF2ED] border border-[#2D5A3D] rounded-xl p-5"
        >
          <div className="font-['DM_Sans'] text-[16px] font-semibold text-[#2D5A3D]">🎯 First Quiz Complete!</div>
          <div className="font-['DM_Sans'] text-[13px] text-[#6B6560]">Your score has been saved. Come back and beat it!</div>
        </motion.div>
      )
    }

    // State B: New personal best
    if (isNewBest) {
      return (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            boxShadow: [
              '0 0 0 4px rgba(45,90,61,0.12)',
              '0 0 0 12px rgba(45,90,61,0)',
              '0 0 0 4px rgba(45,90,61,0.12)'
            ]
          }}
          transition={{ 
            scale: { type: 'spring', stiffness: 300, damping: 18, delay: 1.4 },
            opacity: { duration: 0.3, delay: 1.4 },
            boxShadow: { duration: 1, repeat: 1, delay: 1.8 }
          }}
          className="bg-gradient-to-br from-[#EBF2ED] to-[#F8F7F4] border-2 border-[#2D5A3D] rounded-xl p-5"
        >
          <div className="font-['DM_Sans'] text-[16px] font-semibold text-[#2D5A3D]">🏅 New Personal Best!</div>
          <div className="font-['JetBrains_Mono'] text-[13px] font-bold text-[#2D5A3D]">+{scoreDelta}% above your previous best</div>
          <div className="font-['DM_Sans'] text-[12px] text-[#6B6560] mt-1">
            Previous best: {bestScore.percentage}% ({bestScore.grade.emoji} {bestScore.grade.label})
          </div>
          <div className="font-['DM_Sans'] text-[12px] text-[#6B6560]">Previously set on {formatDate(bestScore.achievedAt)}</div>
        </motion.div>
      )
    }

    // State D: Tied
    if (isTied) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className="bg-[#FFF3CD] border border-[#D4900A] rounded-xl p-5"
        >
          <div className="font-['DM_Sans'] text-[15px] font-semibold text-[#92610A]">🤝 Matched Your Best! {bestScore.percentage}%</div>
          <div className="font-['DM_Sans'] text-[13px] text-[#92610A]">Tied with your personal record. One more correct answer next time!</div>
        </motion.div>
      )
    }

    // State C: Below personal best
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="bg-white border border-[#E8E4DC] rounded-xl p-5"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="font-['DM_Sans'] text-[14px] font-semibold text-[#1A1814]">Your Best: {bestScore.percentage}%</div>
            <div className="font-['DM_Sans'] text-[12px] text-[#6B6560]">{bestScore.grade.emoji} {bestScore.grade.label}</div>
          </div>
          <div className="bg-[#FDF2F2] border border-[#C0392B] rounded-full px-2.5 py-1 text-[12px] font-semibold text-[#C0392B]">
            {scoreDelta}% from your best
          </div>
        </div>
        <div className="font-['DM_Sans'] text-[12px] text-[#6B6560] italic mt-3">
          {scoreDelta >= -10 ? "So close! One more try and you'll beat it." : 
           scoreDelta >= -25 ? "Keep going — your best is within reach." : 
           "Every attempt makes you a more informed citizen."}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="mb-8" role="status">
      {renderState()}
      <div className="mt-2 text-center font-['DM_Sans'] text-[12px] text-[#6B6560]" aria-label={`Quiz attempt number ${sessionCount}`}>
        Quiz attempt #{sessionCount} · {sessionCount === 1 ? 'First time!' : `${sessionCount} total attempts`}
      </div>
    </div>
  )
}

export default PersonalBest;