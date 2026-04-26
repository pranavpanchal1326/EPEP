import { useState, useRef, useCallback } from 'react';
import { callAIAssistant } from '../services/openrouter';
import { searchQA } from '../data/election-qa';

const extractSource = (text) => { 
  const match = text?.match(/\[Source:\s*([^ \]]+)\]/i); 
  return match ? match[1] : 'ECI.gov.in'; 
};

export const useAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const conversationHistory = useRef([]);

  const addMessage = useCallback((message) => {
    setMessages(prev => [
      ...prev, 
      { 
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`, 
        timestamp: new Date(), 
        ...message 
      }
    ]);
  }, []);

  const clearChat = useCallback(() => { 
    setMessages([]); 
    conversationHistory.current = []; 
    setError(null); 
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    const trimmedInput = text.trim();
    addMessage({ role: 'user', content: trimmedInput });
    setIsLoading(true); 
    setError(null);
    
    // We send current message to AI assistant (as per current service spec)
    try {
      const result = await callAIAssistant(trimmedInput);
      
      if (result.source === 'ai' && result.text) {
        const source = extractSource(result.text);
        const cleanText = result.text.replace(/\[Source:\s*[^ \]]+\]/i, '').trim();
        const assistantMsg = { 
          role: 'assistant', 
          content: cleanText, 
          source, 
          model: result.model, 
          sourceType: 'ai' 
        };
        addMessage(assistantMsg);
      } else {
        // Fallback to local search
        const localResults = searchQA(trimmedInput);
        const content = localResults.length > 0 
          ? localResults[0].answer 
          : "I couldn't find a specific answer in our local database. Please try rephrasing or visit eci.gov.in for official information.";
        
        const assistantMsg = { 
          role: 'assistant', 
          content, 
          source: localResults[0]?.source || 'ECI.gov.in', 
          model: 'Local Knowledge Base', 
          sourceType: 'local' 
        };
        addMessage(assistantMsg);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Connection interrupted');
      addMessage({ 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Here's what I found in our offline database:", 
        isError: true 
      });
      const localResults = searchQA(trimmedInput);
      if (localResults.length > 0) {
        addMessage({ 
          role: 'assistant', 
          content: localResults[0].answer, 
          source: localResults[0].source, 
          model: 'Local Knowledge Base (Offline)', 
          sourceType: 'local' 
        });
      }
    } finally { 
      setIsLoading(false); 
    }
  }, [addMessage]);

  const sendSuggestion = useCallback((text) => { sendMessage(text); }, [sendMessage]);

  return { 
    messages, 
    isLoading, 
    error, 
    sendMessage, 
    sendSuggestion, 
    clearChat, 
    messageCount: messages.length 
  };
};