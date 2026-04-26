import { useEffect, useRef, useState } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { NATIONAL_STATS } from '@/data/static-fallback';

const StatCard = ({ label, value, shouldStart }) => {
  const numericMatch = value.match(/(\d+\.?\d*)/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const suffix = value.replace(numericMatch ? numericMatch[0] : '', '');
  
  const animatedValue = useCountUp(numericValue, 800, shouldStart);

  return (
    <div className="flex-1 bg-white p-4 flex flex-col items-start transition-colors duration-200 hover:bg-[#EBF2ED] group">
      <span className="font-mono text-[22px] font-semibold text-[#1A1814] group-hover:text-[#2D5A3D]">
        {animatedValue}{suffix}
      </span>
      <span className="font-body text-[11px] font-medium text-[#6B6560] uppercase tracking-[0.06em]">
        {label}
      </span>
    </div>
  );
};

const NationalStatsStrip = () => {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full flex flex-col md:flex-row gap-[1px] bg-[#E8E4DC] rounded-t-[12px] overflow-hidden border-x border-t border-[#E8E4DC]">
      {NATIONAL_STATS.map((stat, idx) => (
        <StatCard key={idx} label={stat.label} value={stat.value} shouldStart={inView} />
      ))}
    </div>
  );
};

export default NationalStatsStrip;
