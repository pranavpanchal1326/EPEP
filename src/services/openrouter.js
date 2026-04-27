// src/services/openrouter.js

import { isValidAPIResponse } from '../lib/sanitise'

const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions'

const MODELS = [
  'google/gemma-3-27b-it',
  'meta-llama/llama-4-maverick',
  'deepseek/deepseek-r2',
]

const SYSTEM_PROMPT = "You are an expert on Indian elections and the Election Commission of India. Only answer questions about Indian elections, ECI, voting process, and electoral law. Always cite your source: ECI.gov.in, Constitution of India Article X, or PIB. If unsure, say 'Please verify at eci.gov.in' and never guess. Never express political opinions or favor any party. Keep answers under 150 words and easy to understand."

export const callOpenRouter = async (model, userMessage, chatHistory = []) => {
  const apiKey = import.meta?.env?.VITE_OPENROUTER_API_KEY
  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    throw new Error('OpenRouter API key missing')
  }

  const historyMessages = chatHistory
    .slice(-6)
    .filter((message) => message?.content?.trim())
    .map((message) => ({ role: message.role === 'assistant' ? 'assistant' : 'user', content: message.content }))

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
      'HTTP-Referer': import.meta.env.VITE_APP_URL || 'https://epep.vercel.app',
      'X-Title': 'EPEP Election Assistant',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...historyMessages,
        { role: 'user', content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.2,
    }),
  })

  if (!response.ok) {
    throw new Error('HTTP ' + response.status)
  }

  const data = await response.json()
  if (!isValidAPIResponse(data, ['choices']) || !data.choices?.[0]?.message?.content) {
    throw new Error('Empty response')
  }

  return {
    text: data.choices[0].message.content,
    model,
    source: 'ai',
  }
}

export const callAIAssistant = async (userMessage) => {
  const apiKey = import.meta?.env?.VITE_OPENROUTER_API_KEY
  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    return { text: null, source: 'fallback' }
  }

  for (const model of MODELS) {
    try {
      return await callOpenRouter(model, userMessage)
    } catch (err) {
      console.warn('Model ' + model + ' failed:', err.message)
      continue
    }
  }

  return { text: null, source: 'fallback' }
}