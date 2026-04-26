const BASE = import.meta.env.VITE_MYNETA_BASE_URL
// = https://myneta.info/api

export const fetchCandidates = async (constituency, year = 2024) => {
  try {
    const res = await fetch(
      `${BASE}/candidates?constituency=${encodeURIComponent(constituency)}&year=${year}`
    )
    if (!res.ok) throw new Error('MyNeta failed')
    return res.json()
  } catch {
    throw new Error('MyNeta unavailable')
  }
}

export const fetchCandidateDetail = async (candidateId) => {
  try {
    const res = await fetch(`${BASE}/candidate/${candidateId}`)
    if (!res.ok) throw new Error('MyNeta detail failed')
    return res.json()
  } catch {
    throw new Error('MyNeta unavailable')
  }
}
