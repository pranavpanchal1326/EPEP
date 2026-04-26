/**
 * EPEP Dashboard Static Fallback Data
 * Offline-first source of truth for election history.
 * Sources: ECI, TCPD, and National Election Studies.
 */

export const TURNOUT_DATA = [
  { year: 1951, turnout: 44.87, totalVoters: 173.2, totalVotes: 77.7, phases: 1 },
  { year: 1957, turnout: 47.74, totalVoters: 193.7, totalVotes: 92.4, phases: 1 },
  { year: 1962, turnout: 55.42, totalVoters: 216.4, totalVotes: 119.9, phases: 1 },
  { year: 1967, turnout: 61.04, totalVoters: 250.2, totalVotes: 152.7, phases: 1 },
  { year: 1971, turnout: 55.27, totalVoters: 274.2, totalVotes: 151.5, phases: 1 },
  { year: 1977, turnout: 60.49, totalVoters: 321.2, totalVotes: 194.3, phases: 1 },
  { year: 1980, turnout: 56.92, totalVoters: 356.2, totalVotes: 202.7, phases: 1 },
  { year: 1984, turnout: 63.56, totalVoters: 400.3, totalVotes: 254.4, phases: 1 },
  { year: 1989, turnout: 61.95, totalVoters: 498.9, totalVotes: 309.0, phases: 1 },
  { year: 1991, turnout: 56.73, totalVoters: 511.5, totalVotes: 290.1, phases: 1 },
  { year: 1996, turnout: 57.94, totalVoters: 592.6, totalVotes: 343.3, phases: 1 },
  { year: 1998, turnout: 61.97, totalVoters: 605.9, totalVotes: 375.4, phases: 1 },
  { year: 1999, turnout: 59.99, totalVoters: 619.5, totalVotes: 371.6, phases: 1 },
  { year: 2004, turnout: 58.07, totalVoters: 671.5, totalVotes: 389.9, phases: 4 },
  { year: 2009, turnout: 58.19, totalVoters: 717.0, totalVotes: 417.2, phases: 5 },
  { year: 2014, turnout: 66.38, totalVoters: 834.1, totalVotes: 553.8, phases: 9 },
  { year: 2019, turnout: 67.11, totalVoters: 911.9, totalVotes: 611.4, phases: 7 },
  { year: 2024, turnout: 65.79, totalVoters: 968.8, totalVotes: 636.8, phases: 7 }
];

export const PARTY_SEATS_DATA = [
  { year: 1977, INC: 154, BJP: 0, BSP: 0, SP: 0, CPI: 7, CPM: 22, NCP: 0, AAP: 0, Others: 360 },
  { year: 1980, INC: 353, BJP: 0, BSP: 0, SP: 0, CPI: 11, CPM: 37, NCP: 0, AAP: 0, Others: 142 },
  { year: 1984, INC: 404, BJP: 2, BSP: 0, SP: 0, CPI: 6, CPM: 22, NCP: 0, AAP: 0, Others: 109 },
  { year: 1989, INC: 197, BJP: 85, BSP: 3, SP: 0, CPI: 12, CPM: 33, NCP: 0, AAP: 0, Others: 213 },
  { year: 1991, INC: 232, BJP: 120, BSP: 1, SP: 0, CPI: 14, CPM: 35, NCP: 0, AAP: 0, Others: 111 },
  { year: 1996, INC: 140, BJP: 161, BSP: 11, SP: 17, CPI: 12, CPM: 32, NCP: 0, AAP: 0, Others: 130 },
  { year: 1998, INC: 141, BJP: 182, BSP: 5, SP: 20, CPI: 9, CPM: 32, NCP: 0, AAP: 0, Others: 154 },
  { year: 1999, INC: 114, BJP: 182, BSP: 14, SP: 26, CPI: 4, CPM: 33, NCP: 8, AAP: 0, Others: 162 },
  { year: 2004, INC: 145, BJP: 138, BSP: 19, SP: 36, CPI: 10, CPM: 43, NCP: 9, AAP: 0, Others: 143 },
  { year: 2009, INC: 206, BJP: 116, BSP: 21, SP: 23, CPI: 4, CPM: 16, NCP: 9, AAP: 0, Others: 148 },
  { year: 2014, INC: 44, BJP: 282, BSP: 0, SP: 5, CPI: 1, CPM: 9, NCP: 6, AAP: 4, Others: 192 },
  { year: 2019, INC: 52, BJP: 303, BSP: 10, SP: 5, CPI: 2, CPM: 3, NCP: 5, AAP: 1, Others: 162 },
  { year: 2024, INC: 99, BJP: 240, BSP: 0, SP: 37, CPI: 2, CPM: 4, NCP: 1, AAP: 3, Others: 157 }
];

