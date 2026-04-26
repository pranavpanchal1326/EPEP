import { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

let cachedConstituencyGeoJSON = null;

const loadConstituencyGeoJSON = async () => {
  if (cachedConstituencyGeoJSON) return cachedConstituencyGeoJSON;
  const response = await fetch('/india-constituencies.geojson');
  if (!response.ok) return null;
  cachedConstituencyGeoJSON = await response.json();
  return cachedConstituencyGeoJSON;
};

const ZoomLoadingIndicator = () => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm rounded-full px-[14px] py-[6px] shadow-card border border-[#E8E4DC]">
      <span className="font-body text-[11px] font-medium text-[#6B6560] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#2D5A3D] animate-pulse" />
        Loading constituencies...
      </span>
    </div>
  );
};

const ConstituencyLayer = ({ onConstituencyClick, activeConstituencyId }) => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const data = await loadConstituencyGeoJSON();
      if (data) setGeoData(data);
      setLoading(false);
    };
    init();
  }, []);

  const getConstituencyStyle = (feature) => {
    const cId = feature.properties.constituency_id || feature.properties.PC_ID;
    const isActive = cId === activeConstituencyId;
    const reservation = feature.properties.reservation || feature.properties.PC_TYPE;
    const isReserved = reservation === 'SC' || reservation === 'ST';

    return {
      fillColor: isActive ? '#2D5A3D' : isReserved ? '#EBF2ED' : '#FFFFFF',
      fillOpacity: isActive ? 0.3 : 0.1,
      color: isActive ? '#2D5A3D' : '#6B6560',
      weight: isActive ? 2 : 1,
      opacity: isActive ? 0.8 : 0.4,
    };
  };

  const onEachConstituency = (feature, layer) => {
    const name = feature.properties.constituency_name || feature.properties.PC_NAME;
    
    layer.bindTooltip(name, {
      direction: 'top',
      offset: [0, -4],
      className: 'constituency-tooltip',
      sticky: true
    });

    layer.on({
      mouseover: (e) => {
        const cId = feature.properties.constituency_id || feature.properties.PC_ID;
        if (cId !== activeConstituencyId) {
          e.target.setStyle({
            fillColor: '#2D5A3D',
            fillOpacity: 0.15,
            color: '#2D5A3D',
            weight: 1.5,
            opacity: 0.6,
          });
        }
      },
      mouseout: (e) => {
        e.target.setStyle(getConstituencyStyle(feature));
      },
      click: (e) => {
        L.DomEvent.stopPropagation(e);
        onConstituencyClick({
          id: feature.properties.constituency_id || feature.properties.PC_ID,
          name: name,
          stateCode: feature.properties.state_code || feature.properties.ST_CODE,
          stateName: feature.properties.state_name || feature.properties.ST_NM,
          reservationStatus: feature.properties.reservation || feature.properties.PC_TYPE || 'General',
          coordinates: e.latlng,
        });
      },
    });
  };

  if (loading) return <ZoomLoadingIndicator />;
  if (!geoData) return null;

  return (
    <GeoJSON 
      data={geoData} 
      style={getConstituencyStyle} 
      onEachFeature={onEachConstituency} 
    />
  );
};

export default ConstituencyLayer;
