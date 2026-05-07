import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { ScanScreen } from "@/screens/ScanScreen";

export default function ScanRoute() {
  const { addScan, books, currentBook, selectBook } = useReadoraData();

  return (
    <ScanScreen
      books={books}
      currentBook={currentBook}
      onBack={() => router.back()}
      onSelectBook={selectBook}
      onCapture={(difficulty) => {
        addScan(currentBook.id, difficulty);
        router.push(routeFor("explanation"));
      }}
    />
  );
}
