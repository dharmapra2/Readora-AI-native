const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

function post<T>(path: string, body: object) {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}

function put<T>(path: string, body: object) {
  return request<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

function del(path: string) {
  return request<void>(path, { method: "DELETE" });
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type Flashcard = { question: string; answer: string };
export type QuizOption = { label: string; text: string };
export type QuizQuestion = { question: string; options: QuizOption[]; correct: string };

export type BookRecord = {
  id: string;
  title: string;
  author: string;
  cover_color: string;
  accent: string;
  total_pages: number;
  pages_read: number;
  progress: number;
  chapter: string;
  chapter_title: string;
  minutes_left: number;
};

export type NoteRecord = {
  id: string;
  book_id: string;
  book_title: string;
  text: string;
  type: string;
  chapter: string;
  tone: string;
};

export type AnalyticsRecord = {
  books_read: number;
  reading_time: string;
  pages_read: number;
  ai_interactions: number;
  daily_reading_minutes: number[];
  streak: number;
};

// ── Books ─────────────────────────────────────────────────────────────────────

export const booksApi = {
  list: () => request<BookRecord[]>("/api/v1/books"),
  create: (body: { title: string; author: string; total_pages?: number; cover_color?: string; accent?: string }) =>
    post<BookRecord>("/api/v1/books", body),
  updateProgress: (id: string, body: { pages_read: number; progress: number; minutes_left?: number }) =>
    put<BookRecord>(`/api/v1/books/${id}/progress`, body),
  delete: (id: string) => del(`/api/v1/books/${id}`),
};

// ── Notes ─────────────────────────────────────────────────────────────────────

export const notesApi = {
  list: (bookId?: string) =>
    request<NoteRecord[]>(`/api/v1/notes${bookId ? `?book_id=${bookId}` : ""}`),
  create: (body: { book_id: string; book_title?: string; text: string; type?: string; chapter?: string }) =>
    post<NoteRecord>("/api/v1/notes", body),
  delete: (id: string) => del(`/api/v1/notes/${id}`),
};

// ── Analytics ─────────────────────────────────────────────────────────────────

export const analyticsApi = {
  get: () => request<AnalyticsRecord>("/api/v1/analytics"),
  logSession: (body: { book_id: string; minutes: number; pages: number }) =>
    post<{ ok: boolean }>("/api/v1/analytics/session", body),
};

// ── AI ────────────────────────────────────────────────────────────────────────

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
