import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Info } from 'lucide-react';
import { FADE_UP } from '../../lib/motionVariants';

const DataSourceBadge = ({ source }) => {
  const colors = { live: 'bg-[#00C853] text-white', datagov: 'bg-[#2196F3] text-white', static: 'bg-[#6B6560] text-white' };
  return <span className={"text-[10px] font-mono px-2 py-0.5 rounded-full ml-3 " + (colors[source] || colors.static)}>Data: {source}</span>;
};

const TurnoutChart = ({ data, isLoading, error, className = '', isMobile }) => {
  if (isLoading) {
    return <div className="h-[300px] w-full flex items-center justify-center text-text-muted">Loading chart data...</div>;
  }
  
  if (error || !data) {
    return <div className="h-[300px] w-full flex items-center justify-center text-error"><AlertCircle size={24} className="mr-2" /> Failed to load data</div>;
  }

  const chartData = Array.isArray(data) ? data : data.data || [];
  const source = data.source || 'static';

  return (
    <motion.section variants={FADE_UP} initial="initial" whileInView="whileInView" viewport={{ once: true }} className={"bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm " + className}>
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div>
          <h3 className="font-display text-2xl text-text-primary flex items-center">
            Voter Turnout <DataSourceBadge source={source} />
          </h3>
          <p className="text-text-secondary text-sm mt-1">General Elections · 1951—2024</p>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: -20, top: 10 }}>
            <defs>
              <linearGradient id="colorTurnout" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D5A3D" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2D5A3D" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4DC" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fontFamily: 'JetBrains Mono', fill: '#6B6560' }} stroke="#E8E4DC" />
            <YAxis tick={{ fontSize: 12, fontFamily: 'JetBrains Mono', fill: '#6B6560' }} stroke="#E8E4DC" domain={[40, 75]} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E8E4DC', fontFamily: 'DM Sans', fontSize: '14px', fontWeight: 600 }} />
            <Area type="monotone" dataKey="turnout" stroke="#2D5A3D" strokeWidth={3} fillOpacity={1} fill="url(#colorTurnout)" animationDuration={800} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};

export default TurnoutChart;