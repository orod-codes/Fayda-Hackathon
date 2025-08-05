import OpenAI from 'openai';
import db from '../db.js';
import { encrypt } from '../utils/encryption.js';
import fetch from 'node-fetch';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Meditron model configuration
const MEDITRON_CONFIG = {
  model: 'epfl-llm/meditron-7b',
  endpoint: process.env.HUGGINGFACE_ENDPOINT || 'https://api-inference.huggingface.co/models/epfl-llm/meditron-7b',
  apiKey: process.env.HUGGINGFACE_API_KEY
};

// Translation service configuration
const TRANSLATION_CONFIG = {
  amharic: {
    toEnglish: 'Helsinki-NLP/opus-mt-am-en',
    fromEnglish: 'Helsinki-NLP/opus-mt-en-am'
  },
  oromo: {
    toEnglish: 'Helsinki-NLP/opus-mt-om-en',
    fromEnglish: 'Helsinki-NLP/opus-mt-en-om'
  }
};

// Language detection
const detectLanguage = (text) => {
  // Basic language detection based on script/patterns
  const amharicPattern = /[\u1200-\u137F]/; // Ethiopic script
  const oromoPattern = /\b(ani|ati|inni|ishee|nuyi|isin|isaan)\b/i; // Common Oromo pronouns
  
  if (amharicPattern.test(text)) {
    return 'amharic';
  } else if (oromoPattern.test(text)) {
    return 'oromo';
  }
  return 'english';
};

// Translation function
const translateText = async (text, fromLang, toLang) => {
  try {
    if (fromLang === toLang) return text;
    
    let modelName;
    if (fromLang === 'amharic' && toLang === 'english') {
      modelName = TRANSLATION_CONFIG.amharic.toEnglish;
    } else if (fromLang === 'english' && toLang === 'amharic') {
      modelName = TRANSLATION_CONFIG.amharic.fromEnglish;
    } else if (fromLang === 'oromo' && toLang === 'english') {
      modelName = TRANSLATION_CONFIG.oromo.toEnglish;
    } else if (fromLang === 'english' && toLang === 'oromo') {
      modelName = TRANSLATION_CONFIG.oromo.fromEnglish;
    } else {
      return text; // Unsupported translation
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${modelName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 512,
          temperature: 0.3
        }
      })
    });

    const result = await response.json();
    return result[0]?.translation_text || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

// Enhanced Meditron model query
const queryMeditron = async (prompt, medicalContext = '') => {
  try {
    const fullPrompt = `### Medical Context:\n${medicalContext}\n\n### Patient Query:\n${prompt}\n\n### Medical Response:`;
    
    const response = await fetch(MEDITRON_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MEDITRON_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.3,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.1
        }
      })
    });

    const result = await response.json();
    
    if (result.error) {
      console.warn('Meditron API error, falling back to OpenAI:', result.error);
      return null;
    }

    return result[0]?.generated_text?.replace(fullPrompt, '').trim() || null;
  } catch (error) {
    console.error('Meditron query error:', error);
    return null;
  }
};

// Medical entity recognition system prompt
const ENTITY_RECOGNITION_PROMPT = `You are a medical AI assistant specialized in identifying medical entities from patient conversations. 

Your task is to analyze the patient's message and identify any medical conditions, allergies, medications, or symptoms mentioned. Return ONLY a JSON object with the following structure:

{
  "entities": [
    {
      "type": "allergy|condition|prescription|symptom",
      "description": "specific medical entity mentioned",
      "confidence": 0.0-1.0
    }
  ]
}

Only include entities with confidence > 0.7. If no medical entities are found, return {"entities": []}.`;

// Chat response system prompt
const CHAT_RESPONSE_PROMPT = `You are Hakim AI, a helpful and secure medical AI assistant. Your role is to:

1. Answer patient questions based ONLY on the medical information provided to you
2. Do not invent or infer any information not explicitly provided
3. Do not provide medical advice or diagnoses
4. If the user asks something you cannot answer from the provided data, politely state that you do not have that information
5. Frame your answers clearly and simply
6. Always prioritize patient safety and privacy

Current patient context:
- Medical records: {medicalRecords}
- Recent chat history: {chatHistory}

Respond in a helpful, professional manner while maintaining strict adherence to the provided medical information only.`;

// Extract medical entities from patient message
export const extractMedicalEntities = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: ENTITY_RECOGNITION_PROMPT
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;
    const entities = JSON.parse(response);
    
    return entities.entities || [];
  } catch (error) {
    console.error('Entity extraction error:', error);
    return [];
  }
};

// Generate AI chat response
export const generateChatResponse = async (message, userId, sessionId = null) => {
  try {
    // Get patient's medical records
    const medicalRecords = await db.query(
      'SELECT record_type, description FROM Medical_Records WHERE user_id = ? AND is_active = TRUE',
      [userId]
    );

    // Get recent chat history (last 10 messages)
    const chatHistory = sessionId ? await db.query(
      `SELECT role, content_encrypted FROM Chat_Messages 
       WHERE session_id = ? 
       ORDER BY timestamp DESC 
       LIMIT 10`,
      [sessionId]
    ) : [];

    // Decrypt chat history
    const { decrypt } = await import('../utils/encryption.js');
    const decryptedHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: decrypt(msg.content_encrypted)
    })).reverse();

    // Format medical records for context
    const medicalContext = medicalRecords.length > 0 
      ? medicalRecords.map(record => `${record.record_type}: ${record.description}`).join(', ')
      : 'No medical records available';

    // Format chat history for context
    const chatContext = decryptedHistory.length > 0
      ? decryptedHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
      : 'No recent chat history';

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: CHAT_RESPONSE_PROMPT
            .replace('{medicalRecords}', medicalContext)
            .replace('{chatHistory}', chatContext)
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Chat response generation error:', error);
    return "I apologize, but I'm experiencing technical difficulties. Please try again later.";
  }
};

// Generate session summary
export const generateSessionSummary = async (sessionId) => {
  try {
    const messages = await db.query(
      'SELECT role, content_encrypted FROM Chat_Messages WHERE session_id = ? ORDER BY timestamp',
      [sessionId]
    );

    if (messages.length === 0) {
      return null;
    }

    // Decrypt messages
    const { decrypt } = await import('../utils/encryption.js');
    const decryptedMessages = messages.map(msg => ({
      role: msg.role,
      content: decrypt(msg.content_encrypted)
    }));

    const conversation = decryptedMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical AI assistant. Generate a brief, professional summary of this patient consultation. Focus on key topics discussed and any medical concerns raised. Keep it concise and factual."
        },
        {
          role: "user",
          content: `Please summarize this medical consultation:\n\n${conversation}`
        }
      ],
      temperature: 0.2,
      max_tokens: 300,
    });

    const summary = completion.choices[0].message.content;
    return encrypt(summary);
  } catch (error) {
    console.error('Summary generation error:', error);
    return null;
  }
}; 