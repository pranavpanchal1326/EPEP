import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

const EVMHeader = () => {
  return (
    <header className="px-6 py-12 md:py-16 text-center max-w-[1280px] mx-auto">
      <nav className="mb-4 font-body text-[13px] flex items-center justify-center gap-2">
        <Link to="/" className="text-[#2D5A3D] hover:underline decoration-1 underline-offset-4 transition-all">Home</Link>
        <span className="text-[#E8E4DC]">/</span>
        <span className="text-[#6B6560]">EVM Simulator</span>
      </nav>

      <span className="block font-body text-[11px] font-bold tracking-[0.12em] uppercase text-[#2D5A3D] mb-2">
        INTERACTIVE SIMULATION
      </span>

      <h1 className="font-display text-[28px] md:text-[42px] font-bold text-[#1A1814] mb-3 leading-tight">
        Electronic Voting Machine
      </h1>

      <p className="font-body text-base text-[#6B6560] max-w-[560px] mx-auto mb-5 leading-relaxed">
        Experience the complete voting process used in India's elections. Select your constituency, 
        cast your vote, and watch the VVPAT paper trail — exactly as 96.8 crore voters do.
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EBF2ED] border border-[#2D5A3D40] rounded-full text-[#2D5A3D]">
        <Info size={12} aria-hidden="true" />
        <span className="font-body text-[12px]">
          Simulation only — not connected to actual ECI systems
        </span>
      </div>
    </header>
  );
};

export default EVMHeader;
