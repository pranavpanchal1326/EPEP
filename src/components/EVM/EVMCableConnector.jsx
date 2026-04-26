const EVMCableConnector = () => {
  return (
    <>
      {/* Desktop Connector */}
      <div className="hidden md:flex items-center w-[60px] h-[32px] relative">
        {/* Connector Plug Left */}
        <div className="w-2 h-4 bg-[#3A3630] rounded-[2px]" />
        
        {/* Cable Body */}
        <div className="flex-1 h-[6px] bg-[#2A2620] border-y border-[#3A3630]" />
        
        {/* Center Box */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-2.5 bg-[#2A2620] border border-[#4A4440]" />
        
        {/* Connector Plug Right */}
        <div className="w-2 h-4 bg-[#3A3630] rounded-[2px]" />
      </div>

      {/* Mobile Connector */}
      <div className="flex md:hidden flex-col items-center gap-1.5 py-4 w-full">
        <div 
          className="w-[2px] h-6"
          style={{ 
            background: 'repeating-linear-gradient(to bottom, #3A3630 0, #3A3630 4px, transparent 4px, transparent 8px)' 
          }}
        />
        <span className="font-body text-[9px] text-[#3A3630] uppercase tracking-[0.08em]">
          connected
        </span>
      </div>
    </>
  );
};

export default EVMCableConnector;
