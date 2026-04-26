import { useState, useEffect } from 'react';
import { PHASE_COLORS } from '@/data/static-fallback';

const PhaseLegend = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const phases = Object.entries(PHASE_COLORS)
    .filter(([key]) => key !== '0')
    .sort(([a], [b]) => a - b);

  return (
    <div 
      className={`absolute bottom-8 left-4 z-[1000] bg-white/95 backdrop-blur-sm border border-[#E8E4DC] rounded-[12px] p-4 shadow-card transition-all duration-300 min-w-[200px] ${
        isCollapsed ? 'h-[64px] overflow-hidden' : 'h-auto'
      }`}
    >
      <div className="flex justify-between items-start mb-2.5">
        <div>
          <span className="block font-body text-[10px] font-semibold text-[#6B6560] uppercase tracking-[0.08em]">
            2024 LOK SABHA
          </span>
          <span className="font-display text-[13px] text-[#1A1814]">
            Election Phases
          </span>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-[#EBF2ED] rounded-md transition-colors"
        >
          <span 
            className="block transition-transform duration-200" 
            style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            ▾
          </span>
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
          {phases.map(([key, phase]) => (
            <div key={key} className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                style={{ background: phase.fill }}
              />
              <span className="font-body text-[12px] text-[#1A1814] font-500 min-w-[50px]">
                {phase.label}
              </span>
              <span className="font-body text-[11px] text-[#6B6560]">
                {phase.date}
              </span>
              <span className="font-mono text-[11px] text-[#2D5A3D] ml-auto">
                {phase.seats} seats
              </span>
            </div>
          ))}
          
          <div className="border-t border-[#E8E4DC] mt-2 pt-2">
            <span className="font-body text-[11px] text-[#6B6560] italic">
              Click any state for details
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseLegend;
