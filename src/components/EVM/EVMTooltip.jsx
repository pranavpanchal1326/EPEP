import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EVM_TOOLTIP_CONTENT } from '../../data/evm-education';

const EVMTooltip = ({ id, children, position = 'top', onLearnMore, disabled = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimer = useRef(null);
  const content = EVM_TOOLTIP_CONTENT[id];

  const showTooltip = () => {
    if (disabled) return;
    clearTimeout(hideTimer.current);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    hideTimer.current = setTimeout(() => setIsVisible(false), 150);
  };

  const handleTouch = () => {
    if (disabled) return;
    setIsVisible(prev => !prev);
  };

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setIsVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  if (!content) return children;

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-[#1A1814] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-[#1A1814] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-[#1A1814] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-[#1A1814] border-y-transparent border-l-transparent'
  };

  return (
    <div 
      className="relative inline-block w-full h-full"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onTouchStart={handleTouch}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsVisible(!isVisible)}
      aria-describedby={`tooltip-${id}`}
    >
      {children}
      
      <div 
        id={`tooltip-${id}`}
        role="tooltip"
        className={`
          absolute z-50 min-w-[220px] max-w-[280px] bg-[#1A1814] border border-white/12 rounded-xl p-3.5 shadow-2xl transition-all duration-150
          ${positionStyles[position]}
          ${isVisible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'}
        `}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        <div className={`absolute w-0 h-0 border-[5px] ${arrowStyles[position]}`} />
        
        <p className="font-sans text-[12px] leading-relaxed text-white/80 mb-2">
          {content.short}
        </p>
        
        {onLearnMore && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
              onLearnMore(content.learnMoreId);
            }}
            className="font-sans text-[11px] font-bold text-[#4CAF50] hover:text-[#81C784] hover:underline flex items-center gap-1 transition-colors"
          >
            Learn More →
          </button>
        )}
      </div>
    </div>
  );
};

EVMTooltip.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  onLearnMore: PropTypes.func,
  disabled: PropTypes.bool,
};

export default EVMTooltip;
