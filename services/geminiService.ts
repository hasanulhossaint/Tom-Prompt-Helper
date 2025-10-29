import { GoogleGenAI, Type } from "@google/genai";
import type { PromptConfig, AnalysisResult, RewriteVariations } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder for environments where the API key is not set.
  // The execution environment is expected to have this variable.
  console.warn("API_KEY environment variable not set. Using a dummy key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const callGemini = async (prompt: string, config?: any) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            ...config
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The AI service failed to respond. Please check your connection or API key.");
    }
};

export const generatePrompt = async (config: PromptConfig): Promise<string> => {
  const {
    instruction, promptType, tone, writingStyle, audience,
    outputFormat, detailLevel, context, keywords, language, optimizationMode
  } = config;

  const detailDescription = {
    simple: 'short, direct, and to the point',
    moderate: 'moderately detailed, providing some context and examples',
    advanced: 'highly specific, advanced, providing ample context, constraints, and examples',
  };
  
  const optimizationInstruction = optimizationMode !== 'none' 
    ? `After generating the prompt, perform one final optimization pass to enhance its ${optimizationMode}.` 
    : '';

  const metaPrompt = `
    You are an expert prompt engineer. Your task is to generate a detailed, effective, and specific prompt for another AI model based on the user's instructions and parameters.

    User's core instruction: "${instruction}"

    Generate a prompt that adheres to the following criteria:
    - **Prompt Type**: The goal is to create a prompt for ${promptType}.
    - **Tone**: The desired tone is ${tone}.
    - **Writing Style**: The style should be ${writingStyle}.
    - **Target Audience**: The prompt should be tailored for a/an ${audience} audience.
    - **Desired Output Format**: The AI should produce its response as a ${outputFormat}.
    - **Detail Level**: The prompt's complexity should be: ${detailDescription[detailLevel]}.
    - **Language**: The final prompt must be written in ${language}.
    ${context ? `- **Context/System Role**: The AI should adopt the persona or role of: "${context}".` : ''}
    ${keywords ? `- **Keyword Emphasis**: The following keywords or concepts MUST be central to the prompt and its output: ${keywords}.` : ''}

    ---
    INSTRUCTIONS:
    1. Synthesize all the above requirements into a single, cohesive prompt.
    2. The generated prompt should be clear, unambiguous, and provide enough detail for an AI to generate a high-quality response.
    3. ${optimizationInstruction}
    4. Generate ONLY the final prompt text. Do not include any explanations, introductions, conversational text, or markdown formatting like \`\`\`prompt. The output must be ready to be copied and pasted directly into another AI tool.
  `;

  return callGemini(metaPrompt);
};

export const analyzePrompt = async (prompt: string): Promise<AnalysisResult> => {
  const analysisMetaPrompt = `
    You are a prompt engineering analyst. Analyze the following AI prompt and return a JSON object with your analysis.

    Prompt to analyze: "${prompt}"

    Your analysis must include:
    1.  **clarity**: A score from 1 to 10 on how clear and easy to understand the prompt is.
    2.  **specificity**: A score from 1 to 10 on how specific and detailed the prompt is.
    3.  **context**: A score from 1 to 10 on how well the prompt provides necessary context for the AI.
    4.  **bias**: A score from 1 to 10 on how neutral the prompt is (10 being most neutral, 1 being very biased).
    5.  **suggestions**: An array of 2-3 short, actionable string suggestions for improving the prompt.

    Return ONLY the raw JSON object.
  `;
  
  const responseText = await callGemini(analysisMetaPrompt, {
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          clarity: { type: Type.NUMBER },
          specificity: { type: Type.NUMBER },
          context: { type: Type.NUMBER },
          bias: { type: Type.NUMBER },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["clarity", "specificity", "context", "bias", "suggestions"],
      }
    }
  });

  return JSON.parse(responseText);
};

export const rewritePrompt = async (prompt: string): Promise<RewriteVariations> => {
    const rewriteMetaPrompt = `
        You are an expert prompt rewriter. Rewrite the following prompt in three different styles and return a JSON object.

        Original prompt: "${prompt}"

        Rewrite the prompt in the following styles:
        1.  **creative**: Make it more imaginative and inspiring.
        2.  **concise**: Make it shorter and more direct without losing key details.
        3.  **technical**: Make it more formal, specific, and suitable for a technical or expert model.

        Return ONLY the raw JSON object with keys "creative", "concise", and "technical".
    `;
    
    const responseText = await callGemini(rewriteMetaPrompt, {
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    creative: { type: Type.STRING },
                    concise: { type: Type.STRING },
                    technical: { type: Type.STRING },
                },
                required: ["creative", "concise", "technical"],
            }
        }
    });

    return JSON.parse(responseText);
};
