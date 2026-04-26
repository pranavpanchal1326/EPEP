/**
 * EPEP EVM Static Fallback Candidate Data
 * NOTE: This data is for educational and illustrative purposes only.
 * Sourced from approximate 2024 Lok Sabha candidate lists.
 */

export const STATIC_CANDIDATES = {
  'MH-01': {
    constituencyName: 'Mumbai North',
    state: 'Maharashtra',
    candidates: [
      { serialNumber: 1, name: 'Piyush Goyal', party: 'Bharatiya Janata Party', partyShort: 'BJP', partySymbol: '🪷', partyColor: '#FF9933' },
      { serialNumber: 2, name: 'Bhushan Patil', party: 'Indian National Congress', partyShort: 'INC', partySymbol: '✋', partyColor: '#19AAED' },
      { serialNumber: 3, name: 'Sonal Patel', party: 'Independent', partyShort: 'IND', partySymbol: '🚜', partyColor: '#6B6560' },
      { serialNumber: 4, name: 'Dinesh Singh', party: 'Bahujan Samaj Party', partyShort: 'BSP', partySymbol: '🐘', partyColor: '#000080' },
    ]
  },
  'DL-01': {
    constituencyName: 'New Delhi',
    state: 'Delhi',
    candidates: [
      { serialNumber: 1, name: 'Bansuri Swaraj', party: 'Bharatiya Janata Party', partyShort: 'BJP', partySymbol: '🪷', partyColor: '#FF9933' },
      { serialNumber: 2, name: 'Somnath Bharti', party: 'Aam Aadmi Party', partyShort: 'AAP', partySymbol: '🧹', partyColor: '#0072B0' },
      { serialNumber: 3, name: 'Raaj Kumar Anand', party: 'Bahujan Samaj Party', partyShort: 'BSP', partySymbol: '🐘', partyColor: '#000080' },
      { serialNumber: 4, name: 'Sanjay Kumar', party: 'Independent', partyShort: 'IND', partySymbol: '🚲', partyColor: '#6B6560' },
    ]
  },
  'UP-73': {
    constituencyName: 'Varanasi',
    state: 'Uttar Pradesh',
    candidates: [
      { serialNumber: 1, name: 'Narendra Modi', party: 'Bharatiya Janata Party', partyShort: 'BJP', partySymbol: '🪷', partyColor: '#FF9933' },
      { serialNumber: 2, name: 'Ajay Rai', party: 'Indian National Congress', partyShort: 'INC', partySymbol: '✋', partyColor: '#19AAED' },
      { serialNumber: 3, name: 'Ather Jamal Lari', party: 'Bahujan Samaj Party', partyShort: 'BSP', partySymbol: '🐘', partyColor: '#000080' },
      { serialNumber: 4, name: 'Gagan Prakash', party: 'Independent', partyShort: 'IND', partySymbol: '🚜', partyColor: '#6B6560' },
    ]
  },
  'TN-01': {
    constituencyName: 'Chennai North',
    state: 'Tamil Nadu',
    candidates: [
      { serialNumber: 1, name: 'Kalanidhi Veeraswamy', party: 'Dravida Munnetra Kazhagam', partyShort: 'DMK', partySymbol: '☀️', partyColor: '#dd1100' },
      { serialNumber: 2, name: 'R.C. Paul Kanagaraj', party: 'Bharatiya Janata Party', partyShort: 'BJP', partySymbol: '🪷', partyColor: '#FF9933' },
      { serialNumber: 3, name: 'R. Manohar', party: 'AIADMK', partyShort: 'ADMK', partySymbol: '🌿', partyColor: '#00b259' },
      { serialNumber: 4, name: 'Amutha A.', party: 'Naam Tamilar Katchi', partyShort: 'NTK', partySymbol: '🐅', partyColor: '#ffff00' },
    ]
  },
  'WB-01': {
    constituencyName: 'Kolkata North',
    state: 'West Bengal',
    candidates: [
      { serialNumber: 1, name: 'Sudip Bandyopadhyay', party: 'All India Trinamool Congress', partyShort: 'TMC', partySymbol: '🌱', partyColor: '#20C646' },
      { serialNumber: 2, name: 'Tapas Roy', party: 'Bharatiya Janata Party', partyShort: 'BJP', partySymbol: '🪷', partyColor: '#FF9933' },
      { serialNumber: 3, name: 'Pradip Bhattacharya', party: 'Indian National Congress', partyShort: 'INC', partySymbol: '✋', partyColor: '#19AAED' },
      { serialNumber: 4, name: 'Sreemanti Roy', party: 'Bahujan Samaj Party', partyShort: 'BSP', partySymbol: '🐘', partyColor: '#000080' },
    ]
  },
};

export const DEFAULT_CONSTITUENCY = 'UP-73';
