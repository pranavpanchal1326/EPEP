import React, { useState, useMemo, useEffect, useRef } from 'react';
import CategoryFilter, { ELECTION_CATEGORIES } from './CategoryFilter';
import QASearch from './QASearch';
import ElectionTimeline from './ElectionTimeline';
import ELECTION_QA from '../../data/election-qa.js';

const EducationHub = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [filterStuck, setFilterStuck] = useState(false);
  const heroRef = useRef(null);

  const categoryCounts = useMemo(() => {
    return ELECTION_CATEGORIES.reduce((acc, cat) => {
      acc[cat.dataKey] = ELECTION_QA.filter(qa => qa.category === cat.dataKey).length;
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setFilterStuck(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCategoryChange = (dataKey) => {
    setActiveCategory(dataKey);
    if (dataKey) {
      setTimeout(() => {
        document.getElementById('qa-search-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div id="main-content" className="bg-[var(--color-bg)] min-h-screen">
      <section ref={heroRef} className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-10 md:pb-16">
        <div className="max-w-3xl">
          <h1 className="font-['Playfair_Display'] text-[36px] md:text-[48px] font-bold text-[var(--color-text-primary)] leading-tight mb-6">Election Education Hub</h1>
          <p className="font-['DM_Sans'] text-[16px] md:text-[18px] text-[var(--color-text-secondary)] leading-relaxed mb-10 max-w-2xl">Everything you need to know about India's democratic process — sourced, accurate, and written for every citizen.</p>
          <div className="flex flex-wrap gap-4">
            {[{ label: 'Sourced Q&As', value: '150+', icon: 'HelpCircle' }, { label: 'Categories', value: '9', icon: 'Grid' }, { label: 'Election Types', value: '4', icon: 'Map' }].map((stat, i) => (
              <div key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)]"><span className="font-bold">{stat.value}</span></div>
                <span className="text-[13px] font-semibold text-[var(--color-text-secondary)]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={`sticky top-[72px] z-40 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)] transition-all duration-300 ${filterStuck ? 'shadow-md py-4' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} categoryCounts={categoryCounts} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col gap-20">
        <section id="qa-search-section" className="scroll-mt-32">
          <QASearch activeCategory={activeCategory} onCategorySelect={handleCategoryChange} />
        </section>

        <section aria-label="Election Process Timeline" className="pt-12 border-t border-[var(--color-border)]">
          <div className="mb-12">
            <h3 className="font-['Playfair_Display'] text-[32px] font-bold text-[var(--color-text-primary)] mb-4">Election Process Step-by-Step</h3>
            <p className="text-[var(--color-text-secondary)] max-w-2xl">Follow the journey of an election from notification to the declaration of results for all levels of Indian governance.</p>
          </div>
          <ElectionTimeline />
        </section>
      </main>
    </div>
  );
};
export default EducationHub;