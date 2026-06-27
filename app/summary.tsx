import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { SummaryScreen } from "@/screens/SummaryScreen";

export default function SummaryRoute() {
  const { summary, reader, currentBook } = useReadoraData();
  const readerText = reader.paragraphs.join(" ");

  return (
    <SummaryScreen
      summary={summary}
      onBack={() => router.back()}
      readerText={readerText}
      bookTitle={currentBook.title}
    />
  );
}
