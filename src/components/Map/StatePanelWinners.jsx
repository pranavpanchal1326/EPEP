import { Database } from 'lucide-react';

const StatePanelWinners = ({ recentWinners = [] }) => {
  return (
    <div className="border-t border-[#E8E4DC]">
      <div className="px-5 pt-4 pb-2">
        <h3 className="font-display text-base font-bold text-[#1A1814]">
          Recent Results
        </h3>
        <p className="font-body text-[11px] text-[#6B6560]">
          Last 3 Lok Sabha elections
        </p>
      </div>

      {recentWinners.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2">
          <Database size={20} className="text-[#E8E4DC]" aria-hidden="true" />
          <span className="font-body text-[13px] text-[#6B6560]">
            Historical data loading...
          </span>
        </div>
      ) : (
        <div className="pb-4">
          {recentWinners.map((winner, idx) => (
            <div 
              key={`${winner.year}-${idx}`}
              className="px-5 py-2.5 flex items-center group hover:bg-[#F8F7F4] transition-colors"
            >
              <span className="font-mono text-[13px] text-[#6B6560] min-w-[36px]">
                {winner.year}
              </span>
              
              <div className="flex-1 flex flex-col mx-2.5">
                <div className="flex justify-between items-end mb-1">
                  <span className="font-body text-[13px] font-semibold text-[#1A1814]">
                    {winner.party}
                    <span className="font-normal text-[11px] text-[#6B6560] ml-1.5">
                      {winner.allianceName}
                    </span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#E8E4DC] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(winner.seatsWon / winner.totalSeats) * 100}%`,
                      backgroundColor: winner.partyColor || '#2D5A3D'
                    }}
                  />
                </div>
              </div>

              <span className="font-mono text-[13px] text-[#1A1814]">
                {winner.seatsWon} <span className="text-[11px] text-[#6B6560]">/ {winner.totalSeats}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatePanelWinners;
