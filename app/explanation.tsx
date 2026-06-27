import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { ExplanationScreen } from "@/screens/ExplanationScreen";

export default function ExplanationRoute() {
  const { addNote, reader, currentBook } = useReadoraData();
  const selectedScan = {
    id: "live",
    bookId: currentBook?.id ?? "",
    createdAt: new Date().toISOString(),
    difficulty: "Normal" as const,
    explanation: "",
    page: currentBook?.pagesRead ?? 0,
    text: reader?.paragraphs?.[0] ?? "",
  };

  return (
    <ExplanationScreen
      scan={selectedScan}
      onBack={() => router.back()}
      onOpen={(screen) => router.push(routeFor(screen))}
      onSaveNote={addNote}
    />
  );
}