export const WOMEN_DATA = [
  { year: 1957, candidates: 45, winners: 22, winRate: 48.89, totalSeats: 494, womenPercent: 4.45 },
  { year: 1962, candidates: 65, winners: 31, winRate: 47.69, totalSeats: 494, womenPercent: 6.28 },
  { year: 1967, candidates: 67, winners: 29, winRate: 43.28, totalSeats: 520, womenPercent: 5.58 },
  { year: 1971, candidates: 86, winners: 21, winRate: 24.42, totalSeats: 518, womenPercent: 4.05 },
  { year: 1977, candidates: 70, winners: 19, winRate: 27.14, totalSeats: 542, womenPercent: 3.51 },
  { year: 1980, candidates: 142, winners: 28, winRate: 19.72, totalSeats: 542, womenPercent: 5.17 },
  { year: 1984, candidates: 164, winners: 43, winRate: 26.22, totalSeats: 542, womenPercent: 7.93 },
  { year: 1989, candidates: 198, winners: 27, winRate: 13.64, totalSeats: 529, womenPercent: 5.10 },
  { year: 1991, candidates: 325, winners: 39, winRate: 12.00, totalSeats: 521, womenPercent: 7.49 },
  { year: 1996, candidates: 599, winners: 40, winRate: 6.68, totalSeats: 543, womenPercent: 7.37 },
  { year: 1998, candidates: 274, winners: 43, winRate: 15.69, totalSeats: 543, womenPercent: 7.92 },
  { year: 1999, candidates: 284, winners: 49, winRate: 17.25, totalSeats: 543, womenPercent: 9.02 },
  { year: 2004, candidates: 355, winners: 45, winRate: 12.68, totalSeats: 543, womenPercent: 8.29 },
  { year: 2009, candidates: 552, winners: 59, winRate: 10.69, totalSeats: 543, womenPercent: 10.87 },
  { year: 2014, candidates: 668, winners: 62, winRate: 9.28, totalSeats: 543, womenPercent: 11.42 },
  { year: 2019, candidates: 726, winners: 78, winRate: 10.74, totalSeats: 543, womenPercent: 14.36 },
  { year: 2024, candidates: 797, winners: 74, winRate: 9.28, totalSeats: 543, womenPercent: 13.63 }
];

