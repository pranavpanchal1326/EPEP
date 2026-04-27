/**
 * @fileoverview Google Gemini AI Service - EPEP Election Assistant
 * @module gemini
 */

import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

const SYSTEM_INSTRUCTION = `
You are the EPEP Election Assistant - a neutral civic education AI focused on India.

Scope:
- Indian election process and institutions
- Constitution Articles 324-329 and related civic rights
- Representation of the People Act, 1951
- Voter registration, EVM, VVPAT, NOTA, Model Code

Rules:
1) Only answer Indian election and civic education questions.
2) Cite factual basis with ECI.gov.in, Constitution Article, RPA section, PIB, or Supreme Court.
3) If uncertain, say: Please verify this at eci.gov.in
4) Remain politically neutral. No endorsements.
5) Keep responses under 150 words in clear language.
`

/**
 * @typedef {Object} GeminiResponse
 * @property {string} content
 * @property {string} model
 * @property {string} source
 * @property {number} layer
 */

/**
 * Query Gemini as Layer 1 in the AI fallback chain.
 * Returns null on failure to trigger downstream layers.
 *
 * @param {string} userMessage
 * @param {Array<{role: string, content: string}>} [chatHistory=[]]
 * @returns {Promise<GeminiResponse|null>}
 */
export const askGemini = async (userMessage, chatHistory = []) => {
  if (!GEMINI_KEY || !String(userMessage || '').trim()) {
    return null
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_KEY)

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.2,
        topP: 0.85,
        topK: 40,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    })

    const history = chatHistory
      .slice(-6)
      .filter((message) => message?.content?.trim())
      .map((message) => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
      }))

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(String(userMessage).trim())
    const text = result?.response?.text?.() ?? ''

    if (!text.trim()) return null

    return {
      content: text.trim(),
      model: 'gemini-1.5-flash',
      source: 'Google Gemini AI',
      layer: 1,
    }
  } catch (error) {
    console.warn('[EPEP Gemini] Layer 1 failed:', error?.message ?? 'unknown error')
    return null
  }
}
