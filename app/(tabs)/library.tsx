import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { LibraryScreen } from "@/screens/LibraryScreen";

export default function LibraryRoute() {
  const { books } = useReadoraData();

  return <LibraryScreen books={books} onOpen={(screen) => router.push(routeFor(screen))} />;
}
