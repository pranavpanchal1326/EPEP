import { useRef } from 'react';
import { Users, TrendingUp, UserCheck, MapPin } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const StatCard = ({ icon: Icon, value, label, isLoading }) => {
  const shimmerStyle = {
    background: 'linear-gradient(90deg, #E8E4DC 25%, #F8F7F4 50%, #E8E4DC 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear'
  };

  return (
    <div className="bg-[#F8F7F4] rounded-[10px] p-3 border border-[#E8E4DC] flex flex-col items-start gap-1">
      {isLoading ? (
        <div className="w-full">
          <div className="h-6 w-[70%] rounded-md" style={shimmerStyle} />
          <div className="h-2.5 w-[50%] rounded-md mt-1.5" style={shimmerStyle} />
        </div>
      ) : (
        <>
          <Icon size={14} className="text-[#2D5A3D]" aria-hidden="true" />
          <span className="font-mono text-xl font-semibold text-[#1A1814]">
            {value ?? '—'}
          </span>
          <span className="font-body text-[11px] font-medium text-[#6B6560] uppercase tracking-[0.05em]">
            {label}
          </span>
        </>
      )}
    </div>
  );
};

const StatePanelStats = ({ totalSeats, turnout2024, registeredVoters, pollingStations, isLoading }) => {
  const containerRef = useRef(null);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div 
        ref={containerRef}
        className="grid grid-cols-2 gap-2 p-5"
      >
        <StatCard 
          icon={Users} 
          value={totalSeats} 
          label="Total Seats" 
          isLoading={isLoading} 
        />
        <StatCard 
          icon={TrendingUp} 
          value={turnout2024 ? `${turnout2024}%` : null} 
          label="Turnout 2024" 
          isLoading={isLoading} 
        />
        <StatCard 
          icon={UserCheck} 
          value={registeredVoters} 
          label="Registered" 
          isLoading={isLoading} 
        />
        <StatCard 
          icon={MapPin} 
          value={pollingStations?.toLocaleString('en-IN')} 
          label="Polling Stns" 
          isLoading={isLoading} 
        />
      </div>
    </>
  );
};

export default StatePanelStats;
