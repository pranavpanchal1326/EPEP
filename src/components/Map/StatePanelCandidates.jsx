import { Database, CheckCircle, AlertCircle } from 'lucide-react';

const StatePanelCandidates = ({ notableCandidates = [] }) => {
  return (
    <div className="border-t border-[#E8E4DC]">
      <div className="px-5 pt-4 pb-2 flex justify-between items-end">
        <div>
          <h3 className="font-display text-base font-bold text-[#1A1814]">
            Notable Candidates
          </h3>
          <p className="font-body text-[11px] text-[#6B6560]">
            Assets · Criminal Cases · Education
          </p>
        </div>
        <div className="bg-[#EBF2ED] text-[#2D5A3D] text-[10px] px-2 py-0.5 rounded-full font-body">
          via MyNeta.info
        </div>
      </div>

      {notableCandidates.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2">
          <Database size={20} className="text-[#E8E4DC]" aria-hidden="true" />
          <span className="font-body text-[13px] text-[#6B6560]">
            Candidate data loading...
          </span>
        </div>
      ) : (
        <div className="pb-4">
          {notableCandidates.map((candidate, idx) => (
            <div 
              key={`${candidate.name}-${idx}`}
              className="p-5 border-b border-[#E8E4DC] last:border-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-body text-sm font-semibold text-[#1A1814]">
                    {candidate.name}
                  </h4>
                  <p className="font-body text-[11px] text-[#6B6560]">
                    {candidate.constituency} constituency
                  </p>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                  candidate.won 
                    ? 'bg-[#EBF2ED] text-[#2D5A3D]' 
                    : 'bg-[#F8F7F4] text-[#6B6560]'
                }`}>
                  {candidate.won && <CheckCircle size={10} />}
                  {candidate.won ? 'Won' : 'Contested'}
                </div>
              </div>

              <div 
                className="inline-block px-2 py-0.5 rounded-full text-[11px] font-body mb-2"
                style={{
                  backgroundColor: `${candidate.partyColor || '#2D5A3D'}26`,
                  border: `1px solid ${candidate.partyColor || '#2D5A3D'}66`,
                  color: candidate.partyColor || '#2D5A3D'
                }}
              >
                {candidate.party}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#6B6560] uppercase tracking-wider font-body">Assets</span>
                  <span className="text-[11px] font-mono text-[#1A1814]">{candidate.assets}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#6B6560] uppercase tracking-wider font-body">Cases</span>
                  <div className="flex items-center gap-1">
                    {candidate.criminalCases === 0 ? (
                      <CheckCircle size={10} className="text-[#2D5A3D]" />
                    ) : (
                      <AlertCircle size={10} className="text-[#C0392B]" />
                    )}
                    <span className={`text-[11px] font-mono ${
                      candidate.criminalCases === 0 ? 'text-[#2D5A3D]' : 'text-[#C0392B]'
                    }`}>
                      {candidate.criminalCases}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#6B6560] uppercase tracking-wider font-body">Edu</span>
                  <span className="text-[11px] font-mono text-[#1A1814]">{candidate.education}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatePanelCandidates;
