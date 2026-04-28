/**
 * @fileoverview Constituency Details Popup — EPEP India Map
 * @module ConstituencyPopup
 *
 * Floating tooltip component that displays high-level data for a
 * selected constituency on the India Map. Features 2024 results,
 * candidate assets, criminal cases, and election phase.
 *
 * @param {Object} props
 * @param {string} props.name     - Constituency name
 * @param {string} [props.mp]     - Current Member of Parliament
 * @param {string} [props.party]  - Represented party
 * @param {number} [props.turnout]- Voter turnout percentage
 * @param {Function} props.onClick- Interaction callback
 */
import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { PHASE_COLORS } from '@/data/static-fallback';

const STATIC_CONSTITUENCY_DATA = {
  "MH-02": { candidateName: "Nitin Gadkari", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹28.08 Cr", criminalCases: 0, phase: 1 },
  "MH-01": { candidateName: "Piyush Goyal", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹110.98 Cr", criminalCases: 0, phase: 5 },
  "DL-01": { candidateName: "Bansuri Swaraj", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹19.23 Cr", criminalCases: 0, phase: 6 },
  "UP-73": { candidateName: "Narendra Modi", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹3.02 Cr", criminalCases: 0, phase: 7 },
  "UP-42": { candidateName: "Rajnath Singh", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹4.62 Cr", criminalCases: 0, phase: 5 },
  "TN-01": { candidateName: "Kalanidhi Veeraswamy", party: "DMK", partyColor: "#dd1100", won: true, assets: "₹5.91 Cr", criminalCases: 0, phase: 1 },
  "WB-01": { candidateName: "Bandopadhyay Sudip", party: "TMC", partyColor: "#20C646", won: true, assets: "₹8.42 Cr", criminalCases: 0, phase: 7 },
  "MH-25": { candidateName: "Murlidhar Mohol", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹25.12 Cr", criminalCases: 0, phase: 4 },
};

const ConstituencyPopup = ({ constituency, mapRef, onClose, onViewDetails }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const updatePosition = useCallback(() => {
    if (!mapRef.current || !constituency) return;
    const point = mapRef.current.latLngToContainerPoint([
      constituency.coordinates.lat,
      constituency.coordinates.lng
    ]);
    
    // Clamp to map bounds logic
    const mapWidth = mapRef.current.getContainer().clientWidth;
    let x = point.x;
    if (x + 120 > mapWidth) x = mapWidth - 130;
    if (x - 120 < 0) x = 130;

    setPos({ x, y: point.y });
  }, [constituency, mapRef]);

  useEffect(() => {
    if (!mapRef.current) return;
    updatePosition();
    const map = mapRef.current;
    map.on('move zoom', updatePosition);
    return () => map.off('move zoom', updatePosition);
  }, [updatePosition, mapRef]);

  if (!constituency) return null;

  const data = STATIC_CONSTITUENCY_DATA[constituency.id] || null;
  const phaseInfo = data ? PHASE_COLORS[data.phase] : null;

  return (
    <div 
      className="absolute z-[1080] pointer-events-none"
      style={{ 
        left: pos.x, 
        top: pos.y, 
        transform: 'translate(-50%, calc(-100% - 12px))',
      }}
    >
      <div className="w-[240px] bg-white border border-[#E8E4DC] rounded-xl shadow-floating pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 pb-2.5 border-b border-[#E8E4DC] relative">
          <h4 className="font-display text-base font-bold text-[#1A1814] uppercase tracking-tight pr-6">
            {constituency.name}
          </h4>
          <p className="font-body text-[11px] text-[#6B6560]">
            {constituency.stateName} · {constituency.reservationStatus}
          </p>
          <button 
            onClick={onClose}
            className="absolute top-2.5 right-2.5 p-1 hover:bg-[#EBF2ED] rounded-md text-[#6B6560] hover:text-[#2D5A3D] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Candidate Info */}
        <div className="p-3.5 border-b border-[#E8E4DC]">
          {data ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.partyColor }} />
                <span className="font-body text-[13px] font-semibold text-[#1A1814]">
                  {data.candidateName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-[11px] text-[#6B6560]">{data.party}</span>
                <div className="bg-[#EBF2ED] text-[#2D5A3D] text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <CheckCircle size={10} /> Won · 2024
                </div>
              </div>
            </>
          ) : (
            <p className="font-body text-[12px] text-[#6B6560] italic">Candidate data loading...</p>
          )}
        </div>

        {/* Stats */}
        <div className="p-3.5 border-b border-[#E8E4DC] space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-body text-[10px] text-[#6B6560] uppercase tracking-wider">Assets</span>
            <span className="font-mono text-[12px] text-[#1A1814]">{data?.assets || '—'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-[10px] text-[#6B6560] uppercase tracking-wider">Cases</span>
            <div className="flex items-center gap-1">
              {data?.criminalCases === 0 ? (
                <span className="font-mono text-[12px] text-[#2D5A3D]">✓ None</span>
              ) : (
                <>
                  <AlertCircle size={12} className="text-[#C0392B]" />
                  <span className="font-mono text-[12px] text-[#C0392B]">{data?.criminalCases}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-[10px] text-[#6B6560] uppercase tracking-wider">Phase</span>
            <span className="font-mono text-[11px] text-[#1A1814]">
              {data ? `${data.phase} · ${phaseInfo?.date.split(' ').slice(0, 2).join(' ')}` : '—'}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="p-2.5">
          <button 
            onClick={() => onViewDetails(constituency)}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#EBF2ED] hover:bg-[#2D5A3D] text-[#2D5A3D] hover:text-white rounded-lg text-[13px] font-semibold transition-all group"
          >
            View Full Details <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

ConstituencyPopup.propTypes = {
  name:     PropTypes.string.isRequired,
  mp:       PropTypes.string,
  party:    PropTypes.string,
  turnout:  PropTypes.number,
  onClick:  PropTypes.func.isRequired,
}

ConstituencyPopup.defaultProps = {
  mp: null, party: null, turnout: null,
}

export default ConstituencyPopup;
