import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Flashcard, AnalysisResult, DailyPhrase, Language } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelId = "gemini-2.5-flash";

// --- Schema Definitions ---

const FlashcardSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          kanji: { type: Type.STRING, description: "The word in Kanji (or Hiragana if no Kanji exists)" },
          reading: { type: Type.STRING, description: "The reading in Hiragana/Katakana" },
          romaji: { type: Type.STRING, description: "The romanized reading" },
          translation: { type: Type.STRING, description: "Meaning in the target language" },
          exampleSentence: { type: Type.STRING, description: "A short example sentence in Japanese" },
        },
        required: ["kanji", "reading", "romaji", "translation", "exampleSentence"]
      }
    }
  }
};

const AnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    original: { type: Type.STRING },
    translation: { type: Type.STRING, description: "Translation of the full sentence in the target language" },
    tokens: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          reading: { type: Type.STRING },
          partOfSpeech: { type: Type.STRING },
          meaning: { type: Type.STRING, description: "Meaning of the word in the target language" },
        }
      }
    },
    grammarNotes: { type: Type.STRING, description: "Brief explanation of key grammar points used, explained in the target language." }
  }
};

const DailyPhraseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    japanese: { type: Type.STRING },
    reading: { type: Type.STRING },
    translation: { type: Type.STRING, description: "Translation in the target language" },
    context: { type: Type.STRING, description: "Cultural context or usage note, explained in the target language" }
  }
};

// --- API Functions ---

export const generateFlashcards = async (topic: string, level: string, language: Language): Promise<Flashcard[]> => {
  try {
    const prompt = `Generate 5 Japanese vocabulary flashcards for the topic: "${topic}". 
    The difficulty level is ${level}. 
    Translate meanings and explanations into ${language}.
    Ensure the examples are simple and relevant.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: FlashcardSchema,
        systemInstruction: `You are an expert Japanese language teacher. Provide translations in ${language}.`
      }
    });

    const data = JSON.parse(response.text || '{"cards": []}');
    // Add IDs for React keys
    return data.cards.map((card: any, index: number) => ({ ...card, id: `card-${Date.now()}-${index}` }));
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

export const analyzeSentence = async (sentence: string, language: Language): Promise<AnalysisResult> => {
  try {
    const prompt = `Analyze this Japanese sentence: "${sentence}". 
    Break it down into tokens, translate it to ${language}, and explain the grammar in ${language}.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: AnalysisSchema,
        systemInstruction: `You are a Japanese linguistics expert. Provide clear, beginner-friendly explanations in ${language}.`
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing sentence:", error);
    throw error;
  }
};

export const getDailyPhrase = async (language: Language): Promise<DailyPhrase> => {
  try {
    const prompt = `Give me a useful Japanese phrase for daily life, different from yesterday. Include cultural context. Translate everything to ${language}.`;
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: DailyPhraseSchema,
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting daily phrase:", error);
    return {
      japanese: "こんにちは",
      reading: "Konnichiwa",
      translation: "Hello",
      context: "Standard greeting."
    };
  }
}

// Chat is stateful, so we return the chat instance or handle it in component
export const createChatSession = (history: any[] = [], language: Language) => {
    return ai.chats.create({
        model: modelId,
        history: history,
        config: {
            systemInstruction: `You are 'Sakura-sensei', a friendly, encouraging, and polite Japanese tutor. You speak in a mix of simple Japanese and ${language} to help the user learn. Correct their mistakes gently. If they ask to practice a specific scenario, roleplay it with them. Explanations should be in ${language}.`,
        }
    });
}