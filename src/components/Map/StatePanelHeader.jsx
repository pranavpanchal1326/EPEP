import { X } from 'lucide-react';
import { PHASE_COLORS } from '@/data/static-fallback';

const StatePanelHeader = ({ stateName, stateCode, phase, onClose }) => {
  const phaseInfo = PHASE_COLORS[phase] || PHASE_COLORS[0];
  
  return (
    <div className="p-5 pb-4 border-b border-[#E8E4DC] bg-white sticky top-0 z-10">
      <div className="flex justify-between items-start">
        <h2 className="font-display text-2xl font-bold text-[#1A1814]">
          {stateName}
          {stateCode && (
            <span className="font-body text-[13px] font-normal text-[#6B6560] ml-2">
              · {stateCode}
            </span>
          )}
        </h2>
        
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md bg-[#F8F7F4] border border-[#E8E4DC] text-[#6B6560] hover:bg-[#EBF2ED] hover:border-[#2D5A3D] hover:text-[#2D5A3D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2D5A3D] focus:ring-offset-2"
          aria-label="Close state panel"
          tabIndex={0}
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-2 flex gap-1.5 flex-wrap">
        {/* Phase Badge */}
        <div 
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-body"
          style={{ 
            backgroundColor: `${phaseInfo.fill}26`, // 15% opacity
            border: `1px solid ${phaseInfo.fill}66`, // 40% opacity
            color: phaseInfo.fill === '#E8E4DC' ? '#6B6560' : phaseInfo.fill
          }}
        >
          Phase {phase} {phaseInfo.date && `· ${phaseInfo.date}`}
        </div>

        {/* Election Type Badge */}
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-body bg-[#EBF2ED] border border-[#2D5A3D40] text-[#2D5A3D]">
          Lok Sabha 2024
        </div>
      </div>
    </div>
  );
};

export default StatePanelHeader;
