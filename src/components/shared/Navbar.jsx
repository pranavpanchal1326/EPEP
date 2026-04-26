import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Vote, Map, BookOpen, BarChart2, Menu, X, HelpCircle } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { BUTTON_PRESS } from '../../lib/motionVariants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { scrollY } = useScroll();

  const height = useTransform(scrollY, [0, 60], [isDesktop ? 80 : 64, isDesktop ? 64 : 56]);
  const background = useTransform(scrollY, [0, 60], ["rgba(248, 247, 244, 0)", "rgba(255, 255, 255, 0.9)"]);
  const blur = useTransform(scrollY, [0, 60], ["blur(0px)", "blur(12px)"]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const links = [
    { to: '/', label: 'Home', icon: null },
    { to: '/map', label: 'Map', icon: Map },
    { to: '/learn', label: 'Education', icon: BookOpen },
    { to: '/evm', label: 'EVM', icon: Vote },
    { to: '/dashboard', label: 'Dashboard', icon: BarChart2 },
  ];

  return (
    <motion.nav 
      style={{ height, background, backdropFilter: blur }}
      className="fixed top-0 left-0 right-0 z-[1000] border-b border-border-soft flex items-center px-4 md:px-8 safe-top"
    >
      <div className="max-w-content mx-auto w-full flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <Vote size={isDesktop ? 28 : 24} className="text-accent" />
          <span className="font-display text-xl md:text-2xl font-bold">EPEP</span>
        </NavLink>

        {isDesktop ? (
          <div className="flex items-center gap-8">
            {links.map(l => (
              <NavLink key={l.to} to={l.to} className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-accent' : 'text-text-secondary hover:text-accent'}`}>
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/quiz">
              <motion.button variants={BUTTON_PRESS} whileHover={{ translateY: -1 }} className="bg-accent text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm">Start Quiz</motion.button>
            </NavLink>
          </div>
        ) : (
          <button onClick={() => setIsOpen(true)} className="p-2 -mr-2 touch-target" aria-label="Open menu"><Menu size={24} /></button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed inset-0 z-[1001] bg-bg-base flex flex-col p-6">
            <div className="flex justify-between items-center mb-12">
               <span className="font-display text-2xl font-bold">Menu</span>
               <button onClick={() => setIsOpen(false)} className="p-2 touch-target" aria-label="Close menu"><X size={28} /></button>
            </div>
            <div className="flex flex-col gap-2">
              {links.map(l => (
                <NavLink key={l.to} to={l.to} className={({isActive}) => `flex items-center h-16 border-b border-border-soft text-xl font-semibold ${isActive ? 'text-accent border-l-4 border-l-accent pl-4' : 'text-text-primary'}`}>
                  {l.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-auto pb-safe">
              <NavLink to="/quiz">
                <button className="w-full bg-accent text-white py-4 rounded-xl text-lg font-bold shadow-lg flex items-center justify-center gap-3">
                  <HelpCircle size={20} /> Take the Quiz
                </button>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
export default Navbar;