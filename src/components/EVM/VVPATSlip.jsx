import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VVPATSlip = ({ show, sessionId, selectedCandidate, candidates, voteTimestamp }) => {
  const votedCandidate = selectedCandidate === 999 
    ? { serialNumber: 999, name: 'NOTA', party: 'None Of The Above', partySymbol: '⊘', partyColor: '#6B6560' }
    : candidates.find(c => c.serialNumber === selectedCandidate) || null;

  return (
    <div className="w-full bg-[#222018] border-[1.5px] border-white/7 border-t-white/5 rounded-b-xl px-5 py-5 relative mt-[-1px]">
      <div className="flex justify-between items-center mb-3 text-white/30 font-mono text-[10px] font-bold"><div className="flex items-center gap-2"><div className="w-2 h-2 border border-[#4CAF50]" />VVPAT UNIT</div><span className="opacity-50">M3 TYPE</span></div>
      <div className="relative w-full h-[140px] rounded-lg border-2 border-white/12 overflow-hidden bg-[#0D0D0B]">
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%", opacity: 0 }}
              transition={{ y: { duration: 0.6, ease: [0.34, 1.2, 0.64, 1], delay: 0.3 }, opacity: { duration: 0.5, delay: 6.5 } }}
              className="absolute inset-0 bg-[#FDFAF4] flex flex-col p-4"
              style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.025) 24px, rgba(0,0,0,0.025) 25px), #FDFAF4' }}
            >
              <div className="absolute left-[18px] top-0 bottom-0 w-[1px] bg-red-900/25" />
              <div className="relative z-10 flex flex-col h-full pl-2">
                <span className="font-mono text-[8px] text-center text-[#1A1814]/50 tracking-wider mb-2 uppercase">ELECTION COMMISSION OF INDIA</span>
                <div className="flex justify-between items-center mb-2 text-[7px] text-[#1A1814]/40 font-mono"><span>VVPAT SLIP</span><span>{sessionId}</span></div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex items-center gap-2.5 my-1">
                  <div className="w-9 h-9 rounded-md border flex items-center justify-center text-xl bg-accent/10 border-accent/20">{votedCandidate?.partySymbol}</div>
                  <div className="flex-grow"><span className="block font-sans text-[13px] font-bold text-[#1A1814] uppercase truncate">{votedCandidate?.name}</span><span className="block font-sans text-[9px] text-[#1A1814]/50">{votedCandidate?.party}</span></div>
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-white text-[11px]">✓</div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default VVPATSlip;