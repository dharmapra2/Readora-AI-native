import { router } from "expo-router";

import { getFlashcards, getReader } from "@/lib/api";
import { useReadoraData } from "@/hooks/useReadoraData";
import { FlashcardsScreen } from "@/screens/FlashcardsScreen";

const staticReader = getReader();
const staticFlashcards = getFlashcards();

export default function FlashcardsRoute() {
  const { currentBook } = useReadoraData();
  const readerText = staticReader.paragraphs.join(" ");

  return (
    <FlashcardsScreen
      card={staticFlashcards[0]}
      progress={`${staticFlashcards.length + 10} / 20`}
      onBack={() => router.back()}
      readerText={readerText}
      bookTitle={currentBook.title}
    />
  );
}
