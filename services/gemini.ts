import { GoogleGenAI } from "@google/genai";

// Helper to get safe API key without crashing
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

const getAiClient = () => {
  const key = getApiKey();
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
};

export const generateMotivation = async (studentName: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Keep pushing! Your hard work will pay off.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, powerful, 2-sentence motivational quote specifically for an IIT JEE aspirant named ${studentName}. Focus on discipline and consistency.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Success is the sum of small efforts, repeated day in and day out.";
  }
};

export const generateStudyTip = async (subject: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Focus on solving previous year questions to understand the pattern.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give me one high-yield specific study tip for JEE Advanced level ${subject}. Keep it under 50 words.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Review your mistake notebook daily.";
  }
};

export const askTutor = async (question: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "Please configure your API Key to use the AI Tutor. (Mock Mode: Active)";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert IIT JEE tutor. Answer the following student question concisely and accurately: "${question}"`,
        });
        return response.text;
    } catch (error) {
        return "Sorry, I couldn't reach the AI tutor right now.";
    }
}