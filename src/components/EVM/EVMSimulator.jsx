import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCandidates } from '@/services/myneta';
import { DEFAULT_CONSTITUENCY } from '@/data/evm-candidates';
import { EVM_PHASE_GUIDE, EVM_TOOLTIP_CONTENT } from '@/data/evm-education';
import EVMShell from './EVMShell';
import ConstituencySelector from './ConstituencySelector';
import EVMStepIndicator from './EVMStepIndicator';
import BallotUnit from './BallotUnit';
import ControlUnit from './ControlUnit';
import VVPATSlip from './VVPATSlip';
import EVMTooltip from './EVMTooltip';
import LearnMoreModal from './LearnMoreModal';
import { useEVMStateMachine } from '@/hooks/useEVMStateMachine';
import { Info } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { STAGGER_CONTAINER, FADE_UP } from '../../lib/motionVariants';
import { trackEvent } from '../../lib/firebase';

const EVMSimulator = () => {
  const [constituency, setConstituency] = useState(DEFAULT_CONSTITUENCY);
  const [candidates, setCandidates] = useState([]);
  const [constituencyLabel, setConstituencyLabel] = useState('');
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(true);
  const [showVVPAT, setShowVVPAT] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLearnMoreId, setActiveLearnMoreId] = useState(null);

  const isMobile = useMediaQuery('(max-width: 1023px)');
  const { phase, selectedCandidate, voteTimestamp, sessionId, mockResults, errorMessage, isTransitioning, enableMachine, castVote, viewResults, resetMachine, dismissError } = useEVMStateMachine(candidates);

  const loadCandidates = async (id) => {
    setIsLoadingCandidates(true);
    try { const result = await fetchCandidates(id); setCandidates(result.data.candidates); setConstituencyLabel(result.data.constituencyName); } 
    catch (err) { setCandidates([]); } finally { setIsLoadingCandidates(false); }
  };

  useEffect(() => { loadCandidates(DEFAULT_CONSTITUENCY); }, []);

  const handleConstituencyChange = (id) => { setConstituency(id); resetMachine(); setShowVVPAT(false); loadCandidates(id); };
  const handleLearnMore = (id) => { setActiveLearnMoreId(id); setModalOpen(true); };

  const handleCastVote = useCallback((candidateSerialNumber) => {
    castVote(candidateSerialNumber);
    trackEvent('evm_vote_cast', {
      constituency: constituencyLabel || constituency,
      flow_completed: true,
    });
  }, [castVote, constituencyLabel, constituency]);

  const stepInfo = EVM_PHASE_GUIDE[phase];

  return (
    <div className="w-full px-4 md:px-0">
      <div className="max-w-4xl mx-auto mb-10 flex flex-col items-center">
        <ConstituencySelector selectedConstituency={constituency} onConstituencyChange={handleConstituencyChange} isDisabled={phase !== 'idle'} />
      </div>

      <motion.div variants={STAGGER_CONTAINER} initial="initial" animate="animate" className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
        <EVMShell
          votingStep={phase}
          ballotUnitContent={<BallotUnit candidates={candidates} phase={phase} selectedCandidate={selectedCandidate} onVote={handleCastVote} constituencyName={constituencyLabel} isLoading={isLoadingCandidates} isMobile={isMobile} />}
          controlUnitContent={<ControlUnit phase={phase} selectedCandidate={selectedCandidate} candidates={candidates} onEnable={enableMachine} onViewResults={viewResults} onReset={resetMachine} onVVPATReady={() => { setShowVVPAT(true); setTimeout(() => setShowVVPAT(false), 7000); }} constituencyName={constituencyLabel} isMobile={isMobile} />}
          vvpatContent={<VVPATSlip show={showVVPAT} sessionId={sessionId} selectedCandidate={selectedCandidate} candidates={candidates} />}
        />
      </motion.div>

      <div className="max-w-4xl mx-auto mt-12">
        <EVMStepIndicator currentStep={phase} />
        <motion.div variants={FADE_UP} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="mt-8 bg-white border border-border-soft rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
          <div className="font-mono text-4xl font-bold text-border-soft shrink-0">{stepInfo.step}</div>
          <div className="flex-1"><p className="font-bold text-text-primary text-base">{stepInfo.instruction}</p><p className="text-text-secondary text-sm mt-2 leading-relaxed">{stepInfo.hint}</p></div>
          <button onClick={() => handleLearnMore(EVM_TOOLTIP_CONTENT[stepInfo.tooltipId]?.learnMoreId)} className="shrink-0 bg-accent-light text-accent px-6 py-3 rounded-xl font-bold text-sm hover:bg-accent hover:text-white transition-all flex items-center gap-2"><Info size={16} /> Learn More</button>
        </motion.div>
      </div>

      <LearnMoreModal isOpen={modalOpen} learnMoreId={activeLearnMoreId} onClose={() => setModalOpen(false)} />
    </div>
  );
};
export default EVMSimulator;