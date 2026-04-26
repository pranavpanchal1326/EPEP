/**
 * EPEP Static Fallback Data
 * Single source of truth for Tier-3 data cascade.
 * Sources: ECI.gov.in, TCPD, MyNeta.
 */

// ── NATIONAL STATS ──
export const NATIONAL_STATS = [
  { label: 'Total Seats',      value: '543',        mono: true  },
  { label: 'Registered Voters', value: '96.8 Cr',   mono: true  },
  { label: 'Polling Stations',  value: '10.5 Lakh', mono: true  },
  { label: 'Election Phases',   value: '7',         mono: true  },
  { label: 'Voter Turnout',     value: '66.3%',     mono: true  },
  { label: 'States & UTs',      value: '36',        mono: true  },
];

// ── PHASE COLORS ──
export const PHASE_COLORS = {
  1: { fill: '#2D5A3D', label: 'Phase 1', date: '19 Apr 2024', seats: 102 },
  2: { fill: '#3D7A55', label: 'Phase 2', date: '26 Apr 2024', seats: 89  },
  3: { fill: '#4E9A6E', label: 'Phase 3', date: '7 May 2024',  seats: 94  },
  4: { fill: '#6DB88A', label: 'Phase 4', date: '13 May 2024', seats: 96  },
  5: { fill: '#90CFA8', label: 'Phase 5', date: '20 May 2024', seats: 49  },
  6: { fill: '#B8E2C8', label: 'Phase 6', date: '25 May 2024', seats: 57  },
  7: { fill: '#DCF0E4', label: 'Phase 7', date: '1 Jun 2024',  seats: 57  },
  0: { fill: '#E8E4DC', label: 'No Data', date: null,          seats: 0   },
};

// ── STATIC STATE DATA (36 States & UTs) ──
export const STATIC_STATE_DATA = {
  MH: {
    name: "Maharashtra", stateCode: "MH", totalSeats: 48, phase: 3,
    turnout2024: 61.4, registeredVoters: "9.12 Cr", pollingStations: 98114,
    recentWinners: [
      { year: 2024, party: "MahaYuti", seatsWon: 17, totalSeats: 48, allianceName: "NDA", partyColor: "#FF9933" },
      { year: 2019, party: "BJP", seatsWon: 23, totalSeats: 48, allianceName: "NDA", partyColor: "#FF9933" },
      { year: 2014, party: "BJP", seatsWon: 23, totalSeats: 48, allianceName: "NDA", partyColor: "#FF9933" }
    ],
    notableCandidates: [
      { name: "Nitin Gadkari", constituency: "Nagpur", party: "BJP", partyColor: "#FF9933", assets: "₹28.08 Cr", criminalCases: 0, education: "Post Graduate", won: true }
    ]
  },
  UP: {
    name: "Uttar Pradesh", stateCode: "UP", totalSeats: 80, phase: 1,
    turnout2024: 57.8, registeredVoters: "15.21 Cr", pollingStations: 162712,
    recentWinners: [
      { year: 2024, party: "INDIA Alliance", seatsWon: 43, totalSeats: 80, allianceName: "INDIA", partyColor: "#19AAED" },
      { year: 2019, party: "BJP", seatsWon: 62, totalSeats: 80, allianceName: "NDA", partyColor: "#FF9933" },
      { year: 2014, party: "BJP", seatsWon: 71, totalSeats: 80, allianceName: "NDA", partyColor: "#FF9933" }
    ],
    notableCandidates: [
      { name: "Narendra Modi", constituency: "Varanasi", party: "BJP", partyColor: "#FF9933", assets: "₹3.02 Cr", criminalCases: 0, education: "Post Graduate", won: true }
    ]
  },
  DL: {
    name: "Delhi", stateCode: "DL", totalSeats: 7, phase: 6,
    turnout2024: 60.5, registeredVoters: "1.52 Cr", pollingStations: 13641,
    recentWinners: [{ year: 2024, party: "BJP", seatsWon: 7, totalSeats: 7, allianceName: "NDA", partyColor: "#FF9933" }],
    notableCandidates: [{ name: "Bansuri Swaraj", constituency: "New Delhi", party: "BJP", partyColor: "#FF9933", assets: "₹19.23 Cr", criminalCases: 0, education: "Graduate Professional", won: true }]
  },
  TN: {
    name: "Tamil Nadu", stateCode: "TN", totalSeats: 39, phase: 1,
    turnout2024: 72.5, registeredVoters: "6.23 Cr", pollingStations: 68144,
    recentWinners: [{ year: 2024, party: "DMK", seatsWon: 22, totalSeats: 39, allianceName: "INDIA", partyColor: "#dd1100" }],
    notableCandidates: [{ name: "Kalanidhi Veeraswamy", constituency: "Chennai North", party: "DMK", partyColor: "#dd1100", assets: "₹5.91 Cr", criminalCases: 0, education: "Post Graduate Professional", won: true }]
  },
  WB: {
    name: "West Bengal", stateCode: "WB", totalSeats: 42, phase: 7,
    turnout2024: 76.2, registeredVoters: "7.59 Cr", pollingStations: 80430,
    recentWinners: [{ year: 2024, party: "TMC", seatsWon: 29, totalSeats: 42, allianceName: "Others", partyColor: "#20C646" }],
    notableCandidates: [{ name: "Abhishek Banerjee", constituency: "Diamond Harbour", party: "TMC", partyColor: "#20C646", assets: "₹1.26 Cr", criminalCases: 0, education: "Post Graduate Professional", won: true }]
  },
  GJ: { name: "Gujarat", stateCode: "GJ", totalSeats: 26, phase: 3, turnout2024: 59.5, registeredVoters: "4.93 Cr", pollingStations: 50788, recentWinners: [], notableCandidates: [] },
  RJ: { name: "Rajasthan", stateCode: "RJ", totalSeats: 25, phase: 2, turnout2024: 62.3, registeredVoters: "5.21 Cr", pollingStations: 51756, recentWinners: [], notableCandidates: [] },
  KA: { name: "Karnataka", stateCode: "KA", totalSeats: 28, phase: 2, turnout2024: 69.5, registeredVoters: "5.42 Cr", pollingStations: 58834, recentWinners: [], notableCandidates: [] },
  KL: { name: "Kerala", stateCode: "KL", totalSeats: 20, phase: 3, turnout2024: 71.3, registeredVoters: "2.77 Cr", pollingStations: 25231, recentWinners: [], notableCandidates: [] },
  TG: { name: "Telangana", stateCode: "TG", totalSeats: 17, phase: 4, turnout2024: 63.4, registeredVoters: "3.32 Cr", pollingStations: 35356, recentWinners: [], notableCandidates: [] },
};

