import {
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

export function useReadoraData() {
  return {
    analytics: getAnalytics(),
    books: getBooks(),
    chat: getChat(),
    currentBook: getCurrentBook(),
    flashcards: getFlashcards(),
    notes: getNotes(),
    quiz: getQuiz(),
    reader: getReader(),
    summary: getSummary(),
    user: getUser(),
  };
}
