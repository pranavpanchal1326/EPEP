import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { Plus, Minus } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import NationalStatsStrip from './NationalStatsStrip'
import MapControlBar from './MapControlBar'
import PhaseLegend from './PhaseLegend'
import StatePanel from './StatePanel'
import { useMapZoom } from '@/hooks/useMapZoom'
import ConstituencyLayer from './ConstituencyLayer'
import ConstituencyPopup from './ConstituencyPopup'
import PollingStationLayer from './PollingStationLayer'
import { enrichStateData, enrichConstituencyData } from '@/services/mapDataService'
import { PHASE_COLORS, STATIC_STATE_DATA } from '@/data/static-fallback'
import { trackEvent } from '../../lib/firebase'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow })

const INDIA_CENTER  = [20.5937, 78.9629]
const OSM_TILE_URL  = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const OSM_ATTR      = '© OpenStreetMap'

const getStateName = (feature) => feature.properties?.NAME_1 || feature.properties?.state_name || feature.properties?.ST_NM || feature.properties?.name || 'Unknown State';
const getStateCode = (feature) => feature.properties?.HASC_1?.split('.')?.pop() || feature.properties?.state_code || feature.properties?.ST_CODE || null;

const MapController = ({ mapRef }) => {
  const map = useMap();
  useEffect(() => { mapRef.current = map; }, [map, mapRef]);
  return null;
}

const IndiaMap = () => {
  const mapRef = useRef(null);
  const selectedLayer = useRef(null);
  const [geoData, setGeoData] = useState(null);
  const [activeElectionType, setActiveElectionType] = useState('lok-sabha');
  const [selectedState, setSelectedState] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isPanelLoading, setIsPanelLoading] = useState(false);
  const [activeConstituencyId, setActiveConstituencyId] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [isConstituencyPopupOpen, setIsConstituencyPopupOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width: 639px)');
  const { isConstituencyMode } = useMapZoom(mapRef);

  useEffect(() => {
    fetch('/india-states.geojson').then(res => res.json()).then(data => setGeoData(data)).catch(console.error);
  }, []);

  const handleZoom = (delta) => { if (mapRef.current) { if (delta > 0) mapRef.current.zoomIn(); else mapRef.current.zoomOut(); } };

  const getStateStyle = (feature) => {
    const stateData = STATIC_STATE_DATA[getStateCode(feature)] || { phase: 0 };
    const colors = PHASE_COLORS[stateData.phase || 0] || PHASE_COLORS[0];
    return { fillColor: colors.fill, fillOpacity: isConstituencyMode ? 0.05 : 0.7, color: '#2D5A3D', weight: 1, opacity: isConstituencyMode ? 0.3 : 0.8 };
  };

  const onEachFeature = (feature, layer) => {
    if (!isMobile) layer.bindTooltip(`<strong>${getStateName(feature)}</strong>`, { sticky: true });
    layer.on({
      click: async (e) => {
        if (isConstituencyMode) return;
        const l = e.target;
        trackEvent('map_state_clicked', { state_name: getStateName(feature) });
        if (selectedLayer.current && selectedLayer.current !== l) selectedLayer.current.setStyle(getStateStyle(selectedLayer.current.feature));
        l.setStyle({ fillOpacity: 0.35, weight: 2.5, color: '#1A4A2D' });
        selectedLayer.current = l;
        setIsPanelLoading(true); setIsPanelOpen(true);
        try { const data = await enrichStateData(getStateCode(feature)); setSelectedState(data); } catch (err) { console.error(err); } finally { setIsPanelLoading(false); }
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-bg-base">
      <NationalStatsStrip />
      <div className="relative flex-1 overflow-hidden">
        <MapContainer 
          center={INDIA_CENTER} 
          zoom={isMobile ? 4 : 5} 
          minZoom={4} 
          maxZoom={10} 
          zoomControl={false} 
          className="w-full h-full"
          tap={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          scrollWheelZoom={false}
        >
          <MapController mapRef={mapRef} />
          <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTR} />
          {geoData && <GeoJSON data={geoData} style={getStateStyle} onEachFeature={onEachFeature} />}
          {isConstituencyMode && <ConstituencyLayer onConstituencyClick={(data) => { setActiveConstituencyId(data.id); setSelectedConstituency(data); setIsConstituencyPopupOpen(true); }} activeConstituencyId={activeConstituencyId} />}
        </MapContainer>

        {/* CUSTOM ZOOM CONTROLS */}
        <div className="absolute bottom-20 right-4 z-[900] flex flex-col gap-2">
          <button onClick={() => handleZoom(1)} className="w-11 h-11 bg-white border border-border-soft rounded-xl shadow-lg flex items-center justify-center hover:bg-bg-base active:scale-95 transition-all"><Plus size={20} /></button>
          <button onClick={() => handleZoom(-1)} className="w-11 h-11 bg-white border border-border-soft rounded-xl shadow-lg flex items-center justify-center hover:bg-bg-base active:scale-95 transition-all"><Minus size={20} /></button>
        </div>

        <MapControlBar activeType={activeElectionType} onElectionTypeChange={setActiveElectionType} mapRef={mapRef} />
        <PhaseLegend />
        <StatePanel selectedState={selectedState} isOpen={isPanelOpen} isLoading={isPanelLoading} onClose={() => setIsPanelOpen(false)} />
      </div>
    </div>
  );
};
export default IndiaMap;