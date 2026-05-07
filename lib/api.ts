import data from "./data.json";

export type ReadoraData = typeof data;
export type Book = ReadoraData["books"][number];
export type Note = ReadoraData["notes"][number];
export type NewBookInput = Pick<Book, "author" | "title"> & Partial<Omit<Book, "author" | "id" | "title">>;
export type ScanDifficulty = "Simple" | "Normal" | "Academic";
export type Scan = {
  bookId: string;
  createdAt: string;
  difficulty: ScanDifficulty;
  explanation: string;
  id: string;
  page: number;
  text: string;
};

export function getUser() {
  return data.user;
}

export function getBooks() {
  return data.books;
}

export function getCurrentBook() {
  return data.books.find((book) => book.id === data.currentBookId) ?? data.books[0];
}

export function getReader() {
  return data.reader;
}

export function getChat() {
  return data.chat;
}

export function getSummary() {
  return data.summary;
}

export function getNotes() {
  return data.notes;
}

export function getFlashcards() {
  return data.flashcards;
}

export function getQuiz() {
  return data.quiz;
}

export function getAnalytics() {
  return data.analytics;
}

export function createLocalBook(input: NewBookInput, index: number): Book {
  const slug = input.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: `${slug || "book"}-${Date.now()}`,
    title: input.title.trim(),
    author: input.author.trim(),
    coverColor: input.coverColor ?? ["#F6D7B4", "#C7D2FE", "#DCFCE7", "#FDE68A"][index % 4],
    accent: input.accent ?? "#6B4CFF",
    progress: input.progress ?? 0,
    pagesRead: input.pagesRead ?? 0,
    totalPages: input.totalPages ?? 220,
    chapter: input.chapter ?? "Chapter 1",
    chapterTitle: input.chapterTitle ?? "Getting Started",
    minutesLeft: input.minutesLeft ?? 15,
  };
}
