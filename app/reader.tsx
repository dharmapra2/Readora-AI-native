import { router } from "expo-router";

import { getReader } from "@/lib/api";
import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { ReaderScreen } from "@/screens/ReaderScreen";

const staticReader = getReader();

export default function ReaderRoute() {
  const { currentBook } = useReadoraData();

  return (
    <ReaderScreen
      book={currentBook}
      reader={staticReader}
      onBack={() => router.back()}
      onOpen={(screen) => router.push(routeFor(screen))}
    />
  );
}
