import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMotivation = async (studentName: string): Promise<string> => {
  if (!apiKey) return "Keep pushing! Your hard work will pay off.";
  
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
  if (!apiKey) return "Focus on solving previous year questions to understand the pattern.";

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
    if (!apiKey) return "Please configure your API Key to use the AI Tutor.";
    
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
