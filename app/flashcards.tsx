import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { FlashcardsScreen } from "@/screens/FlashcardsScreen";

export default function FlashcardsRoute() {
  const { flashcards, reader, currentBook } = useReadoraData();
  const readerText = reader.paragraphs.join(" ");

  return (
    <FlashcardsScreen
      card={flashcards[0]}
      progress={`${flashcards.length + 10} / 20`}
      onBack={() => router.back()}
      readerText={readerText}
      bookTitle={currentBook.title}
    />
  );
}
