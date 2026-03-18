import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testGrounding(modelName) {
  try {
    const res = await ai.models.generateContent({
      model: modelName,
      contents: "What is the latest scheme announced by Modi in India right now?",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    console.log(`[SUCCESS] ${modelName} works with Google Search!`);
    return true;
  } catch (err) {
    console.error(`[FAIL] ${modelName}:`, err.message);
    return false;
  }
}

async function run() {
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-3-flash-preview", "gemini-pro-latest"];
  for (const m of models) {
    await testGrounding(m);
  }
}
run();
