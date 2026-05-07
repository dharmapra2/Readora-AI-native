import data from "./data.json";

export type ReadoraData = typeof data;
export type Book = ReadoraData["books"][number];
export type Note = ReadoraData["notes"][number];

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
