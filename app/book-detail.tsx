import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { BookDetailScreen } from "@/screens/BookDetailScreen";

export default function BookDetailRoute() {
  const { currentBook, notes, scans } = useReadoraData();

  return (
    <BookDetailScreen
      book={currentBook}
      notes={notes}
      scans={scans}
      onBack={() => router.back()}
      onOpen={(screen) => router.push(routeFor(screen))}
    />
  );
}
