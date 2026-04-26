import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import StatePanelHeader from './StatePanelHeader';
import StatePanelStats from './StatePanelStats';
import StatePanelWinners from './StatePanelWinners';
import StatePanelCandidates from './StatePanelCandidates';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motionVariants';

const StatePanel = ({ selectedState, isOpen, isLoading, onClose }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const data = selectedState || {};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1A1814] z-[1040]"
              onClick={onClose}
            />
          )}

          <motion.div
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (isMobile && (offset.y > 200 || velocity.y > 500)) onClose();
            }}
            initial={isMobile ? { y: "100%" } : { x: "100%", opacity: 0 }}
            animate={isMobile ? { y: "0%" } : { x: "0%", opacity: 1 }}
            exit={isMobile ? { y: "100%" } : { x: "100%", opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed md:absolute z-[1050] bg-white flex flex-col shadow-2xl ${
              isMobile 
                ? 'bottom-0 left-0 right-0 h-[80dvh] rounded-t-[24px]' 
                : 'top-0 right-0 h-full w-[380px] border-l border-border-soft'
            }`}
          >
            {isMobile && (
              <div className="w-full flex justify-center py-3 flex-shrink-0">
                <div className="w-10 h-1.5 rounded-full bg-border-soft" />
              </div>
            )}

            <div className="absolute top-4 right-4 md:right-6 md:top-6 z-20">
              <button onClick={onClose} className="p-2 bg-bg-base rounded-full text-text-muted hover:text-text-primary touch-target">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20">
               <motion.div variants={STAGGER_CONTAINER} initial="initial" animate="animate">
                  <motion.div variants={STAGGER_ITEM}>
                    <StatePanelHeader stateName={data.name} stateCode={data.stateCode} phase={data.phase} hideClose />
                  </motion.div>
                  <motion.div variants={STAGGER_ITEM}>
                    <StatePanelStats totalSeats={data.totalSeats} turnout2024={data.turnout2024} registeredVoters={data.registeredVoters} pollingStations={data.pollingStations} isLoading={isLoading} />
                  </motion.div>
                  <motion.div variants={STAGGER_ITEM}><StatePanelWinners recentWinners={data.recentWinners} /></motion.div>
                  <motion.div variants={STAGGER_ITEM}><StatePanelCandidates notableCandidates={data.notableCandidates} /></motion.div>
               </motion.div>
            </div>
            
            <div className="p-6 bg-bg-base border-t border-border-soft safe-bottom mt-auto">
               <p className="text-[10px] text-text-muted text-center uppercase tracking-widest font-bold">Official ECI Verified Data</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default StatePanel;