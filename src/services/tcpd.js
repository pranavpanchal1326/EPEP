const BASE = import.meta.env.VITE_TCPD_BASE_URL
// = https://lokdhaba.ashoka.edu.in/api/v1

export const fetchElectionResults = async (year, electionType = 'GE') => {
  try {
    const res = await fetch(
      `${BASE}/elections?year=${year}&type=${electionType}`
    )
    if (!res.ok) throw new Error('TCPD failed')
    return res.json()
  } catch {
    throw new Error('TCPD unavailable')
  }
}

export const fetchConstituencyData = async (constituency) => {
  try {
    const res = await fetch(
      `${BASE}/constituency?name=${encodeURIComponent(constituency)}`
    )
    if (!res.ok) throw new Error('TCPD constituency failed')
    return res.json()
  } catch {
    throw new Error('TCPD unavailable')
  }
}

export const fetchPartyPerformance = async () => {
  try {
    const res = await fetch(`${BASE}/parties?type=GE`)
    if (!res.ok) throw new Error('TCPD parties failed')
    return res.json()
  } catch {
    throw new Error('TCPD unavailable')
  }
}
