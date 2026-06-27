const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type Flashcard = { question: string; answer: string };

export type QuizOption = { label: string; text: string };
export type QuizQuestion = {
  question: string;
  options: QuizOption[];
  correct: string;
};

export const api = {
  chat: (messages: ChatMessage[], bookTitle?: string) =>
    post<{ reply: string }>("/api/v1/ai/chat", { messages, book_title: bookTitle }),

  explain: (text: string, difficulty: "simple" | "standard" | "advanced", bookTitle?: string) =>
    post<{ explanation: string; difficulty: string }>("/api/v1/ai/explain", {
      text,
      difficulty,
      book_title: bookTitle,
    }),

  flashcards: (text: string, count = 5, bookTitle?: string) =>
    post<{ flashcards: Flashcard[] }>("/api/v1/ai/flashcards", {
      text,
      count,
      book_title: bookTitle,
    }),

  quiz: (text: string, count = 5, bookTitle?: string) =>
    post<{ questions: QuizQuestion[] }>("/api/v1/ai/quiz", {
      text,
      count,
      book_title: bookTitle,
    }),

  summary: (text: string, bookTitle?: string) =>
    post<{ summary: string; key_points: string[] }>("/api/v1/ai/summary", {
      text,
      book_title: bookTitle,
    }),
};
