import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { QuizScreen } from "@/screens/QuizScreen";

export default function QuizRoute() {
  const { quiz, reader, currentBook } = useReadoraData();
  const readerText = reader.paragraphs.join(" ");

  return (
    <QuizScreen
      quiz={quiz}
      onBack={() => router.back()}
      readerText={readerText}
      bookTitle={currentBook.title}
    />
  );
}
