import React from 'react';
import * as LucideIcons from 'lucide-react';

export const ELECTION_CATEGORIES = [
  { id: "voter-registration", label: "Voter Registration", dataKey: "Voter Registration", icon: "UserPlus", description: "EPIC card, Form 6, enrollment process" },
  { id: "nomination-process", label: "Nomination Process", dataKey: "Nomination Process", icon: "FileText", description: "Candidate filing, security deposit, nomination rules" },
  { id: "model-code-of-conduct", label: "Model Code of Conduct", dataKey: "Model Code of Conduct", icon: "Shield", description: "MCC rules, enforcement, election period restrictions" },
  { id: "voting-day", label: "Voting Day", dataKey: "Voting Day", icon: "Vote", description: "EVM, VVPAT, NOTA, polling station rules" },
  { id: "counting-results", label: "Counting & Results", dataKey: "Counting & Results", icon: "BarChart2", description: "Vote counting process, result declaration" },
  { id: "election-commission", label: "Election Commission", dataKey: "Election Commission", icon: "Building", description: "ECI powers, structure, independence" },
  { id: "political-parties", label: "Political Parties", dataKey: "Political Parties", icon: "Flag", description: "Party registration, symbols, recognition" },
  { id: "electoral-bonds", label: "Electoral Bonds", dataKey: "Electoral Bonds", icon: "Landmark", description: "Funding mechanism, SC ruling, current status" },
  { id: "reservation-constituencies", label: "Reservation & Constituencies", dataKey: "Reservation", icon: "Map", description: "SC/ST seats, delimitation, constituency boundaries" }
];

const CategoryPill = ({ category, isActive, count, onClick, index }) => {
  const IconComponent = LucideIcons[category.icon] || LucideIcons.Circle;
  const handleKeyDown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } };

  return (
    <div className="relative group" style={{ animation: 'pillFadeIn 300ms ease forwards', animationDelay: `calc(${index} * 40ms)`, opacity: 0 }}>
      <div
        role="button" tabIndex={0} aria-pressed={isActive} aria-label={isActive ? `${category.label}, selected. Click to deselect.` : `Filter by ${category.label}. ${count} questions.`}
        onClick={onClick} onKeyDown={handleKeyDown}
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-[12px] border transition-all duration-200 cursor-pointer ${isActive ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white shadow-[0_4px_16px_rgba(45,90,61,0.25)] -translate-y-[2px]' : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-light)]/40 hover:-translate-y-[1px]'}`}
      >
        <div className="flex items-center gap-3">
          <IconComponent size={16} className={isActive ? 'text-white' : 'text-[var(--color-accent)]'} />
          <span className="text-[14px] font-semibold">{category.label}</span>
        </div>
        <span className={`font-['JetBrains_Mono'] text-[11px] px-[7px] py-[2px] rounded-full border ${isActive ? 'bg-white/20 border-white/20 text-white' : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)]'}`}>
          {count || 0}
        </span>
      </div>
      <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="bg-[var(--color-text-primary)] text-white text-[12px] px-3 py-2 rounded-[8px] max-w-[200px] text-center shadow-xl relative">
          {category.description}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[var(--color-text-primary)]"></div>
        </div>
      </div>
    </div>
  );
};

const CategoryFilter = ({ activeCategory, onCategoryChange, categoryCounts }) => {
  const activeCatData = ELECTION_CATEGORIES.find(c => c.dataKey === activeCategory);
  const ActiveIcon = activeCatData ? LucideIcons[activeCatData.icon] : null;

  return (
    <nav className="w-full font-['DM_Sans']" aria-label="Filter election topics by category">
      <style>{`
        @keyframes pillFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bannerSlideDown { from { opacity: 0; transform: translateY(-8px); max-height: 0; } to { opacity: 1; transform: translateY(0); max-height: 80px; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="flex items-center justify-between mb-4">
        <label className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Browse by Topic</label>
        {activeCategory && (
          <button onClick={() => onCategoryChange(null)} className="text-[12px] font-bold text-[var(--color-accent)] hover:underline" aria-label="Clear category filter, show all topics">
            All Topics
          </button>
        )}
      </div>
      <div role="group" aria-label="Topic categories" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 no-scrollbar flex sm:grid">
        <div className="flex sm:contents gap-3">
          {ELECTION_CATEGORIES.map((cat, idx) => (
            <CategoryPill key={cat.id} category={cat} isActive={activeCategory === cat.dataKey} count={categoryCounts[cat.dataKey]} index={idx} onClick={() => onCategoryChange(activeCategory === cat.dataKey ? null : cat.dataKey)} />
          ))}
        </div>
      </div>
      {activeCategory && (
        <div className="mt-6 overflow-hidden animate-[bannerSlideDown_250ms_ease_forwards]">
          <div className="bg-[var(--color-accent-light)] border border-[var(--color-accent)] rounded-[12px] p-[14px_20px] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              {ActiveIcon && <ActiveIcon size={20} className="text-[var(--color-accent)]" />}
              <span className="text-[14px] font-bold text-[var(--color-accent)]">Showing: {activeCategory}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-['JetBrains_Mono'] text-[12px] text-[var(--color-accent)] font-semibold">{categoryCounts[activeCategory] || 0} Questions</span>
              <button onClick={() => onCategoryChange(null)} className="text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 p-1 rounded-full transition-colors" aria-label={`Remove filter: ${activeCategory}`}>
                <LucideIcons.X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CategoryFilter;