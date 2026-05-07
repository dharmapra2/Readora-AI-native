import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { FlashcardsScreen } from "@/screens/FlashcardsScreen";

export default function FlashcardsRoute() {
  const { flashcards } = useReadoraData();

  return <FlashcardsScreen card={flashcards[0]} progress={`${flashcards.length + 10} / 20`} onBack={() => router.back()} />;
}
