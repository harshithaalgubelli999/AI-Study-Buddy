import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { SummaryItem, Flashcard, QuizQuestion, GeneratedContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const safetySettings = [
    {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE",
    },
    {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE",
    },
    {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE",
    },
    {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE",
    },
];

const summarySchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING, description: 'A high-level topic or chapter title.' },
      summary: { type: Type.STRING, description: 'A concise summary of the key points for this topic.' }
    },
    required: ['topic', 'summary']
  }
};

const flashcardsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      term: { type: Type.STRING, description: 'The key term, concept, or question for the front of the flashcard.' },
      definition: { type: Type.STRING, description: 'The definition or answer for the back of the flashcard.' }
    },
    required: ['term', 'definition']
  }
};

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING, description: 'The multiple-choice question.' },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'An array of exactly 4 possible answers.'
      },
      correctAnswer: { type: Type.STRING, description: 'The correct answer, which must be one of the provided options.' }
    },
    required: ['question', 'options', 'correctAnswer']
  }
};

const generateContentWithSchema = async <T,>(prompt: string, schema: object): Promise<T> => {
    try {
        // Fix: Moved `safetySettings` into the `config` object and removed the deprecated `generationConfig` variable.
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                safetySettings,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to generate content from AI. The model may have returned an invalid response.");
    }
};

export const generateAllContent = async (text: string): Promise<GeneratedContent> => {
    const truncatedText = text.substring(0, 200000); // Truncate to a reasonable length for the API

    const summaryPrompt = `Based on the following study material, generate a list of topic-wise summaries. Each summary should cover a main concept or section from the text:\n\n${truncatedText}`;
    const flashcardsPrompt = `From the provided text, create a set of at least 10 flashcards for studying. Each flashcard should have a distinct term and a clear, concise definition:\n\n${truncatedText}`;
    const quizPrompt = `Generate a multiple-choice quiz with at least 10 questions based on the provided material. For each question, create four distinct options and identify the correct one:\n\n${truncatedText}`;

    const [summaries, flashcards, quiz] = await Promise.all([
        generateContentWithSchema<SummaryItem[]>(summaryPrompt, summarySchema),
        generateContentWithSchema<Flashcard[]>(flashcardsPrompt, flashcardsSchema),
        generateContentWithSchema<QuizQuestion[]>(quizPrompt, quizSchema),
    ]);
    
    return { summaries, flashcards, quiz };
};
