
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Flashcard, AnalysisResult, DailyTip, Language, QuizQuestion } from "../types";

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
          concept: { type: Type.STRING },
          category: { type: Type.STRING },
          definition: { type: Type.STRING },
          syntax: { type: Type.STRING },
          exampleCode: { type: Type.STRING },
        },
        required: ["concept", "category", "definition", "syntax", "exampleCode"]
      }
    }
  }
};

const AnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    originalCode: { type: Type.STRING },
    summary: { type: Type.STRING },
    concepts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          segment: { type: Type.STRING },
          type: { type: Type.STRING },
          explanation: { type: Type.STRING },
        }
      }
    },
    bestPracticeTip: { type: Type.STRING }
  }
};

const DailyTipSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    codeSnippet: { type: Type.STRING },
    explanation: { type: Type.STRING },
    funFact: { type: Type.STRING }
  }
};

const QuizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
        }
      }
    }
  }
};

// --- API Functions ---

export const generateFlashcards = async (topic: string, level: string, language: Language): Promise<Flashcard[]> => {
  try {
    const prompt = `Generate 5 Python programming flashcards for the topic: "${topic}". 
    The difficulty level is ${level}. 
    Translate definitions and explanations into ${language}.
    Keep examples simple, fun, and easy to understand for a beginner.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: FlashcardSchema,
        systemInstruction: `You are an expert Python tutor for beginners. You make coding fun and easy. Explanations should be in ${language}.`
      }
    });

    const data = JSON.parse(response.text || '{"cards": []}');
    return data.cards.map((card: any, index: number) => ({ ...card, id: `card-${Date.now()}-${index}` }));
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

export const analyzeCode = async (code: string, language: Language): Promise<AnalysisResult> => {
  try {
    const prompt = `Analyze this Python code: "${code}". 
    Explain what it does simply in ${language}. Break down key parts.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: AnalysisSchema,
        systemInstruction: `You are a helpful coding assistant. Explain Python code clearly for beginners in ${language}.`
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing code:", error);
    throw error;
  }
};

export const getDailyTip = async (language: Language): Promise<DailyTip> => {
  try {
    const prompt = `Give me a fun, easy Python tip or mini-lesson for a beginner. Include a code snippet. Translate explanations to ${language}.`;
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: DailyTipSchema,
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting daily tip:", error);
    return {
      topic: "Print Function",
      codeSnippet: "print('Hello World!')",
      explanation: "This displays text on the screen.",
      funFact: "It's usually the first code you write!"
    };
  }
}

export const generateQuiz = async (language: Language): Promise<QuizQuestion[]> => {
    try {
        const prompt = `Generate 3 fun, beginner-level multiple choice questions about Python basics (variables, strings, loops, or math). 
        The content language should be ${language}. Provide 4 options for each.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: QuizSchema,
            }
        });

        const data = JSON.parse(response.text || '{"questions": []}');
        return data.questions;
    } catch (error) {
        console.error("Error generating quiz", error);
        return [];
    }
}

export const explainTopic = async (topic: string, language: Language): Promise<string> => {
    try {
        const prompt = `Write a simple, fun educational guide about the Python topic: "${topic}".
        Use Markdown formatting.
        Write in ${language}.
        Include:
        1. Simple analogy
        2. Code Syntax
        3. Real-world example code
        Keep it short and sweet for beginners.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
        });
        
        return response.text || "No explanation available.";
    } catch (error) {
        return "Sorry, I couldn't load the book content right now.";
    }
}

export const createChatSession = (history: any[] = [], language: Language) => {
    return ai.chats.create({
        model: modelId,
        history: history,
        config: {
            systemInstruction: `You are 'Py-Sensei', a fun, enthusiastic Python tutor for beginners. 
            You explain concepts using simple analogies. 
            You speak in ${language}, but keep Python keywords in English. 
            If the user sends code, help them fix it. 
            Always be encouraging!`,
        }
    });
}
