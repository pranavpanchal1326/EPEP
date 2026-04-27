import React from 'react';
import { motion } from 'framer-motion';
import { EVM_BUTTON_PRESS, STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motionVariants';
import PropTypes from 'prop-types';

const CandidateRow = ({ serialNumber, name, party, partySymbol, partyColor, isNota, isActive, isSelected, isOtherSelected, onVote, isMobile }) => {
  const isDisabled = !isActive || isOtherSelected;
  return (
    <motion.div variants={STAGGER_ITEM} className={"w-full flex items-center relative transition-colors duration-150 " + (isMobile ? 'px-4 py-4 ' : 'px-5 py-3.5 ') + (isActive && !isSelected && !isOtherSelected ? 'hover:bg-accent/15 cursor-pointer ' : '') + (isDisabled && !isSelected ? 'opacity-40' : '') + " border-b border-white/5"} onClick={() => !isDisabled && onVote(serialNumber)}>
      {isSelected && <motion.div layoutId="selection-border" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="absolute left-0 top-0 bottom-0 w-1 bg-[#4CAF50]" style={{ originY: 0 }} />}
      <span className="font-mono text-[13px] text-white/30 w-6 flex-shrink-0">{isNota ? 'N' : serialNumber}</span>
      <div className={"flex-shrink-0 rounded-[4px] flex items-center justify-center mx-3 " + (isMobile ? 'w-8 h-8 text-lg' : 'w-7 h-7 text-base')} style={{ backgroundColor: partyColor + "33" }}>{partySymbol}</div>
      <div className="flex-grow min-w-0 pr-2">
        <h4 className={(isMobile ? 'text-base ' : 'text-[13px] ') + "font-sans font-semibold text-[#F8F7F4] truncate"}>{name}</h4>
        <p className="font-sans text-[11px] text-white/40 truncate">{party}</p>
      </div>
      <motion.button variants={EVM_BUTTON_PRESS} initial="initial" whileTap={!isDisabled ? "whileTap" : undefined} animate="animate" disabled={isDisabled} className={(isMobile ? 'w-10 h-10 ' : 'w-8 h-8 ') + "relative rounded-full outline-none " + (isSelected ? (isNota ? 'bg-[#B71C1C]' : 'bg-[#2D5A3D]') : (isDisabled ? 'bg-[#2A2824]' : 'bg-[#1565C0]'))} style={isSelected ? { boxShadow: '0 0 12px #4CAF5080' } : {}} />
    </motion.div>
  );
};

const BallotUnit = ({ candidates = [], phase, selectedCandidate, onVote, constituencyName, isLoading, isMobile }) => {
  return (
    <div className="w-full h-full flex flex-col bg-evm-surface border-[1.5px] border-white/10 rounded-t-2xl md:rounded-t-xl overflow-hidden shadow-2xl">
      <div className="bg-[#111009] px-5 py-4 border-b border-white/5"><span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase">BALLOT UNIT</span><h3 className="font-sans text-[14px] text-white/70 truncate mt-0.5">{constituencyName}</h3></div>
      <motion.div className={"flex-grow overflow-y-auto " + (isMobile ? 'min-h-[460px]' : 'min-h-[420px]')} variants={STAGGER_CONTAINER} initial="initial" animate="animate">
        {isLoading ? <div className="p-10 text-white/20 text-center font-mono uppercase tracking-widest">Loading...</div> : 
          <>{candidates.map(c => <CandidateRow key={c.serialNumber} {...c} isMobile={isMobile} isActive={phase === 'enabled'} isSelected={selectedCandidate === c.serialNumber} isOtherSelected={(phase === 'voted' || phase === 'results') && selectedCandidate !== c.serialNumber} onVote={onVote} />)}
            <CandidateRow serialNumber={999} name="NOTA" party="None Of The Above" partySymbol="⊘" partyColor="#6B6560" isNota={true} isMobile={isMobile} isActive={phase === 'enabled'} isSelected={selectedCandidate === 999} isOtherSelected={(phase === 'voted' || phase === 'results') && selectedCandidate !== 999} onVote={onVote} />
          </>}
      </motion.div>
      <div className="bg-[#111009] px-5 py-3 border-t border-white/5 flex justify-between items-center text-white/15 font-mono text-[9px] font-bold uppercase tracking-tight"><span>BHARAT ELECTRONICS LIMITED</span><span>M3 TYPE</span></div>
    </div>
  );
};

BallotUnit.propTypes = {
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      serialNumber: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      party: PropTypes.string.isRequired,
      partySymbol: PropTypes.string,
      partyColor: PropTypes.string,
      isNota: PropTypes.bool,
    })
  ).isRequired,
  phase: PropTypes.string.isRequired,
  selectedCandidate: PropTypes.number,
  onVote: PropTypes.func.isRequired,
  constituencyName: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

BallotUnit.defaultProps = {
  selectedCandidate: null,
  constituencyName: '',
};

export default BallotUnit;