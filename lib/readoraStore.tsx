import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import {
  Book,
  NewBookInput,
  Note,
  Scan,
  ScanDifficulty,
  createLocalBook,
  getAnalytics,
  getBooks,
  getChat,
  getCurrentBook,
  getFlashcards,
  getNotes,
  getQuiz,
  getReader,
  getSummary,
  getUser,
} from "@/lib/api";

type ReadoraStore = {
  addBook: (input: NewBookInput) => Book;
  addNote: (text: string, bookTitle?: string) => Note;
  addScan: (bookId: string, difficulty?: ScanDifficulty) => Scan;
  analytics: ReturnType<typeof getAnalytics>;
  books: Book[];
  chat: ReturnType<typeof getChat>;
  currentBook: Book;
  flashcards: ReturnType<typeof getFlashcards>;
  notes: Note[];
  quiz: ReturnType<typeof getQuiz>;
  reader: ReturnType<typeof getReader>;
  removeBook: (id: string) => void;
  scans: Scan[];
  selectBook: (id: string) => void;
  selectScan: (id: string) => void;
  selectedScan: Scan;
  settings: {
    darkMode: boolean;
    fontSize: number;
    language: string;
    notifications: boolean;
    offlineMode: boolean;
  };
  setSettings: (settings: Partial<ReadoraStore["settings"]>) => void;
  summary: ReturnType<typeof getSummary>;
  updateBookProgress: (id: string, progress: number) => void;
  user: ReturnType<typeof getUser>;
};

const ReadoraContext = createContext<ReadoraStore | null>(null);

export function ReadoraProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(() => getBooks());
  const [notes, setNotes] = useState<Note[]>(() => getNotes());
  const [selectedBookId, setSelectedBookId] = useState(
    () => getCurrentBook().id,
  );
  const [scans, setScans] = useState<Scan[]>(() => [
    {
      bookId: getCurrentBook().id,
      createdAt: new Date().toISOString(),
      difficulty: "Normal",
      explanation:
        "This passage says habits compound over time. Small repeated actions can quietly change who you become.",
      id: "scan-sample",
      page: getCurrentBook().pagesRead,
      text: getReader().paragraphs[0],
    },
  ]);
  const [selectedScanId, setSelectedScanId] = useState("scan-sample");
  const [settings, setSettingsState] = useState({
    darkMode: false,
    fontSize: 16,
    language: "English",
    notifications: true,
    offlineMode: true,
  });

  const currentBook =
    books.find((book) => book.id === selectedBookId) ??
    books[0] ??
    getCurrentBook();
  const selectedScan =
    scans.find((scan) => scan.id === selectedScanId) ?? scans[0];

  const value = useMemo<ReadoraStore>(() => {
    const addBook = (input: NewBookInput) => {
      const nextBook = createLocalBook(input, books.length);
      setBooks((current) => [nextBook, ...current]);
      setSelectedBookId(nextBook.id);
      return nextBook;
    };

    const addNote = (text: string, bookTitle = currentBook.title) => {
      const nextNote: Note = {
        book: bookTitle,
        chapter: currentBook.chapter,
        id: `note-${Date.now()}`,
        text,
        tone: "#EAF4FF",
        type: "AI Note",
      };
      setNotes((current) => [nextNote, ...current]);
      return nextNote;
    };

    const addScan = (bookId: string, difficulty: ScanDifficulty = "Normal") => {
      const book = books.find((item) => item.id === bookId) ?? currentBook;
      const nextScan: Scan = {
        bookId,
        createdAt: new Date().toISOString(),
        difficulty,
        explanation:
          difficulty === "Simple"
            ? "In simple words: tiny choices add up. The more often you repeat a habit, the more it shapes your identity."
            : difficulty === "Academic"
              ? "The passage frames habit formation as cumulative behavioural reinforcement, where repeated actions alter self-concept and future decision patterns."
              : "This passage explains that habits compound. One small action may feel minor, but repeated actions become a system that changes your results.",
        id: `scan-${Date.now()}`,
        page: Math.max(1, book.pagesRead + 1),
        text: getReader().paragraphs[0],
      };
      setScans((current) => [nextScan, ...current]);
      setSelectedScanId(nextScan.id);
      setSelectedBookId(bookId);
      return nextScan;
    };

    const removeBook = (id: string) => {
      setBooks((current) => current.filter((book) => book.id !== id));
      setSelectedBookId((currentId) => {
        if (currentId !== id) {
          return currentId;
        }
        return books.find((book) => book.id !== id)?.id ?? getCurrentBook().id;
      });
    };

    const updateBookProgress = (id: string, progress: number) => {
      setBooks((current) =>
        current.map((book) =>
          book.id === id
            ? {
                ...book,
                progress: Math.max(0, Math.min(100, Math.round(progress))),
              }
            : book,
        ),
      );
    };

    return {
      addBook,
      addNote,
      addScan,
      analytics: getAnalytics(),
      books,
      chat: getChat(),
      currentBook,
      flashcards: getFlashcards(),
      notes,
      quiz: getQuiz(),
      reader: getReader(),
      removeBook,
      scans,
      selectBook: setSelectedBookId,
      selectScan: setSelectedScanId,
      selectedScan,
      settings,
      setSettings: (nextSettings) =>
        setSettingsState((current) => ({ ...current, ...nextSettings })),
      summary: getSummary(),
      updateBookProgress,
      user: getUser(),
    };
  }, [books, currentBook, notes, scans, selectedScan, settings]);

  return (
    <ReadoraContext.Provider value={value}>{children}</ReadoraContext.Provider>
  );
}

export function useReadoraStore() {
  const context = useContext(ReadoraContext);

  if (!context) {
    throw new Error("useReadoraStore must be used inside ReadoraProvider");
  }

  return context;
}
