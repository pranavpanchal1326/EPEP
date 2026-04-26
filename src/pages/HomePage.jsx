import { useSEO } from '../hooks/useSEO';
import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Vote, Shield, Info, BarChart2 } from 'lucide-react';
import { useMotionConfig } from '../hooks/useMotionConfig';
import { STAGGER_CONTAINER, STAGGER_ITEM, BUTTON_PRESS, FADE_UP } from '../lib/motionVariants';
import NumberReveal from '../components/shared/NumberReveal';

const HomePage = () => {
  useSEO({ title: 'EPEP — India Election Process Education Platform', description: 'Understand India\'s election process with interactive maps, EVM simulator, and real data.' });
  const { disableTranslation } = useMotionConfig();
  return (
    <main className="w-full">
      <section className="relative min-height: 100dvh flex items-center justify-center overflow-hidden bg-bg-base px-6 py-20">
        <div className="absolute inset-0 z-0 opacity-10 md:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] rounded-full bg-accent blur-[80px] md:blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] rounded-full bg-accent blur-[80px] md:blur-[120px]" />
        </div>

        <motion.div variants={STAGGER_CONTAINER} initial="initial" animate="animate" className="max-w-text w-full text-center relative z-10">
          <motion.h1
            variants={STAGGER_ITEM}
            className="font-display text-3xl md:text-5xl lg:text-[72px] text-text-primary leading-tight mb-6"
            animate={{ filter: ["blur(4px)", "blur(0px)"], opacity: [0, 1], y: [20, 0] }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            Empowering Every Citizen for <span className="text-accent italic">India's Democracy</span>
          </motion.h1>

          <motion.p variants={STAGGER_ITEM} className="font-body text-base md:text-xl lg:text-2xl text-text-secondary mb-10 max-w-[600px] mx-auto leading-relaxed" transition={{ delay: 0.22 }}>
            The comprehensive platform for Indian electoral education, data visualization, and simulated voting.
          </motion.p>

          <motion.div variants={STAGGER_ITEM} className="flex flex-col sm:flex-row gap-4 justify-center" transition={{ delay: 0.34 }}>
            <NavLink to="/map">
              <motion.button variants={BUTTON_PRESS} className="w-full sm:w-auto bg-accent text-white px-8 py-4 rounded-xl font-body font-bold text-base md:text-lg shadow-lg">
                Explore Election Map
              </motion.button>
            </NavLink>
            <NavLink to="/evm">
              <motion.button variants={BUTTON_PRESS} className="w-full sm:w-auto bg-transparent border-2 border-accent text-accent px-8 py-4 rounded-xl font-body font-bold text-base md:text-lg hover:bg-accent-light transition-colors">
                Try EVM Simulator
              </motion.button>
            </NavLink>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-surface border-y border-border-soft py-12 md:py-16 px-6">
        <div className="max-w-content mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { label: "Voters in 2024", value: 968000000, format: "indian" },
            { label: "Lok Sabha Seats", value: 543, format: "standard" },
            { label: "Polling Stations", value: 1050000, format: "indian" },
            { label: "Candidates", value: 8360, format: "standard" }
          ].map((stat, i) => (
            <motion.div key={i} variants={FADE_UP} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="text-center">
              <div className="text-xl md:text-3xl lg:text-4xl text-accent font-bold mb-1"><NumberReveal value={stat.value} format={stat.format} /></div>
              <div className="text-[10px] md:text-xs text-text-secondary uppercase tracking-widest font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-30 px-6 max-w-content mx-auto">
        <motion.div variants={STAGGER_CONTAINER} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: <Shield className="text-accent" />, title: "Verified Sources", desc: "All data and facts are verified against ECI, TCPD, and Constitutional records." },
            { icon: <Info className="text-accent" />, title: "Step-by-Step Guide", desc: "Learn exactly how the Indian election process works from nomination to results." },
            { icon: <BarChart2 className="text-accent" />, title: "Historical Trends", desc: "Analyze turnout and party performance trends from 1952 to 2024." }
          ].map((f, i) => (
            <motion.div key={i} variants={STAGGER_ITEM} className="p-6 md:p-8 rounded-2xl border border-border-soft bg-surface hover:shadow-card transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-accent-light rounded-xl flex items-center justify-center mb-6">{f.icon}</div>
              <h3 className="font-display text-lg md:text-xl lg:text-2xl text-text-primary mb-3 md:mb-4">{f.title}</h3>
              <p className="font-body text-sm md:text-base text-text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
};
export default HomePage;