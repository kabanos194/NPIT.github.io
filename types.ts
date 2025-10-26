export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
}

export type ModelType = 'general' | 'culinary' | 'science' | 'history' | 'biology' | 'code' | 'maths' | 'chemistry' | 'geography';

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
  model?: ModelType;
  thumbnail?: string;
}

export type TextPart = { text: string };

export type InlineDataPart = {
  inlineData: {
    mimeType: string;
    data: string;
  };
};

export type ContentPart = TextPart | InlineDataPart;

// This represents the type that can be sent to the Gemini chat model
export type ContentUnion = (string | ContentPart)[];

export interface QuizQuestion {
  questionText: string;
  questionType: 'multiple-choice' | 'true-false' | 'short-answer';
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}