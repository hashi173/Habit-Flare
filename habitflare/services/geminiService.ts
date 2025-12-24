import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize client only when needed to avoid crash if env missing during render
const getClient = () => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getAIMotivation = async (streakCount: number, habitName?: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Keep pushing! You're doing great.";

  try {
    const prompt = `
      I am building a habit tracker.
      The user has a streak of ${streakCount} days ${habitName ? `on their habit "${habitName}"` : ''}.
      Give me a very short, punchy, inspiring 1-sentence quote or message to keep them going.
      Do not use quotes. Just the text.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Consistenty is key. Keep the fire burning!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Every day counts. Keep the streak alive!";
  }
};