// Fill remaining states with basic data to avoid crashes
['AP', 'AR', 'AS', 'BR', 'CT', 'GA', 'HR', 'HP', 'JH', 'MP', 'MN', 'ML', 'MZ', 'NL', 'OR', 'PB', 'SK', 'TR', 'UT', 'AN', 'CH', 'DH', 'JK', 'LA', 'LD', 'PY'].forEach(code => {
  if (!STATIC_STATE_DATA[code]) {
    STATIC_STATE_DATA[code] = { 
      name: `State ${code}`, stateCode: code, totalSeats: 0, phase: 1, 
      turnout2024: 0, registeredVoters: "0 Cr", pollingStations: 0, 
      recentWinners: [], notableCandidates: [] 
    };
  }
});

// ── STATIC CONSTITUENCY DATA ──
export const STATIC_CONSTITUENCY_DATA = {
  "MH-02": { id: "MH-02", name: "Nagpur", stateCode: "MH", stateName: "Maharashtra", reservationStatus: "General", candidateName: "Nitin Gadkari", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹28.08 Cr", criminalCases: 0, phase: 1, allCandidates: [] },
  "MH-01": { id: "MH-01", name: "Mumbai North", stateCode: "MH", stateName: "Maharashtra", reservationStatus: "General", candidateName: "Piyush Goyal", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹110.98 Cr", criminalCases: 0, phase: 5, allCandidates: [] },
  "DL-01": { id: "DL-01", name: "New Delhi", stateCode: "DL", stateName: "Delhi", reservationStatus: "General", candidateName: "Bansuri Swaraj", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹19.23 Cr", criminalCases: 0, phase: 6, allCandidates: [] },
  "UP-73": { id: "UP-73", name: "Varanasi", stateCode: "UP", stateName: "Uttar Pradesh", reservationStatus: "General", candidateName: "Narendra Modi", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹3.02 Cr", criminalCases: 0, phase: 7, allCandidates: [] },
  "UP-42": { id: "UP-42", name: "Lucknow", stateCode: "UP", stateName: "Uttar Pradesh", reservationStatus: "General", candidateName: "Rajnath Singh", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹4.62 Cr", criminalCases: 0, phase: 5, allCandidates: [] },
  "TN-01": { id: "TN-01", name: "Chennai North", stateCode: "TN", stateName: "Tamil Nadu", reservationStatus: "General", candidateName: "Kalanidhi Veeraswamy", party: "DMK", partyColor: "#dd1100", won: true, assets: "₹5.91 Cr", criminalCases: 0, phase: 1, allCandidates: [] },
  "WB-01": { id: "WB-01", name: "Kolkata North", stateCode: "WB", stateName: "West Bengal", reservationStatus: "General", candidateName: "Sudip Bandyopadhyay", party: "TMC", partyColor: "#20C646", won: true, assets: "₹8.42 Cr", criminalCases: 0, phase: 7, allCandidates: [] },
  "MH-25": { id: "MH-25", name: "Pune", stateCode: "MH", stateName: "Maharashtra", reservationStatus: "General", candidateName: "Murlidhar Mohol", party: "BJP", partyColor: "#FF9933", won: true, assets: "₹25.12 Cr", criminalCases: 0, phase: 4, allCandidates: [] },
};

// ── STATIC POLLING STATIONS ──
export const STATIC_POLLING_STATIONS = [];
const majorStates = ['MH', 'UP', 'TN', 'WB', 'RJ', 'GJ', 'KA', 'TG', 'KL', 'DL'];
for(let i=0; i<200; i++) {
  const s = majorStates[i % majorStates.length];
  STATIC_POLLING_STATIONS.push({
    id: `PS_AUTO_${i}`,
    name: `Polling Station ${i+1}`,
    lat: 10 + (i * 0.1) % 20,
    lng: 70 + (i * 0.15) % 20,
    stateCode: s,
    assemblySegment: "General Segment",
    electors: 800 + (i * 7) % 600
  });
}


// ── ADDED STATIC FALLBACKS FOR CHARTS AND EVM ──
export const STATIC_FALLBACK = {
  turnout: [
    { year: 1951, turnout: 45.7 }, { year: 1957, turnout: 47.7 }, { year: 1962, turnout: 55.4 },
    { year: 1967, turnout: 61.3 }, { year: 1971, turnout: 55.3 }, { year: 1977, turnout: 60.5 },
    { year: 1980, turnout: 56.9 }, { year: 1984, turnout: 63.6 }, { year: 1989, turnout: 61.9 },
    { year: 1991, turnout: 56.7 }, { year: 1996, turnout: 57.9 }, { year: 1998, turnout: 61.9 },
    { year: 1999, turnout: 59.9 }, { year: 2004, turnout: 57.8 }, { year: 2009, turnout: 58.2 },
    { year: 2014, turnout: 66.4 }, { year: 2019, turnout: 67.4 }, { year: 2024, turnout: 65.8 }
  ],
  // Party seats (Lok Sabha) — compact fallback used if TCPD unavailable
  // Source: public election result summaries (verify via eci.gov.in)
  partyPerformance: [
    { year: 2004, INC: 145, BJP: 138, JD: 0,   OTH: 260 },
    { year: 2009, INC: 206, BJP: 116, JD: 0,   OTH: 221 },
    { year: 2014, INC: 44,  BJP: 282, JD: 0,   OTH: 217 },
    { year: 2019, INC: 52,  BJP: 303, JD: 0,   OTH: 188 },
    { year: 2024, INC: 99,  BJP: 240, JD: 0,   OTH: 204 },
  ],
  // Women candidates vs winners (Lok Sabha) — compact fallback
  // Source: ECI/TCPD compiled series (verify via eci.gov.in)
  women: [
    { year: 2004, candidates: 355, winners: 45 },
    { year: 2009, candidates: 556, winners: 59 },
    { year: 2014, candidates: 668, winners: 61 },
    { year: 2019, candidates: 724, winners: 78 },
    { year: 2024, candidates: 799, winners: 74 },
  ],
  constituencies: {},
  candidates: {
    "DL-01": [
      { serialNumber: 1, name: "Praveen Khandelwal", party: "BJP", partySymbol: "🌸", partyColor: "#FF9933" },
      { serialNumber: 2, name: "J.P. Agarwal", party: "INC", partySymbol: "✋", partyColor: "#1E7BC4" },
      { serialNumber: 3, name: "Somnath Bharti", party: "AAP", partySymbol: "🧹", partyColor: "#0066A4" }
    ],
    "UP-01": [
      { serialNumber: 1, name: "Rajnath Singh", party: "BJP", partySymbol: "🌸", partyColor: "#FF9933" },
      { serialNumber: 2, name: "Dimple Yadav", party: "SP", partySymbol: "🚲", partyColor: "#FF0000" }
    ]
  },
  elections: {
    "2024": [
      { party: "BJP", seats: 240 }, { party: "INC", seats: 99 }, { party: "SP", seats: 37 }, { party: "AITC", seats: 29 }
    ]
  }
};
