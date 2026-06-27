import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { ScanScreen } from "@/screens/ScanScreen";

export default function ScanRoute() {
  const { books, currentBook, selectBook } = useReadoraData();

  return (
    <ScanScreen
      books={books}
      currentBook={currentBook}
      onBack={() => router.back()}
      onSelectBook={selectBook}
      onCapture={() => {
        router.push(routeFor("explanation"));
      }}
    />
  );
}
