import { useQuery } from '@tanstack/react-query'
import { fetchElectionResults, fetchConstituencyData } from '../services/tcpd'
import { fetchCandidates } from '../services/myneta'
import { fetchTurnoutData } from '../services/dataGov'
import { STATIC_FALLBACK } from '../data/static-fallback'
import { indiaStatesMinimal, indiaConstituenciesMinimal } from '../data/india-states-minimal'

const validateGeoJSON = (data) => data && data.type === 'FeatureCollection' && Array.isArray(data.features) && data.features.length > 0;

export const fetchGeoJSON = async (type) => {
  try {
    const res = await fetch("/" + type + ".geojson");
    const data = await res.json();
    if (!validateGeoJSON(data)) throw new Error('Invalid GeoJSON');
    return data;
  } catch (err) {
    console.warn('GeoJSON fetch failed — using minimal fallback');
    return type === 'india-states' ? indiaStatesMinimal : indiaConstituenciesMinimal;
  }
};

export const useTurnoutData = () => useQuery({
  queryKey: ['turnout'],
  queryFn: async () => {
    try { return await fetchTurnoutData(); } catch (err) { return STATIC_FALLBACK.turnout; }
  },
  staleTime: 3600000,
  retry: 2
});

export const useConstituencyData = (name) => useQuery({
  queryKey: ['constituency', name],
  queryFn: async () => {
    try { return await fetchConstituencyData(name); } catch (err) { return STATIC_FALLBACK.constituencies[name] ?? null; }
  },
  enabled: !!name,
  staleTime: 1800000
});

export const useCandidateData = (constituency) => useQuery({
  queryKey: ['candidates', constituency],
  queryFn: async () => {
    try { return await fetchCandidates(constituency); } catch (err) { return STATIC_FALLBACK.candidates[constituency] ?? []; }
  },
  enabled: !!constituency,
  staleTime: 3600000
});

export const usePartyData = (year) => useQuery({
  queryKey: ['election', year],
  queryFn: async () => {
    try { return await fetchElectionResults(year); } catch (err) { return STATIC_FALLBACK.elections[year] ?? []; }
  },
  staleTime: 3600000
});
export const useElectionData = () => {
  const turnoutQuery = useTurnoutData();
  const partyQuery = usePartyData('2024');

  return {
    turnoutData: turnoutQuery.data,
    isLoadingTurnout: turnoutQuery.isLoading,
    turnoutError: turnoutQuery.error,
    
    partyData: Array.isArray(partyQuery.data) && partyQuery.data.length && partyQuery.data[0]?.year
      ? partyQuery.data
      : STATIC_FALLBACK.partyPerformance,
    isLoadingParty: partyQuery.isLoading,
    partyError: partyQuery.error,
    
    womenData: STATIC_FALLBACK.women,
    isLoadingWomen: false,
    womenError: null,
    
    summaryStats: {
      totalVoters: '96.8 Cr',
      totalElections: '18',
      highestTurnout: '67.4%',
      womenMPs: '74'
    },
    isLoadingSummary: false
  };
};
