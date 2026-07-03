import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/lib/authStore";
import { AnalyticsRecord, BookRecord, NoteRecord, analyticsApi, booksApi, notesApi } from "@/lib/apiService";

// ── Mapped types the UI uses ──────────────────────────────────────────────────

export type Book = BookRecord & {
  coverColor: string;
  chapterTitle: string;
  totalPages: number;
  pagesRead: number;
  minutesLeft: number;
};

export type Note = {
  id: string;
  book: string;
  book_id: string;
  text: string;
  type: string;
  chapter: string;
  tone: string;
};

function toBook(b: BookRecord): Book {
  return {
    ...b,
    coverColor: b.cover_color,
    chapterTitle: b.chapter_title,
    totalPages: b.total_pages,
    pagesRead: b.pages_read,
    minutesLeft: b.minutes_left,
  };
}

function toNote(n: NoteRecord): Note {
  return {
    id: n.id,
    book: n.book_title,
    book_id: n.book_id,
    text: n.text,
    type: n.type,
    chapter: n.chapter,
    tone: n.tone,
  };
}

// ── Store shape ───────────────────────────────────────────────────────────────

type ReadoraStore = {
  books: Book[];
  currentBook: Book;
  notes: Note[];
  analytics: AnalyticsRecord;
  user: { name: string; avatar: string; streak: number };
  loading: boolean;

  selectBook: (id: string) => void;
  addBook: (input: { title: string; author: string; totalPages?: number }) => Promise<Book>;
  removeBook: (id: string) => Promise<void>;
  updateBookProgress: (id: string, progress: number, pagesRead?: number) => Promise<void>;
  addNote: (text: string, bookTitle?: string, type?: string, chapter?: string) => Promise<Note>;
  removeNote: (id: string) => Promise<void>;
  refreshAnalytics: () => Promise<void>;

  settings: { darkMode: boolean; fontSize: number; language: string; notifications: boolean; offlineMode: boolean };
  setSettings: (s: Partial<ReadoraStore["settings"]>) => void;
};

const ReadoraContext = createContext<ReadoraStore | null>(null);

const COVER_COLORS = ["#F6D7B4", "#C7D2FE", "#DCFCE7", "#FDE68A", "#FECACA", "#BAE6FD"];
const DEFAULT_ANALYTICS: AnalyticsRecord = {
  books_read: 0,
  reading_time: "0m",
  pages_read: 0,
  ai_interactions: 0,
  daily_reading_minutes: [0, 0, 0, 0, 0, 0, 0],
  streak: 0,
};

// ── Provider ──────────────────────────────────────────────────────────────────

export function ReadoraProvider({ children }: { children: ReactNode }) {
  const { authState } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRecord>(DEFAULT_ANALYTICS);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettingsState] = useState({
    darkMode: false,
    fontSize: 16,
    language: "English",
    notifications: true,
    offlineMode: false,
  });

  const isAuthenticated = authState.status === "authenticated";

  useEffect(() => {
    if (!isAuthenticated) {
      setBooks([]);
      setNotes([]);
      setAnalytics(DEFAULT_ANALYTICS);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    async function load() {
      try {
        const [booksData, notesData, analyticsData] = await Promise.all([
          booksApi.list(),
          notesApi.list(),
          analyticsApi.get(),
        ]);
        if (cancelled) return;
        const mapped = booksData.map(toBook);
        setBooks(mapped);
        setNotes(notesData.map(toNote));
        setAnalytics(analyticsData);
        setSelectedBookId(mapped[0]?.id ?? null);
      } catch {
        // Network error — app still works with empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const currentBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) ?? books[0] ?? ({} as Book),
    [books, selectedBookId],
  );

  const authUser = authState.status === "authenticated" ? authState.user : null;
  const user = useMemo(() => ({
    name: authUser?.full_name ?? authUser?.username ?? "Reader",
    avatar: (authUser?.full_name ?? authUser?.username ?? "R").slice(0, 2).toUpperCase(),
    streak: analytics.streak,
  }), [authUser, analytics.streak]);

  const addBook = useCallback(
    async (input: { title: string; author: string; totalPages?: number }) => {
      const color = COVER_COLORS[books.length % COVER_COLORS.length];
      const record = await booksApi.create({
        title: input.title,
        author: input.author,
        total_pages: input.totalPages ?? 220,
        cover_color: color,
      });
      const book = toBook(record);
      setBooks((prev) => [book, ...prev]);
      setSelectedBookId(book.id);
      return book;
    },
    [books.length],
  );

  const removeBook = useCallback(
    async (id: string) => {
      await booksApi.delete(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      setSelectedBookId((prev) =>
        prev === id ? (books.find((b) => b.id !== id)?.id ?? null) : prev,
      );
    },
    [books],
  );

  const updateBookProgress = useCallback(
    async (id: string, progress: number, pagesRead?: number) => {
      const book = books.find((b) => b.id === id);
      if (!book) return;
      const updated = await booksApi.updateProgress(id, {
        pages_read: pagesRead ?? book.pagesRead,
        progress: Math.max(0, Math.min(100, Math.round(progress))),
      });
      setBooks((prev) => prev.map((b) => (b.id === id ? toBook(updated) : b)));
    },
    [books],
  );

  const addNote = useCallback(
    async (text: string, bookTitle?: string, type = "Note", chapter?: string) => {
      const record = await notesApi.create({
        book_id: currentBook?.id ?? "unknown",
        book_title: bookTitle ?? currentBook?.title ?? "",
        text,
        type,
        chapter: chapter ?? currentBook?.chapter ?? "",
      });
      const note = toNote(record);
      setNotes((prev) => [note, ...prev]);
      return note;
    },
    [currentBook],
  );

  const removeNote = useCallback(async (id: string) => {
    await notesApi.delete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const refreshAnalytics = useCallback(async () => {
    const data = await analyticsApi.get();
    setAnalytics(data);
  }, []);

  const value = useMemo<ReadoraStore>(
    () => ({
      books,
      currentBook,
      notes,
      analytics,
      user,
      loading,
      selectBook: setSelectedBookId,
      addBook,
      removeBook,
      updateBookProgress,
      addNote,
      removeNote,
      refreshAnalytics,
      settings,
      setSettings: (next) => setSettingsState((s) => ({ ...s, ...next })),
    }),
    [books, currentBook, notes, analytics, user, loading, settings, addBook, removeBook, updateBookProgress, addNote, removeNote, refreshAnalytics],
  );

  return <ReadoraContext.Provider value={value}>{children}</ReadoraContext.Provider>;
}

export function useReadoraStore() {
  const ctx = useContext(ReadoraContext);
  if (!ctx) throw new Error("useReadoraStore must be inside ReadoraProvider");
  return ctx;
}