export const STATE_TURNOUT_DATA = [
  { state: "Andhra Pradesh", stateCode: "AP", turnout: 80.66, seats: 25, region: "South" },
  { state: "Arunachal Pradesh", stateCode: "AR", turnout: 82.71, seats: 2, region: "NE" },
  { state: "Assam", stateCode: "AS", turnout: 81.56, seats: 14, region: "NE" },
  { state: "Bihar", stateCode: "BR", turnout: 56.19, seats: 40, region: "East" },
  { state: "Chhattisgarh", stateCode: "CT", turnout: 72.17, seats: 11, region: "Central" },
  { state: "Goa", stateCode: "GA", turnout: 76.41, seats: 2, region: "West" },
  { state: "Gujarat", stateCode: "GJ", turnout: 60.13, seats: 26, region: "West" },
  { state: "Haryana", stateCode: "HR", turnout: 64.80, seats: 10, region: "North" },
  { state: "Himachal Pradesh", stateCode: "HP", turnout: 70.90, seats: 4, region: "North" },
  { state: "Jharkhand", stateCode: "JH", turnout: 66.19, seats: 14, region: "East" },
  { state: "Karnataka", stateCode: "KA", turnout: 70.64, seats: 28, region: "South" },
  { state: "Kerala", stateCode: "KL", turnout: 71.27, seats: 20, region: "South" },
  { state: "Madhya Pradesh", stateCode: "MP", turnout: 66.87, seats: 29, region: "Central" },
  { state: "Maharashtra", stateCode: "MH", turnout: 61.39, seats: 48, region: "West" },
  { state: "Manipur", stateCode: "MN", turnout: 78.53, seats: 2, region: "NE" },
  { state: "Meghalaya", stateCode: "ML", turnout: 76.60, seats: 2, region: "NE" },
  { state: "Mizoram", stateCode: "MZ", turnout: 56.87, seats: 1, region: "NE" },
  { state: "Nagaland", stateCode: "NL", turnout: 57.72, seats: 1, region: "NE" },
  { state: "Odisha", stateCode: "OR", turnout: 74.44, seats: 21, region: "East" },
  { state: "Punjab", stateCode: "PB", turnout: 62.80, seats: 13, region: "North" },
  { state: "Rajasthan", stateCode: "RJ", turnout: 61.34, seats: 25, region: "West" },
  { state: "Sikkim", stateCode: "SK", turnout: 79.88, seats: 1, region: "NE" },
  { state: "Tamil Nadu", stateCode: "TN", turnout: 69.72, seats: 39, region: "South" },
  { state: "Telangana", stateCode: "TG", turnout: 65.67, seats: 17, region: "South" },
  { state: "Tripura", stateCode: "TR", turnout: 80.92, seats: 2, region: "NE" },
  { state: "Uttar Pradesh", stateCode: "UP", turnout: 56.92, seats: 80, region: "North" },
  { state: "Uttarakhand", stateCode: "UT", turnout: 57.15, seats: 5, region: "North" },
  { state: "West Bengal", stateCode: "WB", turnout: 79.29, seats: 42, region: "East" },
  { state: "Andaman & Nicobar", stateCode: "AN", turnout: 63.99, seats: 1, region: "South" },
  { state: "Chandigarh", stateCode: "CH", turnout: 67.98, seats: 1, region: "North" },
  { state: "Dadra & NH and Daman & Diu", stateCode: "DN", turnout: 71.31, seats: 2, region: "West" },
  { state: "Delhi", stateCode: "DL", turnout: 58.69, seats: 7, region: "North" },
  { state: "Jammu & Kashmir", stateCode: "JK", turnout: 58.46, seats: 5, region: "North" },
  { state: "Ladakh", stateCode: "LA", turnout: 71.82, seats: 1, region: "North" },
  { state: "Lakshadweep", stateCode: "LD", turnout: 84.16, seats: 1, region: "South" },
  { state: "Puducherry", stateCode: "PY", turnout: 78.90, seats: 1, region: "South" }
];

export const DASHBOARD_META = {
  lastUpdated: "2024-06-04",
  dataSource: "TCPD Lok Dhaba + ECI",
  totalElections: 18,
  yearsSpan: "1951-2024",
  disclaimer: "Data sourced from TCPD and ECI official records."
};

export const FILTER_OPTIONS = {
  years: [1977, 1980, 1984, 1989, 1991, 1996, 1998, 1999, 2004, 2009, 2014, 2019, 2024],
  parties: ["INC", "BJP", "BSP", "SP", "CPI", "CPM", "NCP", "AAP"],
  regions: ["North", "South", "East", "West", "Central", "NE"],
  electionTypes: ["Lok Sabha"]
};