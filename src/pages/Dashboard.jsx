import { useSEO } from '../hooks/useSEO';
import React, { useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Users2, Shield, ExternalLink, AlertCircle, Vote } from 'lucide-react';
import TurnoutChart from '../components/Dashboard/TurnoutChart';
import PartyChart from '../components/Dashboard/PartyChart';
import WomenChart from '../components/Dashboard/WomenChart';
import DashboardFilters from '../components/Dashboard/DashboardFilters';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import { useElectionData } from '../hooks/useElectionData';
import { useMediaQuery } from '../hooks/useMediaQuery';

const STATS = [
  { key: 'totalVoters', label: 'Voters (2024)', fallback: '96.8 Cr', icon: <Users className="w-4 h-4" /> },
  { key: 'totalElections', label: 'GE Since 1951', fallback: '18', icon: <Vote className="w-4 h-4" /> },
  { key: 'highestTurnout', label: 'Max Turnout', fallback: '67.4%', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'womenMPs', label: 'Women MPs', fallback: '74', icon: <Users2 className="w-4 h-4" /> },
];

const Dashboard = () => {
  useSEO({ title: 'Election Data Dashboard — 1951 to 2024 | EPEP', description: 'Historical Indian election data: turnout, party performance, and state analysis.' });
  const isMobile = useMediaQuery('(max-width: 639px)');
  const { turnoutData, isLoadingTurnout, turnoutError, partyData, isLoadingParty, partyError, womenData, isLoadingWomen, womenError, summaryStats, isLoadingSummary } = useElectionData();

  return (
    <div id="main-content" className="bg-bg-base min-h-screen">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-content mx-auto px-4 md:px-8 pt-10 pb-20">
        <header className="mb-10 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-accent" /><span className="text-[10px] font-bold uppercase tracking-widest text-accent">Data Intelligence</span></div>
           <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4">Election Analytics</h1>
           <p className="font-body text-text-secondary text-sm md:text-lg max-w-2xl leading-relaxed">Analyzing 18 general elections and trends that shaped the world's largest democracy.</p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map(stat => (
            <div key={stat.key} className="bg-surface border border-border-soft p-5 rounded-2xl shadow-sm hover:border-accent transition-all">
              <div className="w-8 h-8 bg-accent-light rounded-lg flex items-center justify-center text-accent mb-3">{stat.icon}</div>
              <div className="font-mono text-xl md:text-2xl font-bold text-text-primary mb-1">{summaryStats[stat.key] || stat.fallback}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-widest font-bold">{stat.label}</div>
            </div>
          ))}
        </section>

        <DashboardFilters />

        <div className="flex flex-col gap-12 mt-12">
          <ErrorBoundary fallback={<div className="p-10 border rounded-2xl text-center">Chart Error</div>}>
            <TurnoutChart data={turnoutData} isLoading={isLoadingTurnout} error={turnoutError} isMobile={isMobile} />
          </ErrorBoundary>
          <ErrorBoundary fallback={<div className="p-10 border rounded-2xl text-center">Chart Error</div>}>
            <PartyChart data={partyData} isLoading={isLoadingParty} error={partyError} isMobile={isMobile} />
          </ErrorBoundary>
          <ErrorBoundary fallback={<div className="p-10 border rounded-2xl text-center">Chart Error</div>}>
            <WomenChart data={womenData} isLoading={isLoadingWomen} error={womenError} isMobile={isMobile} />
          </ErrorBoundary>
        </div>
      </motion.div>
    </div>
  );
};
export default Dashboard;