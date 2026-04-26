// ============================================================
// EPEP — DashboardFilters.jsx
// Phase 6.4 | Global Dashboard Filters
// Sticky Filter Bar | Election Type | State | Party | Period
// ============================================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, X, Search, Database, ExternalLink, Filter } from 'lucide-react';
import { useAppStore, selectors } from '../../store';

// ── 1. CONSTANTS ──────────────────────────────────────────────────

const ELECTION_TYPES = [
  { key: 'lok_sabha',   label: 'Lok Sabha' },
  { key: 'state',       label: 'State Assembly' },
  { key: 'rajya_sabha', label: 'Rajya Sabha' },
  { key: 'local',       label: 'Local Body' },
];

const INDIA_STATES = [
  { slug: 'all',                  label: 'All India' },
  { slug: 'andhra_pradesh',       label: 'Andhra Pradesh' },
  { slug: 'arunachal_pradesh',    label: 'Arunachal Pradesh' },
  { slug: 'assam',                label: 'Assam' },
  { slug: 'bihar',                label: 'Bihar' },
  { slug: 'chhattisgarh',         label: 'Chhattisgarh' },
  { slug: 'goa',                  label: 'Goa' },
  { slug: 'gujarat',              label: 'Gujarat' },
  { slug: 'haryana',              label: 'Haryana' },
  { slug: 'himachal_pradesh',     label: 'Himachal Pradesh' },
  { slug: 'jharkhand',            label: 'Jharkhand' },
  { slug: 'karnataka',            label: 'Karnataka' },
  { slug: 'kerala',               label: 'Kerala' },
  { slug: 'madhya_pradesh',       label: 'Madhya Pradesh' },
  { slug: 'maharashtra',          label: 'Maharashtra' },
  { slug: 'manipur',              label: 'Manipur' },
  { slug: 'meghalaya',            label: 'Meghalaya' },
  { slug: 'mizoram',              label: 'Mizoram' },
  { slug: 'nagaland',             label: 'Nagaland' },
  { slug: 'odisha',               label: 'Odisha' },
  { slug: 'punjab',               label: 'Punjab' },
  { slug: 'rajasthan',            label: 'Rajasthan' },
  { slug: 'sikkim',               label: 'Sikkim' },
  { slug: 'tamil_nadu',           label: 'Tamil Nadu' },
  { slug: 'telangana',            label: 'Telangana' },
  { slug: 'tripura',              label: 'Tripura' },
  { slug: 'uttar_pradesh',        label: 'Uttar Pradesh' },
  { slug: 'uttarakhand',          label: 'Uttarakhand' },
  { slug: 'west_bengal',          label: 'West Bengal' },
  { slug: 'delhi',                label: 'Delhi (NCT)' },
  { slug: 'jammu_kashmir',        label: 'Jammu & Kashmir' },
  { slug: 'ladakh',               label: 'Ladakh' },
  { slug: 'puducherry',           label: 'Puducherry' },
  { slug: 'chandigarh',           label: 'Chandigarh' },
  { slug: 'andaman_nicobar',      label: 'Andaman & Nicobar' },
  { slug: 'dadra_haveli',         label: 'Dadra & Nagar Haveli' },
  { slug: 'daman_diu',            label: 'Daman & Diu' },
  { slug: 'lakshadweep',          label: 'Lakshadweep' },
];

const TRACKED_PARTIES = [
  { key: 'INC',  label: 'Congress', color: '#1E7BC4' },
  { key: 'BJP',  label: 'BJP',      color: '#FF6B00' },
  { key: 'JD',   label: 'Janata Dal', color: '#8B5CF6' },
  { key: 'CPM',  label: 'CPI(M)',    color: '#DC2626' },
  { key: 'SP',   label: 'Samajwadi', color: '#D97706' },
  { key: 'BSP',  label: 'BSP',       color: '#059669' },
  { key: 'TMC',  label: 'Trinamool', color: '#0EA5E9' },
  { key: 'OTH',  label: 'Others',    color: '#9CA3AF' },
];

// ── 2. DROPBOWN COMPONENTS ─────────────────────────────────────────

const StateDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const selectedState = INDIA_STATES.find(s => s.slug === value);
  const filteredStates = INDIA_STATES.filter(s => 
    s.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[11px] font-semibold text-[#6B6560] uppercase tracking-wider mb-1">State</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[160px] bg-white border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm font-medium text-[#1A1814] hover:border-[#2D5A3D] transition-all"
      >
        <span className="truncate">{selectedState?.label || 'Select State'}</span>
        <ChevronDown className={`w-4 h-4 text-[#6B6560] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[220px] bg-white border border-[#E8E4DC] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] z-[60] overflow-hidden">
          <div className="p-2 border-b border-[#E8E4DC]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B6560]" />
              <input
                autoFocus
                placeholder="Search state..."
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-[#F8F7F4] border-none rounded-md focus:ring-1 focus:ring-[#2D5A3D] outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ul className="max-h-[240px] overflow-y-auto py-1 custom-scrollbar">
            {filteredStates.map(state => (
              <li key={state.slug}>
                <button
                  onClick={() => { onChange(state.slug); setIsOpen(false); setSearch(''); }}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-[#1A1814] hover:bg-[#EBF2ED] transition-colors"
                >
                  <span>{state.label}</span>
                  {value === state.slug && <Check className="w-4 h-4 text-[#2D5A3D]" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const PartyMultiSelect = ({ value = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const toggleParty = (key) => {
    const next = value.includes(key) ? value.filter(p => p !== key) : [...value, key];
    onChange(next);
  };

  const labelText = value.length === 0 ? 'All Parties' : (
    value.length === 1 ? value[0] : `${value[0]}, ${value[1]}${value.length > 2 ? ` +${value.length - 2}` : ''}`
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[11px] font-semibold text-[#6B6560] uppercase tracking-wider mb-1">Party</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[140px] bg-white border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm font-medium text-[#1A1814] hover:border-[#2D5A3D] transition-all"
      >
        <span className="truncate">{labelText}</span>
        <ChevronDown className={`w-4 h-4 text-[#6B6560] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[220px] bg-white border border-[#E8E4DC] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] z-[60] overflow-hidden">
          <div className="px-4 py-2 border-b border-[#E8E4DC] flex justify-between items-center">
            <span className="text-[11px] font-bold text-[#6B6560] uppercase">Select Parties</span>
            {value.length > 0 && (
              <button onClick={() => onChange([])} className="text-[11px] font-bold text-[#C0392B] hover:underline">Clear all</button>
            )}
          </div>
          <ul className="max-h-[280px] overflow-y-auto py-1">
            <li className="border-b border-[#E8E4DC]/60">
              <button onClick={() => onChange([])} className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-[#1A1814] hover:bg-[#EBF2ED]">
                <span>All Parties</span>
                {value.length === 0 && <Check className="w-4 h-4 text-[#2D5A3D]" />}
              </button>
            </li>
            {TRACKED_PARTIES.map(party => (
              <li key={party.key}>
                <button
                  onClick={() => toggleParty(party.key)}
                  className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-[#1A1814] hover:bg-[#EBF2ED]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: party.color }} />
                    <span>{party.label}</span>
                  </div>
                  {value.includes(party.key) && <Check className="w-4 h-4 text-[#2D5A3D]" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// ── 3. MAIN COMPONENT ───────────────────────────────────────────────

const DashboardFilters = () => {
  const filters = useAppStore(selectors.dashboardFilters);
  const { setElectionType, setState_, setParties, setYearRange } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMobileMenuOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.electionType !== 'lok_sabha') count++;
    if (filters.state !== 'all') count++;
    if (filters.parties.length > 0) count++;
    return count;
  }, [filters]);

  const clearAll = () => {
    setElectionType('lok_sabha');
    setState_('all');
    setParties([]);
  };

  const scrollToTurnout = () => {
    const el = document.getElementById('turnout-chart');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('animate-pulse-brief');
      setTimeout(() => el.classList.remove('animate-pulse-brief'), 2000);
    }
  };

  return (
    <div className="sticky top-[72px] z-40 backdrop-blur-md bg-[#F8F7F4]/92 border-b border-[#E8E4DC] transition-all duration-300">
      <style>{`
        @keyframes pulse-brief { 0% { outline: 0px solid #2D5A3D00; } 50% { outline: 4px solid #2D5A3D44; } 100% { outline: 0px solid #2D5A3D00; } }
        .animate-pulse-brief { animation: pulse-brief 2s ease-out; }
      `}</style>
      
      {/* Desktop View */}
      <div className="hidden md:block max-w-[1280px] mx-auto px-6 py-4">
        <div className="flex items-center gap-6">
          
          {/* Election Type */}
          <div>
            <label className="block text-[11px] font-semibold text-[#6B6560] uppercase tracking-wider mb-1">Type</label>
            <div className="flex gap-1 p-1 bg-[#EBF2ED] rounded-lg">
              {ELECTION_TYPES.map(type => (
                <button
                  key={type.key}
                  onClick={() => setElectionType(type.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-['DM_Sans'] font-semibold transition-all duration-200 ${
                    filters.electionType === type.key ? 'bg-[#2D5A3D] text-white shadow-sm' : 'text-[#2D5A3D] hover:bg-white/60'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-10 w-px bg-[#E8E4DC]" />

          <StateDropdown value={filters.state} onChange={setState_} />
          <PartyMultiSelect value={filters.parties} onChange={setParties} />

          <div className="h-10 w-px bg-[#E8E4DC]" />

          {/* Period Read-only */}
          <div className="flex flex-col">
            <label className="block text-[11px] font-semibold text-[#6B6560] uppercase tracking-wider mb-1">Period</label>
            <button
              onClick={scrollToTurnout}
              className="flex items-center gap-3 bg-white border border-[#E8E4DC] rounded-lg px-3 py-2 text-sm hover:border-[#2D5A3D] transition-all group"
            >
              <span className="font-['JetBrains_Mono'] font-bold text-[#1A1814]">
                {filters.yearRange[0]} – {filters.yearRange[1]}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-[#6B6560] group-hover:text-[#2D5A3D]" />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="ml-auto flex items-center gap-1.5 text-xs font-bold text-[#C0392B] hover:underline"
            >
              <X className="w-3.5 h-3.5" /> Clear {activeFilterCount} Filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#2D5A3D]" />
          <span className="text-sm font-bold text-[#1A1814]">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-[#2D5A3D] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{activeFilterCount}</span>
          )}
        </div>
        <button
          onClick={() => setIsMobileMobileMenuOpen(true)}
          className="text-sm font-bold text-[#2D5A3D]"
        >
          Adjust
        </button>
      </div>

      {/* Mobile Bottom Sheet Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" onClick={() => setIsMobileMobileMenuOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-[#F8F7F4] rounded-t-[24px] z-[101] p-6 pb-10 flex flex-col gap-6 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-['Playfair_Display'] text-xl font-bold">Dashboard Filters</h3>
              <button onClick={() => setIsMobileMobileMenuOpen(false)} className="p-2 bg-[#EBF2ED] rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#6B6560] uppercase tracking-widest">Election Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {ELECTION_TYPES.map(type => (
                    <button key={type.key} onClick={() => setElectionType(type.key)} className={`px-3 py-3 rounded-xl text-xs font-bold border transition-all ${filters.electionType === type.key ? 'bg-[#2D5A3D] border-[#2D5A3D] text-white shadow-lg' : 'bg-white border-[#E8E4DC] text-[#6B6560]'}`}>{type.label}</button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#6B6560] uppercase tracking-widest">Region & State</label>
                <select 
                  className="w-full bg-white border border-[#E8E4DC] rounded-xl px-4 py-3 text-sm outline-none"
                  value={filters.state}
                  onChange={(e) => setState_(e.target.value)}
                >
                  {INDIA_STATES.map(s => <option key={s.slug} value={s.slug}>{s.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#6B6560] uppercase tracking-widest">Political Parties</label>
                <div className="flex flex-wrap gap-2">
                  {TRACKED_PARTIES.map(p => (
                    <button
                      key={p.key}
                      onClick={() => setParties(filters.parties.includes(p.key) ? filters.parties.filter(x => x !== p.key) : [...filters.parties, p.key])}
                      className={`px-3 py-2 rounded-full border text-[11px] font-bold flex items-center gap-2 transition-all ${filters.parties.includes(p.key) ? 'bg-[#2D5A3D] text-white border-[#2D5A3D]' : 'bg-white text-[#6B6560] border-[#E8E4DC]'}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} /> {p.key}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button onClick={() => { clearAll(); setIsMobileMobileMenuOpen(false); }} className="flex-1 bg-[#E8E4DC] py-4 rounded-xl font-bold text-sm text-[#6B6560]">Reset</button>
              <button onClick={() => setIsMobileMobileMenuOpen(false)} className="flex-1 bg-[#2D5A3D] py-4 rounded-xl font-bold text-sm text-white">Show Results</button>
            </div>
          </div>
        </>
      )}

      {/* Global Notice for coming soon data */}
      {filters.electionType !== 'lok_sabha' && (
        <div className="bg-[#2D5A3D] text-white py-1.5 px-4 text-center text-[11px] font-bold tracking-wide uppercase">
          Notice: {ELECTION_TYPES.find(t => t.key === filters.electionType)?.label} historical data coming soon. Showing placeholder results.
        </div>
      )}
    </div>
  );
};

export default DashboardFilters;