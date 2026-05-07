import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import {
  Book,
  NewBookInput,
  Note,
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
  analytics: ReturnType<typeof getAnalytics>;
  books: Book[];
  chat: ReturnType<typeof getChat>;
  currentBook: Book;
  flashcards: ReturnType<typeof getFlashcards>;
  notes: Note[];
  quiz: ReturnType<typeof getQuiz>;
  reader: ReturnType<typeof getReader>;
  removeBook: (id: string) => void;
  selectBook: (id: string) => void;
  summary: ReturnType<typeof getSummary>;
  updateBookProgress: (id: string, progress: number) => void;
  user: ReturnType<typeof getUser>;
};

const ReadoraContext = createContext<ReadoraStore | null>(null);

export function ReadoraProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(() => getBooks());
  const [selectedBookId, setSelectedBookId] = useState(() => getCurrentBook().id);

  const currentBook = books.find((book) => book.id === selectedBookId) ?? books[0] ?? getCurrentBook();

  const value = useMemo<ReadoraStore>(() => {
    const addBook = (input: NewBookInput) => {
      const nextBook = createLocalBook(input, books.length);
      setBooks((current) => [nextBook, ...current]);
      setSelectedBookId(nextBook.id);
      return nextBook;
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
      analytics: getAnalytics(),
      books,
      chat: getChat(),
      currentBook,
      flashcards: getFlashcards(),
      notes: getNotes(),
      quiz: getQuiz(),
      reader: getReader(),
      removeBook,
      selectBook: setSelectedBookId,
      summary: getSummary(),
      updateBookProgress,
      user: getUser(),
    };
  }, [books, currentBook]);

  return <ReadoraContext.Provider value={value}>{children}</ReadoraContext.Provider>;
}

export function useReadoraStore() {
  const context = useContext(ReadoraContext);

  if (!context) {
    throw new Error("useReadoraStore must be used inside ReadoraProvider");
  }

  return context;
}
