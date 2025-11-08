import { GoogleGenAI, Modality } from "@google/genai";
import type { GeneratedAdContent } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateAdMockup = async (
  base64Data: string,
  mimeType: string,
  prompt: string
): Promise<Omit<GeneratedAdContent, 'id'>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const adContent: Omit<GeneratedAdContent, 'id'> = {
      imageUrl: null,
      text: null,
    };
    
    const candidate = response.candidates?.[0];

    if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
            if (part.text) {
                adContent.text = part.text;
            } else if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const imageMimeType: string = part.inlineData.mimeType;
                adContent.imageUrl = `data:${imageMimeType};base64,${base64ImageBytes}`;
            }
        }
    }


    if (!adContent.imageUrl) {
      if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
        throw new Error(`Content generation failed. Reason: ${candidate.finishReason}. Please adjust your prompt or image.`);
      }
      throw new Error("The AI did not return an image. Please try a different prompt.");
    }

    return adContent;
  } catch (error) {
    console.error("Error generating ad mockup:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate ad: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the ad.");
  }
};