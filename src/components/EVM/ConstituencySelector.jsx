import { ChevronDown, Lock } from 'lucide-react';
import { STATIC_CONSTITUENCY_DATA } from '@/data/static-fallback';

const ConstituencySelector = ({ selectedConstituency, onConstituencyChange, isDisabled }) => {
  const options = Object.entries(STATIC_CONSTITUENCY_DATA).map(([id, data]) => ({
    value: id,
    label: `${data.name}, ${data.stateName}`,
  }));

  return (
    <div className="px-6 pb-8 max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-3 justify-center">
      <label className="font-body text-sm font-semibold text-[#1A1814] whitespace-nowrap">
        Select Constituency:
      </label>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:min-w-[280px] group">
          <select
            value={selectedConstituency || ''}
            onChange={(e) => onConstituencyChange(e.target.value)}
            disabled={isDisabled}
            className={`
              w-full appearance-none bg-white border border-[#E8E4DC] rounded-[10px] px-3.5 py-2.5 font-body text-[14px] text-[#1A1814]
              transition-all duration-200 focus:outline-none focus:border-[#2D5A3D] focus:ring-4 focus:ring-[#EBF2ED]
              ${isDisabled ? 'bg-[#F8F7F4] text-[#6B6560] cursor-not-allowed opacity-70' : 'cursor-pointer'}
            `}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown 
            size={16} 
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6560] pointer-events-none" 
            aria-hidden="true" 
          />
        </div>

        {isDisabled && (
          <div className="relative group/lock">
            <Lock size={14} className="text-[#6B6560]" aria-hidden="true" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1814] text-[#F8F7F4] text-[11px] font-body rounded-md whitespace-nowrap opacity-0 group-hover/lock:opacity-100 transition-opacity pointer-events-none">
              Cannot change constituency during voting
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstituencySelector;
