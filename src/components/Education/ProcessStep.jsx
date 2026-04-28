/**
 * @fileoverview Election Process Step — EPEP Education Component
 * @module ProcessStep
 *
 * An interactive, expandable card representing a single step in the
 * Indian election process. Displays description, responsible parties,
 * timeline, legal basis, and voter actions.
 *
 * @param {Object} props
 * @param {Object} props.step - Complete step data object
 */
import React, { useState } from 'react';
import { ChevronRight, ExternalLink, Clock, Scale, Users, AlertCircle, FileText } from 'lucide-react';
import PropTypes from 'prop-types';

const ProcessStep = ({ step }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const toggleExpand = () => setIsExpanded(prev => !prev);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpand();
    }
  };

  const stepNumber = step.stepId.match(/\d+$/)?.[0] || '?';

  return (
    <div className="w-full font-['DM_Sans']">
      <style>{`
        @keyframes epep-pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
        .animate-voter-pulse { animation: epep-pulse 2s infinite ease-in-out; }
        .step-content-transition { transition: max-height 350ms ease, opacity 250ms ease 50ms; }
        .step-content-collapsed { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 300ms ease, opacity 200ms ease; }
        :root { --color-eci-bg: #F0F4FF; --color-eci-border: #C7D4F5; --color-eci-text: #2C4BA0; }
      `}</style>
      <div 
        className={`relative bg-[var(--color-surface)] border rounded-[16px] transition-all duration-200 ${isExpanded ? 'border-[var(--color-accent)] shadow-md' : 'border-[var(--color-border)] shadow-sm hover:border-[var(--color-accent)] hover:-translate-y-[2px] cursor-pointer'} ${isFocusVisible ? 'ring-2 ring-[var(--color-accent)] ring-offset-2' : ''}`}
        onMouseEnter={() => !isExpanded} onMouseLeave={() => !isExpanded}
      >
        <div
          role="button" id={`step-header-${step.stepId}`} tabIndex={0} aria-expanded={isExpanded} aria-controls={`step-content-${step.stepId}`}
          onClick={toggleExpand} onKeyDown={handleKeyDown} onFocus={() => setIsFocusVisible(true)} onBlur={() => setIsFocusVisible(false)}
          className="flex items-center justify-between p-5 md:px-6 md:py-[18px] min-h-[56px] focus:outline-none"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
              <span className="font-['JetBrains_Mono'] text-[12px] font-bold text-white">{stepNumber}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] leading-tight">{step.title}</h3>
              {step.voterAction && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold uppercase tracking-wider animate-voter-pulse" aria-label="This step requires action from you as a voter">
                  Your Action Required
                </span>
              )}
            </div>
          </div>
          <ChevronRight size={18} className={`text-[var(--color-text-secondary)] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
        <div id={`step-content-${step.stepId}`} role="region" aria-labelledby={`step-header-${step.stepId}`} className={isExpanded ? 'step-content-transition max-h-[1200px] opacity-100' : 'step-content-collapsed'}>
          <div className="mx-5 border-t border-[var(--color-border)]"></div>
          <div className="p-5 md:px-6 md:pb-6 flex flex-col gap-5">
            <section>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-[var(--color-text-secondary)]" />
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Description</label>
              </div>
              <p className="text-[15px] leading-[1.65] text-[var(--color-text-secondary)]">{step.description}</p>
            </section>
            <hr className="border-none border-t border-[var(--color-border)] my-3" />
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-[var(--color-text-secondary)]" />
                <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Responsible Parties</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {step.responsible.map((party, idx) => {
                  const isVoter = party.toLowerCase() === 'voter';
                  const isECI = party.toUpperCase() === 'eci';
                  return (
                    <span key={idx} className={`px-2.5 py-1 rounded-full text-[12px] font-medium border transition-colors ${isVoter ? 'bg-[var(--color-accent-light)] border-[var(--color-accent)] text-[var(--color-accent)] font-semibold' : isECI ? 'bg-[var(--color-eci-bg)] border-[var(--color-eci-border)] text-[var(--color-eci-text)]' : 'bg-transparent border-[var(--color-border)] text-[var(--color-text-secondary)]'}`}>
                      {party}
                    </span>
                  );
                })}
              </div>
            </section>
            <hr className="border-none border-t border-[var(--color-border)] my-3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-[var(--color-text-secondary)]" />
                  <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Timeline</label>
                </div>
                <div className="font-['JetBrains_Mono'] text-[13px] text-[var(--color-text-primary)] bg-[var(--color-bg)] px-3 py-2 rounded-lg inline-block w-full md:w-auto">{step.timeline}</div>
              </section>
              <section>
                <div className="flex items-center gap-2 mb-2">
                  <Scale size={14} className="text-[var(--color-text-secondary)]" />
                  <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Legal Basis</label>
                </div>
                <div className="font-['JetBrains_Mono'] text-[13px] text-[var(--color-text-primary)] bg-[var(--color-bg)] px-3 py-2 rounded-lg inline-block w-full md:w-auto">{step.legalBasis}</div>
              </section>
            </div>
            {step.voterAction && (
              <section className="bg-[var(--color-accent-light)] border-l-[3px] border-[var(--color-accent)] rounded-r-lg p-3 md:p-[14px_16px] mt-2 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-[var(--color-accent)]" />
                  <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">Your Action</label>
                </div>
                <p className="text-[14px] font-medium text-[var(--color-text-primary)] leading-relaxed">{step.voterActionText}</p>
              </section>
            )}
            <div className="mt-2 w-full">
              <a href={step.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Verify ${step.title} at official source, opens in new tab`} className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-accent)] font-medium hover:underline group w-full md:w-auto min-h-[44px]">
                <span>Verify at source</span>
                <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProcessStep.propTypes = {
  step: PropTypes.shape({
    stepId:      PropTypes.string.isRequired,
    title:       PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    responsible: PropTypes.arrayOf(PropTypes.string).isRequired,
    legalBasis:  PropTypes.string,
    sourceUrl:   PropTypes.string,
  }).isRequired,
  isExpanded: PropTypes.bool,
  onToggle:   PropTypes.func,
};

ProcessStep.defaultProps = {
  isExpanded: false,
  onToggle: () => {},
};

export default ProcessStep;
