import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search as SearchIcon, XCircle, ExternalLink, ChevronRight } from 'lucide-react';
import ELECTION_QA from '../../data/election-qa.js';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const normalize = (str) => str ? str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '') : '';
const tokenize = (str) => normalize(str).split(/\s+/).filter(Boolean);
const truncateAnswer = (answer, maxChars = 80) => answer.length <= maxChars ? answer : answer.substring(0, maxChars).trim() + '...';

const highlightText = (text, tokens) => {
  if (!tokens || tokens.length === 0 || !text) return text;
  const pattern = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  return text.split(regex).map((part, i) => regex.test(part) ? <mark key={i} className="bg-accent-light text-accent rounded-[3px] px-[2px] font-semibold">{part}</mark> : part);
};

const QAResultCard = ({ qa, query, tokens, index, isExpanded, onToggle, onCategorySelect, isMobile }) => {
  return (
    <div role="listitem" className="w-full">
      <div className={`bg-surface border rounded-[16px] transition-all duration-200 overflow-hidden ${isExpanded ? 'border-accent shadow-md' : 'border-border-soft shadow-sm'}`}>
        <div role="button" tabIndex={0} onClick={onToggle} className="p-5 cursor-pointer focus:outline-none outline-accent outline-offset-2">
          <div className="flex justify-between items-start gap-4 mb-2">
            <button onClick={(e) => { e.stopPropagation(); onCategorySelect(qa.category); }} className="bg-accent-light text-accent border border-accent/20 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{qa.category}</button>
            <ChevronRight size={18} className={`text-text-muted transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
          <h4 className="text-base font-bold text-text-primary mb-2 leading-snug">{highlightText(qa.question, tokens)}</h4>  
          {!isExpanded && <p className="text-sm text-text-secondary">{truncateAnswer(qa.answer, isMobile ? 60 : 100)}</p>}
        </div>
        {isExpanded && (
          <div className="px-5 pb-5 border-t border-border-soft pt-4">
            <p className="text-base text-text-primary leading-relaxed mb-4">{highlightText(qa.answer, tokens)}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {qa.tags.map((tag, i) => <span key={i} className="bg-bg-base border border-border-soft rounded-full px-2 py-0.5 text-[11px] text-text-muted">#{tag}</span>)}
            </div>
            <a href={qa.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-accent hover:underline">
              Source: {qa.source} <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const QASearch = ({ activeCategory, onCategorySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const inputRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 639px)');

  const tokens = useMemo(() => tokenize(query), [query]);

  const performSearch = (val) => {
    const searchTokens = tokenize(val);
    let scored = (ELECTION_QA || []).map(entry => {
      let score = 0; const nQ = normalize(entry.question); const nA = normalize(entry.answer);
      if (val) {
        if (nQ.includes(normalize(val))) score += 100;
        searchTokens.forEach(t => { if (nQ.includes(t)) score += 30; if (nA.includes(t)) score += 10; });
      }
      if (activeCategory && entry.category === activeCategory) score += 20;
      return { ...entry, totalScore: score };
    });
    if (val) scored = scored.filter(e => e.totalScore > 0);
    else if (activeCategory) scored = scored.filter(e => e.category === activeCategory);
    else scored = scored.slice(0, 6);
    scored.sort((a, b) => b.totalScore - a.totalScore);
    setResults(scored.slice(0, 8));
  };

  useEffect(() => performSearch(query), [activeCategory, query]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <header className="text-center md:text-left mb-8">
        <h3 className="font-display text-2xl md:text-4xl text-text-primary mb-2">Frequently Asked Questions</h3>       
        <p className="text-text-secondary text-sm md:text-base">Quick, sourced answers for every part of the voting process.</p>
      </header>
      <div className="relative mb-8">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Try 'NOTA', 'EVM', 'Registration'..."
          className="w-full h-14 pl-12 pr-12 bg-surface border border-border-soft rounded-2xl text-base focus:border-accent transition-all outline-none"
        />
        {query && <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted touch-target"><XCircle size={20} /></button>}
      </div>
      <div role="list" className="flex flex-col gap-4">
        {results.map((qa, index) => <QAResultCard key={qa.id} qa={qa} query={query} tokens={tokens} index={index} isExpanded={expandedId === qa.id} onToggle={() => setExpandedId(expandedId === qa.id ? null : qa.id)} onCategorySelect={onCategorySelect} isMobile={isMobile} />)}
      </div>
    </div>
  );
};
export default QASearch;