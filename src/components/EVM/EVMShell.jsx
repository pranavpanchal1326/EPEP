import EVMCableConnector from './EVMCableConnector';

const ECIEmblem = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ECI Emblem">
    <circle cx="9" cy="8" r="3" fill="currentColor" opacity="0.8"/>
    <circle cx="14" cy="6" r="3.5" fill="currentColor"/>
    <circle cx="19" cy="8" r="3" fill="currentColor" opacity="0.8"/>
    <rect x="5" y="13" width="18" height="3" rx="1" fill="currentColor"/>
    <circle cx="14" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <line x1="14" y1="18" x2="14" y2="26" stroke="currentColor" strokeWidth="1"/>
    <line x1="10" y1="22" x2="18" y2="22" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const PanelHeader = () => (
  <div className="bg-[#0F0D0A] border-b border-[#2A2620] px-3.5 py-2.5 flex items-center gap-2.5">
    <div className="text-[#8A8480]">
      <ECIEmblem />
    </div>
    <div className="flex flex-col">
      <span className="font-body text-[8px] font-bold tracking-[0.1em] uppercase text-[#8A8480]">
        ELECTION COMMISSION
      </span>
      <span className="font-body text-[7px] tracking-[0.08em] text-[#6B6560]">
        OF INDIA
      </span>
    </div>
  </div>
);

const BallotPlaceholder = () => (
  <div className="p-5 flex flex-col gap-2.5">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="h-9 bg-white/5 border border-white/10 rounded-md animate-pulse" />
    ))}
  </div>
);

const ControlPlaceholder = () => (
  <div className="p-5 flex flex-col items-center gap-3">
    <div className="w-full h-20 bg-black/30 border border-white/5 rounded-lg" />
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="w-[80%] h-8 bg-white/5 rounded-md" />
    ))}
  </div>
);

const VVPATPlaceholder = () => (
  <div className="flex items-center justify-center h-14 text-white/15 text-[10px] font-body tracking-[0.1em] uppercase">
    VVPAT DISPLAY
  </div>
);

const EVMShell = ({ ballotUnitContent, controlUnitContent, vvpatContent, votingStep }) => {
  const isVoting = votingStep === 'select-candidate' || votingStep === 'confirm-vote';
  const isConfirmed = votingStep === 'result' || votingStep === 'vvpat-display';

  return (
    <div className="max-w-[1100px] mx-auto px-6 pb-16">
      <div className="flex flex-col-reverse md:flex-row items-center md:items-end justify-center gap-0 md:gap-0">
        
        {/* BALLOT COLUMN (VVPAT + BALLOT UNIT) */}
        <div className="flex flex-col items-center w-full max-w-[320px] md:w-[240px]">
          {/* VVPAT Unit */}
          <div className="w-full bg-[#1A1814] border-2 border-[#2A2620] border-b-0 rounded-t-[10px] min-h-[80px] relative overflow-hidden">
            {vvpatContent || <VVPATPlaceholder />}
          </div>

          {/* Ballot Unit Panel */}
          <div 
            className={`w-full bg-[#1A1814] border-2 border-[#2A2620] border-t-[#3A3630] rounded-b-[12px] min-h-[480px] relative flex flex-col shadow-2xl transition-all duration-400
              ${isVoting ? 'ring-inset ring-2 ring-[#2D5A3D]/40' : ''}
              ${isConfirmed ? 'shadow-[0_0_40px_rgba(0,200,83,0.15)]' : ''}
            `}
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 40px rgba(0,0,0,0.4)' }}
          >
            <PanelHeader />
            <div className="flex-1">
              {ballotUnitContent || <BallotPlaceholder />}
            </div>
            <div className="bg-[#0F0D0A] border-t border-[#2A2620] px-3.5 py-2 flex justify-between items-center">
              <span className="font-body text-[9px] font-bold tracking-[0.14em] uppercase text-[#6B6560]">BALLOT UNIT</span>
              <span className="font-mono text-[9px] text-[#3A3630]">BU-01</span>
            </div>
          </div>
        </div>

        {/* CABLE CONNECTOR */}
        <EVMCableConnector />

        {/* CONTROL UNIT PANEL */}
        <div 
          className={`w-full max-w-[320px] md:w-[300px] bg-[#1A1814] border-2 border-[#2A2620] rounded-[12px] min-h-[420px] relative flex flex-col shadow-2xl transition-all duration-400
            ${isConfirmed ? 'shadow-[0_0_40px_rgba(0,200,83,0.15)]' : ''}
          `}
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 40px rgba(0,0,0,0.4)' }}
        >
          <PanelHeader />
          <div className="flex-1">
            {controlUnitContent || <ControlPlaceholder />}
          </div>
          <div className="bg-[#0F0D0A] border-t border-[#2A2620] px-3.5 py-2 flex justify-between items-center">
            <span className="font-body text-[9px] font-bold tracking-[0.14em] uppercase text-[#6B6560]">CONTROL UNIT</span>
            <span className="font-mono text-[9px] text-[#3A3630]">CU-01</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EVMShell;
