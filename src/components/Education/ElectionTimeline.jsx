import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Building2, Crown, MapPin, Users, ChevronRight, Info, Megaphone, FileText, CheckSquare, Clipboard, Gavel, Map, Home } from 'lucide-react';
import ELECTION_TIMELINE_DATA from '../../data/election-timeline.js';
import ProcessStep from './ProcessStep';
import { STAGGER_CONTAINER, STAGGER_ITEM, BUTTON_PRESS } from '../../lib/motionVariants';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { trackEvent } from '../../lib/firebase';

const ICON_MAP = { Megaphone, FileText, Users, CheckSquare, Clipboard, Gavel, Map, Home };

const ElectionTimeline = () => {
  const [activeTab, setActiveTab] = useState('lokSabha');
  const [openPhases, setOpenPhases] = useState({});
  const containerRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end end"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const currentData = ELECTION_TIMELINE_DATA[activeTab];
    if (currentData?.phases.length > 0) setOpenPhases({ [currentData.phases[0].phaseId]: true });
  }, [activeTab]);

  const handleTogglePhase = (phaseId) => {
    const isOpening = !openPhases[phaseId];
    setOpenPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
    if (isOpening) {
      trackEvent('education_step_viewed', { step_id: phaseId, election_type: activeTab });
    }
  };

  const activeData = ELECTION_TIMELINE_DATA[activeTab];

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 min-h-screen relative overflow-hidden">
      <header className="mb-12 text-center">
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-text-primary mb-4">{activeData?.title}</h2>
        <p className="font-body text-text-secondary text-base md:text-xl max-w-2xl mx-auto">{activeData?.subtitle}</p>
      </header>

      <div className="flex overflow-x-auto no-scrollbar gap-3 mb-12 pb-4 scroll-snap-x">
        {['lokSabha', 'rajyaSabha', 'stateAssembly', 'localBody'].map((id) => {
          const tab = { lokSabha: Building2, rajyaSabha: Crown, stateAssembly: MapPin, localBody: Users }[id];
          const isActive = activeTab === id;
          return (
            <motion.button key={id} onClick={() => setActiveTab(id)} className={"flex-shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-full border-2 transition-all font-body font-bold text-sm scroll-snap-align-start " + (isActive ? 'bg-accent border-accent text-white shadow-lg' : 'bg-surface border-border-soft text-text-muted')}>
              {React.createElement(tab, { size: 18 })} {id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </motion.button>
          );
        })}
      </div>

      <div className="relative">
        <motion.div style={{ scaleY, originY: 0 }} className={"absolute top-0 bottom-0 w-1 bg-accent/20 rounded-full " + (isMobile ? 'left-5' : 'left-10')} />
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={STAGGER_CONTAINER} initial="initial" animate="animate" className="flex flex-col gap-8">
            {activeData?.phases.map((phase, pIdx) => {
              const PhaseIcon = ICON_MAP[phase.phaseIcon] || Info;
              const isOpen = !!openPhases[phase.phaseId];
              return (
                <motion.div key={phase.phaseId} variants={STAGGER_ITEM} className="relative">
                  <button onClick={() => handleTogglePhase(phase.phaseId)} className={"w-full text-left flex items-center justify-between p-5 md:p-6 rounded-2xl transition-all relative z-10 " + (isOpen ? 'bg-accent-light border border-accent/20 shadow-sm' : 'bg-surface border border-border-soft hover:border-accent shadow-card')}>
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className={"w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-colors " + (isOpen ? 'bg-accent text-white' : 'bg-bg-base text-text-muted')}>{React.createElement(PhaseIcon, { size: isMobile ? 20 : 28 })}</div>
                      <div><span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-0.5 block">Phase {pIdx + 1}</span><h3 className="font-display text-lg md:text-2xl font-bold">{phase.phaseTitle}</h3></div>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }}><ChevronRight size={20} className="text-text-muted" /></motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className={"flex flex-col gap-6 pt-6 " + (isMobile ? 'pl-10' : 'pl-24')}>
                          {phase.steps.map((step) => <ProcessStep key={step.stepId} step={step} />)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ElectionTimeline;