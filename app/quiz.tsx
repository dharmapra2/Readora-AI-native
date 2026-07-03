import { router } from "expo-router";

import { getQuiz, getReader } from "@/lib/api";
import { useReadoraData } from "@/hooks/useReadoraData";
import { QuizScreen } from "@/screens/QuizScreen";

const staticReader = getReader();
const staticQuiz = getQuiz();

export default function QuizRoute() {
  const { currentBook } = useReadoraData();
  const readerText = staticReader.paragraphs.join(" ");

  return (
    <QuizScreen
      quiz={staticQuiz}
      onBack={() => router.back()}
      readerText={readerText}
      bookTitle={currentBook.title}
    />
  );
}
