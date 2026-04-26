import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { STATIC_POLLING_STATIONS } from '@/data/static-fallback';

const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  const size = count < 10 ? 32 : count < 100 ? 38 : 44;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: #2D5A3D;
        color: #FFFFFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', monospace;
        font-size: ${count < 100 ? 11 : 10}px;
        font-weight: 600;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 8px rgba(45,90,61,0.4);
      ">${count < 1000 ? count : Math.round(count/1000) + 'k'}</div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
};

const pollingStationIcon = L.divIcon({
  html: `
    <div style="
      width: 8px;
      height: 8px;
      background: #2D5A3D;
      border-radius: 50%;
      border: 1.5px solid #FFFFFF;
      box-shadow: 0 1px 4px rgba(45,90,61,0.5);
    "></div>
  `,
  className: '',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

const PollingStationLayer = ({ stateCode }) => {
  const map = useMap();
  const clusterGroup = useRef(null);

  useEffect(() => {
    if (!map) return;

    clusterGroup.current = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: createClusterIcon,
    });

    const stations = stateCode 
      ? STATIC_POLLING_STATIONS.filter(s => s.stateCode === stateCode)
      : STATIC_POLLING_STATIONS;

    stations.forEach(station => {
      const marker = L.marker([station.lat, station.lng], { 
        icon: pollingStationIcon 
      });

      marker.bindTooltip(
        `${station.name}\n${station.electors.toLocaleString('en-IN')} electors`,
        {
          direction: 'top',
          offset: [0, -8],
          className: 'station-tooltip'
        }
      );

      clusterGroup.current.addLayer(marker);
    });

    map.addLayer(clusterGroup.current);

    return () => {
      if (clusterGroup.current) {
        map.removeLayer(clusterGroup.current);
      }
    };
  }, [map, stateCode]);

  return null;
};

export default PollingStationLayer;
