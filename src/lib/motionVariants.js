
export const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 24 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } 
  },
  exit: { 
    opacity: 0, 
    y: -12, 
    transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] } 
  }
};

export const STAGGER_CONTAINER = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' }
  }
};

export const CARD_HOVER = {
  whileHover: { 
    y: -2, 
    borderColor: '#2D5A3D',
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
  whileTap: { scale: 0.98 }
};

export const BUTTON_PRESS = {
  whileTap: { scale: 0.97 },
  animate: {
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 20 }
  }
};

export const FADE_UP = {
  initial: { opacity: 0, y: 30 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  viewport: { once: true, margin: "-80px" }
};

export const FADE_IN_SCALE = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    scale: 0.96,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
};

export const SLIDE_UP_DRAWER = {
  initial: { y: "100%" },
  animate: { 
    y: "0%",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } 
  },
  exit: { 
    y: "100%",
    transition: { duration: 0.25, ease: 'easeIn' }
  }
};

export const EVM_BUTTON_PRESS = {
  initial: { scale: 1, y: 0, boxShadow: '0 4px 0 rgba(0,0,0,0.2)' },
  whileTap: { 
    scale: 0.92, 
    y: 2, 
    boxShadow: '0 0px 0 rgba(0,0,0,0)',
    transition: { duration: 0.08 }
  },
  animate: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
    transition: { type: 'spring', stiffness: 500, damping: 20 }
  }
};
