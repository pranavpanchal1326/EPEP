/**
 * @fileoverview Party Performance Chart — EPEP Dashboard
 * @module PartyChart
 *
 * Displays Lok Sabha seats won per party over time using a
 * responsive BarChart. Supports grouped and stacked views.
 *
 * @param {Object} props
 * @param {Array} props.data - Dataset containing party-wise seat counts
 * @param {boolean} [props.isLoading] - Loading state
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import { AlertCircle, BarChart2, Layers } from 'lucide-react';
import PropTypes from 'prop-types';
import { FADE_UP, STAGGER_CONTAINER, STAGGER_ITEM } from '../../lib/motionVariants';
import { LOK_SABHA_SEATS } from '../../data/constants';

const TRACKED_PARTIES = [
  { key: 'INC',  label: 'Indian National Congress', color: '#1E7BC4' },
  { key: 'BJP',  label: 'Bharatiya Janata Party',   color: '#FF6B00' },
  { key: 'JD',   label: 'Janata Dal/Janata Party',  color: '#8B5CF6' },
  { key: 'OTH',  label: 'Others/Independents',       color: '#9CA3AF' },
];

const PartyChart = ({ data, isLoading, error, className = '' }) => {
  const [chartMode, setChartMode] = useState('grouped');
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  return (
    <motion.section ref={ref} variants={FADE_UP} initial="initial" whileInView="whileInView" viewport={{ once: true }} className={"bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm " + className}>
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div><h3 className="font-display text-2xl text-text-primary">Party Performance</h3><p className="text-text-secondary text-sm">Lok Sabha seats won per party · 1951—2024</p></div>
        <div className="flex gap-2 bg-accent-light p-1 rounded-lg self-start">
          <button onClick={() => setChartMode('grouped')} className={"px-4 py-1.5 rounded-md text-xs font-bold transition-all " + (chartMode === 'grouped' ? 'bg-accent text-white' : 'text-accent')}>Grouped</button>
          <button onClick={() => setChartMode('stacked')} className={"px-4 py-1.5 rounded-md text-xs font-bold transition-all " + (chartMode === 'stacked' ? 'bg-accent text-white' : 'text-accent')}>Stacked</button>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4DC" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fontFamily: 'JetBrains Mono' }} />
            <YAxis tick={{ fontSize: 12, fontFamily: 'JetBrains Mono' }} domain={[0, LOK_SABHA_SEATS]} />
            <Tooltip />
            {TRACKED_PARTIES.map(p => (<Bar key={p.key} dataKey={p.key} fill={p.color} stackId={chartMode === 'stacked' ? 'a' : undefined} animationDuration={800} />))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};

PartyChart.propTypes = {
  data:      PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
}

PartyChart.defaultProps = {
  isLoading: false,
}

export default PartyChart;
