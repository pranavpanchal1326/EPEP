import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { X, ExternalLink } from 'lucide-react';
import { EVM_LEARN_MORE_CONTENT } from '../../data/evm-education';

const ModalSection = ({ title, content, color, isMono }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <div className="w-3.5 h-3.5 rounded-[3px]" style={{ backgroundColor: color }} />
      <span className="font-sans text-[11px] font-bold tracking-wider uppercase" style={{ color }}>
        {title}
      </span>
    </div>
    <div className={`font-sans text-[15px] leading-relaxed text-[#1A1814] ${isMono ? 'bg-[#1A1814]/5 border-l-4 border-[#E8E4DC] rounded-r-lg p-4 font-mono text-[13px] text-[#6B6560]' : ''}`}>
      {content}
    </div>
  </div>
);

const LearnMoreModal = ({ isOpen, learnMoreId, onClose }) => {
  const modalRef = useRef(null);
  const content = EVM_LEARN_MORE_CONTENT[learnMoreId] || {
    title: 'Content not found',
    subtitle: 'We couldn’t find the requested information.',
    whatItIs: 'Please try again later.',
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1A1814]/75 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Card */}
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[600px] max-height-[85vh] bg-[#F8F7F4] rounded-[20px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-7 md:p-8 pb-5 border-b border-[#E8E4DC] sticky top-0 bg-[#F8F7F4] z-10 flex justify-between items-start">
          <div className="flex-1">
            <span className="inline-block bg-[#EBF2ED] text-[#2D5A3D] text-[11px] font-bold px-3 py-1 rounded-full mb-2">
              EVM Education
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1A1814] leading-tight">
              {content.title}
            </h2>
            <p className="font-body text-sm text-[#6B6560] mt-1">{content.subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1A1814]/5 hover:bg-[#1A1814]/10 text-[#6B6560] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7 md:p-8 space-y-7 scrollbar-thin">
          <ModalSection title="WHAT IT IS" content={content.whatItIs} color="#2D5A3D" />
          {content.whyItExists && <ModalSection title="WHY IT EXISTS" content={content.whyItExists} color="#1565C0" />}
          {content.howItWorks && <ModalSection title="HOW IT WORKS" content={content.howItWorks} color="#E65100" />}
          {content.legalBasis && <ModalSection title="LEGAL BASIS" content={content.legalBasis} color="#6B6560" isMono />}
          
          {content.didYouKnow && (
            <div className="bg-[#EBF2ED] border border-[#2D5A3D]/20 rounded-xl p-5 md:p-6">
              <h4 className="font-sans text-[13px] font-bold text-[#2D5A3D] mb-2 flex items-center gap-2">
                <span>💡</span> Did You Know?
              </h4>
              <p className="font-sans text-[14px] leading-relaxed text-[#1A1814]">{content.didYouKnow}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 pt-4 border-t border-[#E8E4DC] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="font-mono text-[10px] text-[#6B6560] tracking-wider uppercase">Source</span>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="font-sans text-[12px] text-[#6B6560]">{content.source}</span>
              <a 
                href={content.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#2D5A3D] hover:underline flex items-center gap-1 text-[12px] font-medium"
              >
                Verify <ExternalLink size={12} />
              </a>
            </div>
          </div>
          <button onClick={onClose} className="w-full md:w-auto px-6 py-2.5 rounded-lg border border-[#E8E4DC] font-sans text-[13px] font-bold text-[#1A1814] hover:bg-black/5 hover:border-[#2D5A3D] transition-all">
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

LearnMoreModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  learnMoreId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default LearnMoreModal;
