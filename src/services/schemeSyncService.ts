import { GoogleGenAI } from "@google/genai";
import { Scheme } from "../types";

export async function fetchRealtimeSchemes(category: string, state?: string): Promise<Partial<Scheme>[]> {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  
  try {
    const politicalContext = `Context for 2026: Many state governments changed recently. Telangana is now Congress (exclude BRS schemes like Dalit Bandhu). Andhra Pradesh is now TDP/JanaSena/BJP (exclude YSRCP schemes like Jagananna Vidya Deevena). Rajasthan, MP, Chhattisgarh, Odisha are BJP. Karnataka, HP are Congress.`;
    
    const query = state 
      ? `You are an expert on current Indian Government Policies as of the year 2026. ${politicalContext}\nFetch the latest 5 currently ACTIVE and ONGOING government schemes (mix of Central and State-specific) for the state of ${state} in the category: ${category}. CRITICAL: Do NOT include any scrapped or discontinued schemes from previous state governments. Only list schemes actively accepting applications under the current government.`
      : `You are an expert on current Indian Government Policies as of the year 2026. ${politicalContext}\nFetch the latest 5 currently ACTIVE and ONGOING Indian government schemes (mix of Central and State government schemes) for the category: ${category}. CRITICAL: Do NOT include any scrapped, renamed, or discontinued schemes. Only list schemes actively accepting applications under the current government administration.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `${query} 
      Focus on data from official portals like myscheme.gov.in, india.gov.in, or state-specific official portals.
      Return the data in a structured format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              schemeName: { type: "STRING" },
              ministry: { type: "STRING" },
              description: { type: "STRING" },
              benefits: { type: "STRING" },
              officialWebsiteLink: { type: "STRING" },
              lastUpdated: { type: "STRING" },
              category: { type: "STRING" }
            },
            required: ["schemeName", "ministry", "description", "officialWebsiteLink"]
          }
        }
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("Error fetching realtime schemes:", error);
    return [];
  }
}
