import React from 'react'; import { motion } from 'framer-motion'; import { User, Sparkles } from 'lucide-react';
import PropTypes from 'prop-types';
const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-[var(--color-accent)] text-white' : 'bg-[var(--color-accent-light)] text-[var(--color-accent)]'}`}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>
        <div className="flex flex-col">
          <div className={`p-4 rounded-[16px] text-sm font-['DM_Sans'] leading-relaxed shadow-sm ${isUser ? 'bg-[var(--color-accent)] text-white rounded-br-[4px]' : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-bl-[4px] border-l-4 border-l-[var(--color-accent)]'}`}>
            {message.content}
          </div>
          {!isUser && (
            <div className="mt-1 flex flex-col gap-0.5">
              {message.source && <span className="text-[10px] font-['JetBrains_Mono'] text-[var(--color-text-secondary)]">Source: {message.source}</span>}
              {message.model && <span className="text-[9px] font-['DM_Sans'] text-[var(--color-text-secondary)] opacity-60 uppercase tracking-tighter">via {message.model}</span>}
            </div>
          )}
          <span className={`text-[9px] text-[var(--color-text-secondary)] opacity-50 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </motion.div>
  );
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    source: PropTypes.string,
    model: PropTypes.string,
    isLoading: PropTypes.bool,
  }).isRequired,
};

export default MessageBubble;