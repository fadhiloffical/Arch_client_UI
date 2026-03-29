"use server"

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getAIResponse(message: string, feature: string, language: string) {
  try {
    // --- GOOGLE GEMINI IMPLEMENTATION ---
    // Make sure to add GEMINI_API_KEY to your .env.local file
    if (!process.env.GEMINI_API_KEY) {
      return { 
        reply: language === "en" 
          ? "Please set GEMINI_API_KEY in your .env.local file to test the AI." 
          : "AI പരീക്ഷിക്കുന്നതിന് ദയവായി നിങ്ങളുടെ .env.local ഫയലിൽ GEMINI_API_KEY സജ്ജമാക്കുക." 
      }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const systemPrompt = language === "en"
      ? `You are an expert architect assistant specializing in Kerala home design. The user is configuring the "${feature}" feature. 
      Respond ONLY with a valid JSON object containing exactly two properties:
      "reply": "A brief acknowledgment, insight, and one specific follow-up question (under 3 sentences).",
      "options": ["Option 1", "Option 2", "Option 3"] (Provide 2 to 4 short, clickable responses the user could choose from to answer your question).`
      : `നിങ്ങൾ കേരള ഹോം ഡിസൈനിൽ വിദഗ്ദ്ധനായ ഒരു ആർക്കിടെക്റ്റ് അസിസ്റ്റൻ്റാണ്. ഉപയോക്താവ് "${feature}" കോൺഫിഗർ ചെയ്യുന്നു.
      സാധുവായ JSON ഒബ്ജക്റ്റായി മാത്രം മറുപടി നൽകുക. അതിൽ രണ്ട് പ്രോപ്പർട്ടികൾ ഉണ്ടായിരിക്കണം:
      "reply": "ചെറിയ ഉൾക്കാഴ്ചയും ഒരു തുടർ ചോദ്യവും (3 വാക്യങ്ങളിൽ താഴെ).",
      "options": ["Option 1", "Option 2", "Option 3"] (ഉപയോക്താവിന് നിങ്ങളുടെ ചോദ്യത്തിന് മറുപടിയായി തിരഞ്ഞെടുക്കാവുന്ന 2-4 ചെറിയ ഓപ്ഷനുകൾ).`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(message);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(responseText);
    
    return { reply: parsed.reply, options: parsed.options || [] };

  } catch (error: any) {
    console.error("Chat Action Error:", error)
    return { error: error.message || "Error processing AI response" }
  }
}

export async function getAIFeatureSuggestions(
  styles: string[],
  notes: string,
  language: string
) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { error: "GEMINI_API_KEY is not set." }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const styleText = styles.join(', ');
    const prompt = `
      Based on the user's preferences for a new home in Kerala, generate a list of relevant architectural features.
      User's preferred styles: ${styleText}.
      User's notes: "${notes}".

      Provide a JSON array of objects, where each object represents a feature category.
      Each category object should have "title" (English), "titleMl" (Malayalam), and "items" (an array of feature objects).
      Each feature object in "items" should have "id" (unique snake_case string), "title" (English), "titleMl" (Malayalam), and an "icon" property.
      The value for the "icon" property MUST be the exact PascalCase name of an icon component from the lucide-react library (e.g., "Home", "Utensils", "Sofa", "Trees", "Droplet", "Flame", "Car", "Bed", "Sun", "Wifi"). Choose the most semantically appropriate icon for each feature.

      Include a mix of common and creative features relevant to the user's styles and notes. Example categories: "Traditional & Cultural", "Modern Lifestyle", "Kitchen & Utility", "Technical & Eco-friendly".
      Your entire output must be only the valid JSON array.
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Sanitize the output: Remove markdown blocks or backticks if Gemini includes them
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    let suggestions = JSON.parse(responseText);

    // Safety check: If the AI wrapped the array inside an object (e.g., {"features": [...]})
    if (!Array.isArray(suggestions)) {
      const possibleArray = Object.values(suggestions).find(val => Array.isArray(val));
      if (possibleArray) {
        suggestions = possibleArray;
      }
    }

    return { suggestions };
  } catch (error: any) {
    console.error("AI Feature Suggestion Error:", error);
    return { error: error.message || "Error generating feature suggestions." };
  }
}

export async function generateArchitectSummary(
  projectDetails: {
    styles: string[];
    houseType: string;
    bhk: number;
    sqftRange: [number, number];
    features: string[];
    budgetRange: [number, number];
    notes: string;
  },
  language: string
) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { error: "GEMINI_API_KEY is not set." };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      Act as a Senior Principal Architect. Review the following client requirements for a new home design in Kerala.
      Your entire response must be a single valid JSON object.

      STRICT INSTRUCTION: Base your analysis STRICTLY on the "Client Details" provided below. DO NOT hallucinate, invent, or assume any extra rooms, features, or requirements that the user did not explicitly mention. If a detail is missing, do not guess it.

      Client Details:
      - Styles: ${projectDetails.styles.length > 0 ? projectDetails.styles.join(", ") : "Not specified"}
      - House Type: ${projectDetails.houseType === "single" ? "Single Story" : "Double Story"}
      - Bedrooms: ${projectDetails.bhk} BHK
      - Area: ${projectDetails.sqftRange[0]} to ${projectDetails.sqftRange[1]} Sq.Ft
      - Key Features: ${projectDetails.features.length > 0 ? projectDetails.features.join(", ") : "None specific"}
      - Budget Range: ${projectDetails.budgetRange[0]}L to ${projectDetails.budgetRange[1]}L
      - Additional Notes & Feature Configurations:
      ${projectDetails.notes || "None"}

      The JSON object must have two keys: "brief" and "dxfPlan".

      For the "brief" value, create a comprehensive, highly professional "Requirement Analysis & Architectural Brief" text. Structure it with these sections:
        1. PROJECT OVERVIEW
        2. SPATIAL REQUIREMENTS & ADJACENCIES
        3. DESIGN & AESTHETIC GUIDELINES
        4. MATERIAL & TECHNICAL RECOMMENDATIONS
      Write this brief in ${language === 'ml' ? 'Malayalam' : 'English'}. Use uppercase for headings.

      For the "dxfPlan" value, act as a Senior Architect and Civil Engineer. Generate a highly detailed and logical conceptual floor plan as a valid ASCII DXF (R12 compatible) file string.
      - Deeply integrate ALL the provided "Client Details" (Styles, Bedrooms, Area, Budget, Key Features, and Additional Notes) into the creative spatial design.
      - The total area of all rooms must logically fall within the user's specified range of ${projectDetails.sqftRange[0]} to ${projectDetails.sqftRange[1]} Sq.Ft.
      - Arrange rooms based on expert architectural principles, Vastu Shastra (if implied by the Kerala context), and optimal circulation flow.
      - Include specific distinct areas and boxes for the "Key Features" explicitly requested by the user.
      - For each room and feature, use LINE entities to create accurate bounding boxes proportional to their expected sizes.
      - Inside each box, use a TEXT entity for the room/feature name and another TEXT entity for its approximate dimensions (e.g., 'Master Bedroom' and '(14' x 16')').
      - If the user selected 'Double Story', create separate logical groupings for 'GROUND FLOOR' and 'FIRST FLOOR' within the DXF plan, clearly labeled with TEXT entities.
      - Ensure the output is a raw, valid ASCII DXF string, including HEADER, ENTITIES, and EOF sections, without any extra formatting or markdown.
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(responseText);

    return { brief: parsed.brief, dxfPlan: parsed.dxfPlan };
  } catch (error: any) {
    console.error("AI Summary Error:", error);
    return { error: error.message || "Error generating architect summary." };
  }
}