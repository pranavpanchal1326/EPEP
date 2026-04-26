import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Info } from 'lucide-react';
import { FADE_UP } from '../../lib/motionVariants';

const WomenChart = ({ data, isLoading, error, className = '' }) => {
  return (
    <motion.section variants={FADE_UP} initial="initial" whileInView="whileInView" viewport={{ once: true }} className={"bg-white rounded-2xl border border-[#E8E4DC] p-6 shadow-sm " + className}>
      <div className="mb-6">
        <h3 className="font-display text-2xl text-text-primary">Women in Indian Elections</h3>
        <p className="text-text-secondary text-sm">Candidates contested vs seats won · 1977—2024</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data || []} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4DC" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
            <Tooltip />
            <Bar yAxisId="left" dataKey="candidates" fill="#8B5CF6" radius={[4, 4, 0, 0]} animationDuration={800} />
            <Bar yAxisId="left" dataKey="winners" fill="#2D5A3D" radius={[4, 4, 0, 0]} animationDuration={1000} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};
export default WomenChart;