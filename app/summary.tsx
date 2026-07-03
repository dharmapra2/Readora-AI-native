import { router } from "expo-router";

import { getReader, getSummary } from "@/lib/api";
import { useReadoraData } from "@/hooks/useReadoraData";
import { SummaryScreen } from "@/screens/SummaryScreen";

const staticReader = getReader();
const staticSummary = getSummary();

export default function SummaryRoute() {
  const { currentBook } = useReadoraData();
  const readerText = staticReader.paragraphs.join(" ");

  return (
    <SummaryScreen
      summary={staticSummary}
      onBack={() => router.back()}
      readerText={readerText}
      bookTitle={currentBook.title}
    />
  );
}
