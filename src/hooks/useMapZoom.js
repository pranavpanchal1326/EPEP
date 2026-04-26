import { useState, useEffect } from 'react';

export const CONSTITUENCY_ZOOM_THRESHOLD = 7;

/**
 * useMapZoom Hook
 * Tracks Leaflet map zoom and derives view mode.
 */
export const useMapZoom = (mapRef) => {
  const [zoom, setZoom] = useState(5);
  const [mode, setMode] = useState('state');

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    
    const updateZoom = () => {
      const currentZoom = map.getZoom();
      setZoom(currentZoom);
      setMode(currentZoom >= CONSTITUENCY_ZOOM_THRESHOLD ? 'constituency' : 'state');
    };

    // Initial read
    updateZoom();

    map.on('zoomend', updateZoom);

    return () => {
      map.off('zoomend', updateZoom);
    };
  }, [mapRef]);

  return {
    zoom,
    mode,
    isConstituencyMode: mode === 'constituency',
    isStateMode: mode === 'state',
  };
};
