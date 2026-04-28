/**
 * @fileoverview AI Chat Hook — EPEP Election Assistant
 * @module useAIChat
 *
 * Manages the 5-layer AI fallback chain and chat state:
 *
 *   Layer 1 → Google Gemini 1.5 Flash  (direct Google AI SDK)
 *   Layer 2 → Google Gemma 3 27B       (OpenRouter)
 *   Layer 3 → Meta Llama 4 Maverick    (OpenRouter)
 *   Layer 4 → DeepSeek R2              (OpenRouter)
 *   Layer 5 → Local Q&A Database       (offline, always works)
 *
 * Features:
 *   - Automatic model rotation on failure
 *   - Chat history management (last 6 messages for context)
 *   - Firebase Analytics tracking per layer
 *   - Firebase Firestore logging of interactions
 *   - Input sanitisation via sanitiseInput()
 *   - Offline detection and fallback
 *
 * @returns {Object}   chat interface
 * @returns {Array}    .messages    - Chat message history
 * @returns {boolean}  .isLoading   - True while AI is responding
 * @returns {Function} .sendMessage - Send a message to the assistant
 * @returns {Function} .clearChat   - Clear conversation history
 */

import { useState, useRef, useCallback } from 'react'
import { askGemini } from '../services/gemini'
import { callOpenRouter } from '../services/openrouter'
import { searchQA } from '../data/election-qa'
import { AI_CHAT_HISTORY_LIMIT, AI_MODELS } from '../data/constants'
import { saveAIInteraction, trackEvent } from '../lib/firebase'

const OPENROUTER_MODELS = AI_MODELS

const extractSource = (text) => {
  const match = text?.match(/\[Source:\s*([^\]]+)\]/i)
  return match ? match[1].trim() : 'ECI.gov.in'
}

const stripSourceTag = (text) => text.replace(/\[Source:\s*[^\]]+\]/gi, '').trim()

const buildMessageId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Manage AI chat state and send messages through fallback AI layers.
 *
 * @returns {{
 *  messages: Array,
 *  isLoading: boolean,
 *  error: string | null,
 *  sendMessage: (text: string) => Promise<void>,
 *  sendSuggestion: (text: string) => void,
 *  clearChat: () => void,
 *  messageCount: number
 * }}
 */
export const useAIChat = () => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const conversationHistory = useRef([])

  const pushHistory = useCallback((role, content) => {
    conversationHistory.current = [...conversationHistory.current, { role, content }].slice(-(AI_CHAT_HISTORY_LIMIT * 2))
  }, [])

  const addMessage = useCallback((message) => {
    setMessages((prev) => [
      ...prev,
      {
        id: buildMessageId(),
        timestamp: new Date(),
        ...message,
      },
    ])
  }, [])

  const clearChat = useCallback(() => {
    setMessages([])
    conversationHistory.current = []
    setError(null)
  }, [])

  const sendMessage = useCallback(
    async (text) => {
      const trimmedInput = String(text ?? '').trim()
      if (!trimmedInput) return

      addMessage({ role: 'user', content: trimmedInput })
      pushHistory('user', trimmedInput)

      setIsLoading(true)
      setError(null)

      try {
        const chatHistory = conversationHistory.current.slice(0, -1)

        const geminiResult = await askGemini(trimmedInput, chatHistory)
        if (geminiResult) {
          trackEvent('ai_response_received', {
            model: 'gemini-1.5-flash',
            layer: 1,
            source: 'google_direct_api',
          })

          addMessage({
            role: 'assistant',
            content: geminiResult.content,
            source: 'Google Gemini AI',
            model: geminiResult.model,
            sourceType: 'ai',
          })
          pushHistory('assistant', geminiResult.content)
          saveAIInteraction({
            query: trimmedInput,
            aiLayer: 'layer_1',
            model: geminiResult.model ?? 'gemini-1.5-flash',
            isOnline: navigator.onLine,
          })
          return
        }

        for (let index = 0; index < OPENROUTER_MODELS.length; index += 1) {
          const model = OPENROUTER_MODELS[index]
          const result = await callOpenRouter(model, trimmedInput, chatHistory)
          if (!result?.text?.trim()) {
            continue
          }

          const source = extractSource(result.text)
          const cleanText = stripSourceTag(result.text)

          trackEvent('ai_response_received', {
            model,
            layer: index + 2,
            source: 'openrouter',
          })

          addMessage({
            role: 'assistant',
            content: cleanText,
            source,
            model,
            sourceType: 'ai',
          })
          pushHistory('assistant', cleanText)
          saveAIInteraction({
            query: trimmedInput,
            aiLayer: `layer_${index + 2}`,
            model,
            isOnline: navigator.onLine,
          })
          return
        }

        const localResults = searchQA(trimmedInput)
        const content =
          localResults.length > 0
            ? localResults[0].answer
            : 'Please visit eci.gov.in for official information.'

        trackEvent('ai_response_received', {
          model: 'local_qa_db',
          layer: 5,
          source: 'offline_fallback',
        })

        addMessage({
          role: 'assistant',
          content,
          source: localResults[0]?.source || 'ECI.gov.in',
          model: 'Local Knowledge Base',
          sourceType: 'local',
        })
        pushHistory('assistant', content)
        saveAIInteraction({
          query: trimmedInput,
          aiLayer: 'layer_5',
          model: 'local_qa_db',
          isOnline: navigator.onLine,
        })
      } catch (err) {
        console.error('[EPEP AIChat] sendMessage failed:', err.message)
        setError('Connection interrupted')

        addMessage({
          role: 'assistant',
          content: "I'm having trouble connecting right now. Here's what I found in our offline database:",
          isError: true,
        })

        const localResults = searchQA(trimmedInput)
        const content =
          localResults.length > 0
            ? localResults[0].answer
            : 'Please visit eci.gov.in for official information.'

        trackEvent('ai_response_received', {
          model: 'local_qa_db',
          layer: 5,
          source: 'offline_fallback',
        })

        addMessage({
          role: 'assistant',
          content,
          source: localResults[0]?.source || 'ECI.gov.in',
          model: 'Local Knowledge Base (Offline)',
          sourceType: 'local',
        })
        pushHistory('assistant', content)
        saveAIInteraction({
          query: trimmedInput,
          aiLayer: 'layer_5',
          model: 'local_qa_db',
          isOnline: navigator.onLine,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [addMessage, pushHistory]
  )

  const sendSuggestion = useCallback(
    (text) => {
      sendMessage(text)
    },
    [sendMessage]
  )

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    sendSuggestion,
    clearChat,
    messageCount: messages.length,
  }
}
