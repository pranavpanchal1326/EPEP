import { useState, useRef, useCallback } from 'react'
import { askGemini } from '../services/gemini'
import { callOpenRouter } from '../services/openrouter'
import { searchQA } from '../data/election-qa'
import { trackEvent } from '../lib/firebase'

const OPENROUTER_MODELS = [
  'google/gemma-3-27b-it',
  'meta-llama/llama-4-maverick',
  'deepseek/deepseek-r2',
]

const extractSource = (text) => {
  const match = text?.match(/\[Source:\s*([^\]]+)\]/i)
  return match ? match[1].trim() : 'ECI.gov.in'
}

const stripSourceTag = (text) => text.replace(/\[Source:\s*[^\]]+\]/gi, '').trim()

const buildMessageId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const useAIChat = () => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const conversationHistory = useRef([])

  const pushHistory = useCallback((role, content) => {
    conversationHistory.current = [...conversationHistory.current, { role, content }].slice(-12)
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

        // Layer 1: Google Gemini direct API.
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
          return
        }

        // Layers 2-4: OpenRouter model rotation.
        for (let index = 0; index < OPENROUTER_MODELS.length; index += 1) {
          const model = OPENROUTER_MODELS[index]
          try {
            const result = await callOpenRouter(model, trimmedInput, chatHistory)
            if (!result?.text?.trim()) continue

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
            return
          } catch {
            continue
          }
        }

        // Layer 5: Local Q&A fallback.
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
      } catch (err) {
        console.error('Chat error:', err)
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
      } finally {
        setIsLoading(false)
      }
    },
    [addMessage, pushHistory]
  )

  const sendSuggestion = useCallback((text) => {
    sendMessage(text)
  }, [sendMessage])

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