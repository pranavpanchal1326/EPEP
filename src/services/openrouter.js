// src/services/openrouter.js

const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions'

const MODELS = [
  'meta-llama/llama-3.1-8b-instruct:free',
  'google/gemma-2-9b-it:free',
  'deepseek/deepseek-chat:free'
]

const SYSTEM_PROMPT = "You are an expert on Indian elections and the Election Commission of India. Only answer questions about Indian elections, ECI, voting process, and electoral law. Always cite your source: ECI.gov.in, Constitution of India Article X, or PIB. If unsure, say 'Please verify at eci.gov.in' — never guess. Never express political opinions or favour any party. Keep answers under 150 words — clear and simple.";

export const callAIAssistant = async (userMessage) => {
  const apiKey = import.meta?.env?.VITE_OPENROUTER_API_KEY
  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    return { text: null, source: 'fallback' }
  }

  for (const model of MODELS) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'Content-Type': 'application/json',
          'HTTP-Referer': import.meta.env.VITE_APP_URL || 'https://epep.vercel.app',
          'X-Title': 'EPEP Election Assistant'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 300,
          temperature: 0.3
        })
      });

      if (!response.ok) throw new Error('HTTP ' + response.status);

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        throw new Error('Empty response');
      }

      return {
        text: data.choices[0].message.content,
        model,
        source: 'ai'
      };

    } catch (err) {
      console.warn('Model ' + model + ' failed:', err.message);
      continue;
    }
  }

  return { text: null, source: 'fallback' };
};