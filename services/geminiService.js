import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-1.5-flash-8b';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

export const formatCvWithGemini = async (rawText) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured in the .env file.');
  }

  const prompt = `
You are an expert CV formatter for a high-end recruitment agency.
Your task is to take the raw CV text and improve its structure, language, and formatting 
according to the rules below, but return ONLY your formatted output — no markdown, no code fences.

📌 Formatting Rules:
1. Keep a clean, professional CV style.
2. Use bullet points for experience, skills, and interests.
3. Rewrite sentences to be concise and action-oriented.
4. Ensure consistency in date formats (3-letter month + year).
5. Remove filler phrases like "I am responsible for" and replace with strong action verbs.

📄 Raw CV Text:
---
${rawText}
---
`;

  try {
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error Response:', errorBody);
      throw new Error(`Gemini API request failed with status ${response.status}`);
    }

    const data = await response.json();
    let outputText = data.candidates[0].content.parts[0].text.trim();

    if (outputText.startsWith('```')) {
      outputText = outputText.replace(/^```[a-z]*\n/, '').replace(/```$/, '').trim();
    }

    return outputText;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to format CV using AI. Please check the server logs.');
  }
};
