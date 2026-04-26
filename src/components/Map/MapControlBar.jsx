import { useState } from 'react';

const ComingSoonTooltip = ({ children, text = "Coming Soon" }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-[#1A1814] text-[#F8F7F4] text-[11px] font-body rounded-md whitespace-nowrap z-[2000]">
          {text}
        </div>
      )}
    </div>
  );
};

const MapControlBar = ({ activeType, onElectionTypeChange, mapRef }) => {
  const electionTypes = [
    { id: 'lok-sabha', label: 'Lok Sabha' },
    { id: 'rajya-sabha', label: 'Rajya Sabha', disabled: true },
    { id: 'state', label: 'State', disabled: true },
    { id: 'local', label: 'Local', disabled: true },
  ];

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleReset = () => mapRef.current?.setView([20.5937, 78.9629], 5);

  return (
    <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 bg-white/92 backdrop-blur-md border border-[#E8E4DC] rounded-[10px] p-1.5 shadow-card">
      {/* Election Type Tabs */}
      <div className="flex items-center gap-1">
        {electionTypes.map((type) => {
          const isActive = activeType === type.id;
          const button = (
            <button
              key={type.id}
              onClick={() => !type.disabled && onElectionTypeChange(type.id)}
              className={`px-2.5 py-1 text-[13px] font-500 transition-all duration-150 rounded-[6px] ${
                isActive 
                  ? 'bg-[#EBF2ED] text-[#2D5A3D]' 
                  : 'bg-transparent text-[#6B6560] hover:text-[#1A1814]'
              } ${type.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              {type.label} {isActive && '▾'}
            </button>
          );

          return type.disabled ? (
            <ComingSoonTooltip key={type.id}>{button}</ComingSoonTooltip>
          ) : (
            button
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-[1px] h-5 bg-[#E8E4DC] mx-1" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <button 
          onClick={handleZoomIn}
          className="w-6 h-6 flex items-center justify-center bg-white border border-[#E8E4DC] rounded-md text-[14px] text-[#1A1814] hover:bg-[#EBF2ED] hover:text-[#2D5A3D] transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-6 h-6 flex items-center justify-center bg-white border border-[#E8E4DC] rounded-md text-[14px] text-[#1A1814] hover:bg-[#EBF2ED] hover:text-[#2D5A3D] transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <button 
          onClick={handleReset}
          className="px-2 h-6 flex items-center justify-center bg-white border border-[#E8E4DC] rounded-md text-[12px] text-[#1A1814] hover:bg-[#EBF2ED] hover:text-[#2D5A3D] transition-colors font-body font-500"
          title="Reset Map"
        >
          ⊡ Reset
        </button>
      </div>
    </div>
  );
};

export default MapControlBar;
