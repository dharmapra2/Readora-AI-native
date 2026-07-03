import * as SecureStore from "expo-secure-store";

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "readora_jwt";

// ── Token helpers ─────────────────────────────────────────────────────────────

export const tokenStore = {
  get: () => SecureStore.getItemAsync(TOKEN_KEY),
  set: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  clear: () => SecureStore.deleteItemAsync(TOKEN_KEY),
};

// ── Core fetch ────────────────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await tokenStore.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;
  if (res.status === 401) {
    await tokenStore.clear();
    throw new AuthError("Session expired. Please log in again.");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body?.detail ?? `HTTP ${res.status}`;
    throw new ApiError(detail, res.status);
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

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type Flashcard = { question: string; answer: string };
export type QuizOption = { label: string; text: string };
export type QuizQuestion = { question: string; options: QuizOption[]; correct: string };

export type UserRecord = {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  reading_goal_min: number;
  timezone: string;
  push_token: string | null;
  is_active: boolean;
};

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
  file_type: string | null;
  processing_status: string;
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

export type UploadStatus = {
  book_id: string;
  status: string;
  backend: string;
  file_path: string | null;
};

export type BookTextChunk = {
  status: "done" | "processing" | "none" | "error";
  text: string | null;
  start: number;
  length: number;
  total_length: number;
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  register: async (email: string, username: string, password: string) => {
    const res = await post<{ access_token: string; token_type: string }>(
      "/api/v1/auth/register",
      { email, username, password }
    );
    await tokenStore.set(res.access_token);
    return res;
  },

  login: async (email: string, password: string) => {
    const res = await post<{ access_token: string; token_type: string }>(
      "/api/v1/auth/login",
      { email, password }
    );
    await tokenStore.set(res.access_token);
    return res;
  },

  me: () => request<UserRecord>("/api/v1/auth/me"),

  updatePushToken: (push_token: string) =>
    put<UserRecord>("/api/v1/auth/me/push-token", { push_token }),

  logout: async () => {
    await tokenStore.clear();
  },
};

// ── Books ─────────────────────────────────────────────────────────────────────

export const booksApi = {
  list: () => request<BookRecord[]>("/api/v1/books"),
  create: (body: {
    title: string;
    author: string;
    total_pages?: number;
    cover_color?: string;
    accent?: string;
  }) => post<BookRecord>("/api/v1/books", body),
  updateProgress: (
    id: string,
    body: { pages_read: number; progress: number; minutes_left?: number }
  ) => put<BookRecord>(`/api/v1/books/${id}/progress`, body),
  delete: (id: string) => del(`/api/v1/books/${id}`),
};

// ── File uploads ──────────────────────────────────────────────────────────────

export const uploadsApi = {
  uploadFile: async (bookId: string, fileUri: string, mimeType: string): Promise<UploadStatus> => {
    const token = await tokenStore.get();
    const form = new FormData();
    form.append("file", { uri: fileUri, type: mimeType, name: `book.${mimeType.includes("pdf") ? "pdf" : "epub"}` } as any);

    const res = await fetch(`${BASE}/api/v1/books/${bookId}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) throw new ApiError("Upload failed", res.status);
    return res.json();
  },

  getDownloadUrl: (bookId: string) =>
    request<{ url: string; expires_in: number }>(`/api/v1/books/${bookId}/download-url`),

  getText: (bookId: string, start = 0, length = 5000) =>
    request<BookTextChunk>(`/api/v1/books/${bookId}/text?start=${start}&length=${length}`),
};

// ── Notes ─────────────────────────────────────────────────────────────────────

export const notesApi = {
  list: (bookId?: string) =>
    request<NoteRecord[]>(`/api/v1/notes${bookId ? `?book_id=${bookId}` : ""}`),
  create: (body: {
    book_id: string;
    book_title?: string;
    text: string;
    type?: string;
    chapter?: string;
  }) => post<NoteRecord>("/api/v1/notes", body),
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

  explain: (
    text: string,
    difficulty: "simple" | "standard" | "advanced",
    bookTitle?: string
  ) =>
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
