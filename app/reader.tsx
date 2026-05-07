import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { ReaderScreen } from "@/screens/ReaderScreen";

export default function ReaderRoute() {
  const { currentBook, reader } = useReadoraData();

  return (
    <ReaderScreen
      book={currentBook}
      reader={reader}
      onBack={() => router.back()}
      onOpen={(screen) => router.push(routeFor(screen))}
    />
  );
}
