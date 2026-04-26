const BASE = import.meta.env.VITE_DATA_GOV_BASE_URL
const KEY = import.meta.env.VITE_DATA_GOV_API_KEY

// Voter turnout by year
export const fetchTurnoutData = async () => {
  const res = await fetch(
    `${BASE}/7c0e8f27-e6c3-4d4b-b4d2-1b73e5d06b02?api-key=${KEY}&format=json&limit=20`
  )
  if (!res.ok) throw new Error('data.gov.in failed')
  return res.json()
}

// State wise election data
export const fetchStateData = async (state) => {
  const res = await fetch(
    `${BASE}/3a1ab4d0-b3a4-4c3b-b6b6-4d3e9a4c2a1b?api-key=${KEY}&format=json&filters[state_name]=${state}`
  )
  if (!res.ok) throw new Error('data.gov.in state fetch failed')
  return res.json()
}
