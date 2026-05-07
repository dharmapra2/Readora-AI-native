import { router } from "expo-router";

import { routeFor } from "@/lib/routes";
import { HomeScreen } from "@/screens/HomeScreen";
import { useReadoraData } from "@/hooks/useReadoraData";

export default function HomeRoute() {
  const { books, currentBook, user } = useReadoraData();

  return (
    <HomeScreen
      books={books}
      currentBook={currentBook}
      user={user}
      onOpen={(screen) => router.push(routeFor(screen))}
    />
  );
}
