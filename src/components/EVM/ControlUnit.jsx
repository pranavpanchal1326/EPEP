import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Receipt, AlertTriangle, X } from 'lucide-react';

const ControlUnit = ({ 
  phase, 
  selectedCandidate, 
  candidates, 
  voteTimestamp, 
  sessionId, 
  mockResults, 
  errorMessage, 
  isTransitioning,
  onEnable, 
  onViewResults, 
  onReset, 
  onVVPATReady,
  constituencyName,
  dismissError
}) => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    if (phase === 'enabling' || phase === 'voting') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '.' : prev + '.');
      }, 400);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'voted' && onVVPATReady) {
      onVVPATReady();
    }
  }, [phase, onVVPATReady]);

  const ledColors = {
    idle: '#6B6560',
    enabling: '#FF9800',
    enabled: '#4CAF50',
    voting: '#FF9800',
    voted: '#4CAF50',
    results: '#2196F3'
  };

  return (
    <div className="flex flex-col bg-evm-surface border-[1.5px] border-white/10 rounded-xl h-full overflow-hidden shadow-2xl">
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes ledPulse { 0%, 100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.4; transform: scale(0.85) } }
        @keyframes progressFill { from { width: 0% } to { width: 100% } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/* Header */}
      <div className="bg-[#111009] px-5 py-4 border-b border-white/5 flex justify-between items-center">
        <div>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase">CONTROL UNIT</span>
          <p className="font-sans text-[11px] text-white/50">Election Commission of India</p>
        </div>
        <div 
          className="w-2.5 h-2.5 rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: ledColors[phase],
            boxShadow: phase !== 'idle' ? `0 0 8px ${ledColors[phase]}, 0 0 16px ${ledColors[phase]}66` : 'none',
            animation: (phase === 'enabling' || phase === 'voting') ? 'ledPulse 600ms ease-in-out infinite' : 'none'
          }}
        />
      </div>

      {/* LCD Screen */}
      <div className="m-5 bg-[#0D1F0F] border border-accent/30 rounded-lg min-h-[180px] p-5 font-mono relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-1" 
             style={{ background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)' }} />
        
        <div className="relative z-10 text-white/70 text-[11px]">
          {phase === 'idle' && (
            <div className="space-y-1">
              <p className="text-accent/60 tracking-[0.15em]">SYSTEM READY</p>
              <div className="h-4" />
              <p className="text-sm">Awaiting Returning</p>
              <p className="text-sm">Officer authorization</p>
              <div className="h-4" />
              <p className="text-[11px] text-white/30">Press ENABLE to begin <span className="animate-[blink_0.8s_step-end_infinite]">█</span></p>
            </div>
          )}

          {phase === 'enabling' && (
            <div className="space-y-1">
              <p className="text-[#FF9800] tracking-[0.15em]">INITIALIZING</p>
              <div className="h-4" />
              <p className="text-sm">Enabling voting</p>
              <p className="text-sm">machine{dots}</p>
              <div className="h-4" />
              <div className="h-[3px] bg-white/10 w-full overflow-hidden">
                <div className="h-full bg-[#FF9800] animate-[progressFill_1500ms_linear_forwards]" />
              </div>
            </div>
          )}

          {phase === 'enabled' && (
            <div className="space-y-1">
              <p className="text-[#4CAF50] tracking-[0.15em]">MACHINE ENABLED</p>
              <div className="h-4" />
              <p className="text-sm text-white/90">Voter may now</p>
              <p className="text-sm text-white/90">cast their vote</p>
              <div className="h-4" />
              <p className="text-[11px] text-white/30">Waiting for voter <span className="animate-[blink_0.8s_step-end_infinite]">█</span></p>
              <p className="text-[10px] text-white/20 truncate mt-2">{constituencyName}</p>
            </div>
          )}

          {phase === 'voting' && (
            <div className="space-y-1">
              <p className="text-[#FF9800] tracking-[0.15em] animate-[ledPulse_600ms_infinite]">RECORDING VOTE</p>
              <div className="h-4" />
              <p className="text-sm text-white/90">Processing ballot</p>
              <p className="text-sm text-white/90">entry{dots}</p>
              <div className="h-4" />
              <div className="h-[3px] bg-white/10 w-full overflow-hidden">
                <div className="h-full bg-[#FF9800] animate-[progressFill_800ms_linear_forwards]" />
              </div>
            </div>
          )}

          {phase === 'voted' && (
            <div className="space-y-1">
              <p className="text-[#4CAF50] tracking-[0.15em]">VOTE RECORDED</p>
              <div className="h-4" />
              <p className="text-sm text-white/90">Your vote has been</p>
              <p className="text-sm text-white/90">successfully recorded</p>
              <div className="h-4" />
              <p className="text-[10px] text-[#4CAF50]">Serial No: {sessionId}</p>
              <p className="text-[10px] text-white/25">
                {voteTimestamp?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}  {voteTimestamp?.toLocaleTimeString('en-GB', { hour12: false })}
              </p>
            </div>
          )}

          {phase === 'results' && (
            <div className="space-y-1">
              <p className="text-[#2196F3] tracking-[0.15em]">MOCK RESULTS</p>
              <p className="text-[10px] text-white/20 uppercase">FOR EDUCATIONAL PURPOSES ONLY</p>
              <div className="h-2" />
              {mockResults?.slice(0, 3).map((r, i) => (
                <div key={r.serialNumber} className="flex items-center gap-2 text-[10px]">
                  <span className={`w-6 ${i === 0 ? 'text-[#FFD700]' : i === 1 ? 'text-[#C0C0C0]' : 'text-[#CD7F32]'}`}>
                    {i === 0 ? '1st' : i === 1 ? '2nd' : '3rd'}
                  </span>
                  <span className="text-white/50">#{r.serialNumber === 999 ? 'N' : r.serialNumber}</span>
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden mx-1">
                    <div className="h-full transition-all duration-1000" 
                         style={{ 
                           width: `${(r.votes / mockResults[0].votes) * 100}%`,
                           backgroundColor: i === 0 ? '#4CAF50' : 'rgba(255,255,255,0.25)'
                         }} />
                  </div>
                  <span className="text-white/60 w-12 text-right">{r.votes.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* VVPAT Notification */}
      {phase === 'voted' && (
        <div className="mx-5 mb-5 bg-accent/15 border border-accent/35 rounded-lg p-3 flex items-center gap-3 animate-[slideDown_200ms_ease-out]">
          <Receipt size={20} className="text-[#4CAF50] flex-shrink-0" />
          <div className="font-sans">
            <p className="text-[13px] font-semibold text-white/85">Check your VVPAT slip</p>
            <p className="text-[11px] text-white/45 leading-tight mt-0.5">A paper slip has printed showing your vote. Visible for 7 seconds.</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {errorMessage && (
        <div className="mx-5 mb-3 bg-red-900/10 border border-red-900/30 rounded-md p-3 flex items-start gap-2">
          <AlertTriangle size={14} className="text-error mt-0.5" />
          <p className="text-[12px] text-white/60 flex-1">{errorMessage}</p>
          <button onClick={dismissError} className="text-white/40 hover:text-white"><X size={12} /></button>
        </div>
      )}

      {/* RO Panel */}
      <div className="mt-auto p-5 border-t border-white/5 space-y-2">
        <span className="font-mono text-[9px] text-white/20 tracking-[0.2em] uppercase block mb-2">
          RETURNING OFFICER CONTROLS
        </span>
        
        <button 
          onClick={() => phase === 'idle' && onEnable()}
          className={`
            w-full py-2.5 px-4 rounded-md font-sans text-[13px] font-semibold transition-all active:scale-95 duration-75
            ${phase === 'idle' ? 'bg-[#2D5A3D] text-white border border-[#4CAF50] cursor-pointer' : 'bg-[#1A2A1F] text-white/20 border border-white/5 cursor-not-allowed'}
          `}
        >
          {phase === 'idle' ? '⚡ Enable Voting Machine' : phase === 'enabling' ? '⏳ Enabling...' : '✓ Machine Enabled'}
        </button>

        {phase === 'voted' && (
          <button 
            onClick={onViewResults}
            className="w-full py-2.5 px-4 rounded-md font-sans text-[13px] font-semibold border border-[#2196F3] text-[#2196F3] hover:bg-[#2196F3]/10 animate-[slideDown_300ms_ease-out_2000ms_both]"
          >
            📊 View Mock Results
          </button>
        )}

        {(phase === 'voted' || phase === 'results') && (
          <button 
            onClick={onReset}
            className="w-full py-2.5 px-4 rounded-md font-sans text-[12px] text-white/40 border border-white/10 hover:border-white/25 hover:text-white/60 transition-colors"
          >
            ↺ Reset & Vote Again
          </button>
        )}
      </div>
    </div>
  );
};

ControlUnit.propTypes = {
  phase: PropTypes.string.isRequired,
  selectedCandidate: PropTypes.number,
  candidates: PropTypes.array.isRequired,
  voteTimestamp: PropTypes.instanceOf(Date),
  sessionId: PropTypes.string,
  mockResults: PropTypes.array,
  errorMessage: PropTypes.string,
  isTransitioning: PropTypes.bool,
  onEnable: PropTypes.func.isRequired,
  onViewResults: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onVVPATReady: PropTypes.func,
  constituencyName: PropTypes.string.isRequired,
  dismissError: PropTypes.func.isRequired
};

export default ControlUnit;
