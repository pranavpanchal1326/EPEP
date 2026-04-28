import { isValidAPIResponse } from '../lib/sanitise'
import {
  AI_MAX_RESPONSE_WORDS,
  AI_CHAT_HISTORY_LIMIT,
  AI_TEMPERATURE,
  AI_MODELS,
} from '../data/constants'

/**
 * @fileoverview OpenRouter AI Service — EPEP Fallback Chain
 * @module openrouter
 *
 * Provides access to multiple AI models via OpenRouter API.
 * Serves as Layers 2-4 in the EPEP AI fallback chain.
 *
 * Model rotation order:
 *   Layer 2 → google/gemma-3-27b-it    (Google Gemma)
 *   Layer 3 → meta-llama/llama-4-maverick
 *   Layer 4 → deepseek/deepseek-r2
 *
 * Each model is tried in sequence. On failure, the next model
 * activates automatically. If all fail, Layer 5 (local Q&A) is used.
 *
 * @see https://openrouter.ai/docs
 * @see src/services/gemini.js  — Layer 1 (Google Gemini direct)
 * @see src/data/election-qa.js — Layer 5 (offline fallback)
 */

const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions'

const MODELS = AI_MODELS

const SYSTEM_PROMPT = `You are an expert on Indian elections and the Election Commission of India. Only answer questions about Indian elections, ECI, voting process, and electoral law. Always cite your source: ECI.gov.in, Constitution of India Article X, or PIB. If unsure, say 'Please verify at eci.gov.in' and never guess. Never express political opinions or favor any party. Keep answers under ${AI_MAX_RESPONSE_WORDS} words and easy to understand.`

/**
 * Call a specific AI model via OpenRouter API.
 *
 * @param {string}   model       - OpenRouter model identifier
 * @param {string}   message     - User's election question
 * @param {Array}    [history]   - Prior conversation messages
 * @returns {Promise<string|null>} AI response text or null on failure
 * @throws {Error}                 On API failure — caller handles rotation
 *
 * @example
 * const response = await callOpenRouter(
 *   'google/gemma-3-27b-it',
 *   'What is Article 324?'
 * )
 */
export const callOpenRouter = async (model, userMessage, chatHistory = []) => {
  try {
    const apiKey = import.meta?.env?.VITE_OPENROUTER_API_KEY
    if (!apiKey || apiKey === 'your_openrouter_key_here') {
      console.warn('[EPEP OpenRouter] callOpenRouter failed:', 'OpenRouter API key missing')
      return null
    }

    const historyMessages = chatHistory
      .slice(-AI_CHAT_HISTORY_LIMIT)
      .filter((message) => message?.content?.trim())
      .map((message) => ({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content,
      }))

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
        temperature: AI_TEMPERATURE,
      }),
    })

    if (!response.ok) {
      console.warn('[EPEP OpenRouter] callOpenRouter failed:', `HTTP ${response.status}`)
      return null
    }

    const data = await response.json()
    if (!isValidAPIResponse(data, ['choices']) || !data.choices?.[0]?.message?.content) {
      console.warn('[EPEP OpenRouter] callOpenRouter failed:', 'Empty response')
      return null
    }

    return {
      text: data.choices[0].message.content,
      model,
      source: 'ai',
    }
  } catch (err) {
    console.error('[EPEP OpenRouter] callOpenRouter failed:', err.message)
    return null
  }
}

/**
 * Call the OpenRouter assistant with model rotation fallback.
 *
 * @param {string} message - User's election question
 * @returns {Promise<{text: string | null, source: string}>} AI response object
 */
export const callAIAssistant = async (userMessage) => {
  try {
    for (const model of MODELS) {
      const result = await callOpenRouter(model, userMessage)
      if (result?.text) return result
    }
    return { text: null, source: 'fallback' }
  } catch (err) {
    console.error('[EPEP OpenRouter] callAIAssistant failed:', err.message)
    return { text: null, source: 'fallback' }
  }
}
