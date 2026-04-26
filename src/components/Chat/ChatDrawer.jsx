import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useAIChat } from '../../hooks/useAIChat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { SLIDE_UP_DRAWER, BUTTON_PRESS } from '../../lib/motionVariants';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const ChatDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [vpHeight, setVpHeight] = useState('92dvh');
  const { messages, isLoading, sendMessage, clearChat } = useAIChat();
  const messagesEndRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    if (!window.visualViewport || !isMobile) return;
    const handleResize = () => {
      const height = window.visualViewport.height;
      setVpHeight(`${height}px`);
    };
    window.visualViewport.addEventListener('resize', handleResize);
    return () => window.visualViewport.removeEventListener('resize', handleResize);
  }, [isMobile]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  return (
    <div className="fixed bottom-6 right-6 z-[2000] font-['DM_Sans']">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="trigger" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            variants={BUTTON_PRESS} whileHover={{ scale: 1.1 }} onClick={() => setIsOpen(true)}
            className="bg-accent text-white p-4 rounded-full shadow-2xl flex items-center gap-2 safe-bottom"
            style={{ bottom: 'max(24px, env(safe-area-inset-bottom) + 8px)' }}
          >
            <MessageCircle size={24} /> <span className="font-bold text-sm pr-2">Election AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[1999]" onClick={() => setIsOpen(false)} />
            <motion.div
              drag={isMobile ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, { offset, velocity }) => { if (isMobile && (offset.y > 150 || velocity.y > 400)) setIsOpen(false); }}
              variants={SLIDE_UP_DRAWER} initial="initial" animate="animate" exit="exit"
              className={`bg-bg-base border border-border-soft shadow-2xl fixed z-[2000] overflow-hidden flex flex-col ${
                isMobile ? 'bottom-0 left-0 right-0 rounded-t-[24px]' : 'bottom-6 right-6 w-[400px] h-[580px] rounded-[24px]'
              }`}
              style={isMobile ? { height: vpHeight } : {}}
            >
              {isMobile && <div className="w-full flex justify-center py-3 flex-shrink-0"><div className="w-10 h-1.5 rounded-full bg-border-soft" /></div>}
              <header className="bg-surface border-b border-border-soft p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white shadow-sm"><Sparkles size={20} /></div>
                  <h3 className="font-display font-bold text-text-primary text-lg">AI Assistant</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-text-muted hover:bg-bg-base rounded-full touch-target"><X size={24} /></button>
              </header>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-white/50">
                {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
              <footer className="p-4 bg-surface border-t border-border-soft safe-bottom">
                <div className="flex gap-2 items-end">
                  <textarea 
                    value={inputValue} onChange={(e) => setInputValue(e.target.value)} 
                    placeholder="Ask about elections..." 
                    className="flex-1 p-4 bg-bg-base border border-border-soft rounded-2xl text-base focus:border-accent transition-all outline-none resize-none"
                    rows="1"
                    style={{ fontSize: '16px' }}
                  />
                  <button onClick={() => { if(inputValue.trim()) { sendMessage(inputValue); setInputValue(''); } }} className="bg-accent text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-all"><Send size={20} /></button>
                </div>
              </footer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ChatDrawer;