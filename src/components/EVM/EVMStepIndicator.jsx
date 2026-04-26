import { MapPin, Power, Vote, Receipt, CheckCircle } from 'lucide-react';

const VOTING_STEPS = [
  { id: 'select-constituency', label: 'Select Constituency', description: 'Choose your constituency to load candidates', icon: MapPin },
  { id: 'enable-voting', label: 'Enable Voting', description: 'Presiding Officer enables the Ballot Unit', icon: Power },
  { id: 'select-candidate', label: 'Cast Vote', description: 'Voter presses candidate button on Ballot Unit', icon: Vote },
  { id: 'vvpat-display', label: 'VVPAT Slip', description: 'Paper slip visible for 7 seconds', icon: Receipt },
  { id: 'result', label: 'Vote Recorded', description: 'Vote counted in Control Unit', icon: CheckCircle },
];

const EVMStepIndicator = ({ currentStep }) => {
  const currentIndex = VOTING_STEPS.findIndex(s => s.id === currentStep);
  const progressPercent = (currentIndex / (VOTING_STEPS.length - 1)) * 100;

  return (
    <div className="px-6 pt-8 pb-16 max-w-[1100px] mx-auto overflow-x-auto md:overflow-x-visible scrollbar-hide">
      <div className="min-w-[600px] md:min-w-0 relative flex justify-between items-start">
        {/* Background Track */}
        <div className="absolute top-[16px] left-[10%] right-[10%] h-[2px] bg-[#E8E4DC] z-0" />
        
        {/* Progress Fill */}
        <div 
          className="absolute top-[16px] left-[10%] h-[2px] bg-[#2D5A3D] transition-all duration-400 z-0"
          style={{ width: `${progressPercent * 0.8}%` }}
        />

        {VOTING_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative z-1 group">
              {/* Node Circle */}
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-[#2D5A3D] text-white' : isActive ? 'bg-white border-2 border-[#2D5A3D] text-[#2D5A3D]' : 'bg-white border-2 border-[#E8E4DC] text-[#6B6560]'}
                  ${isActive ? 'shadow-[0_0_0_4px_#EBF2ED] scale-110' : ''}
                `}
              >
                <Icon size={14} aria-hidden="true" />
              </div>

              {/* Step Label */}
              <span className={`
                mt-3 font-body text-[12px] md:text-[12px] font-medium text-center
                ${isActive || isCompleted ? 'text-[#1A1814]' : 'text-[#6B6560]'}
              `}>
                {step.label}
              </span>

              {/* Step Description (Desktop Only) */}
              {isActive && (
                <p className="hidden md:block mt-1 font-body text-[10px] text-[#6B6560] text-center max-w-[100px] animate-in fade-in slide-in-from-top-1 duration-200">
                  {step.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EVMStepIndicator;
