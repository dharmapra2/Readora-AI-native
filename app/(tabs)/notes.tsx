import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { NotesScreen } from "@/screens/NotesScreen";

export default function NotesRoute() {
  const { notes } = useReadoraData();

  return <NotesScreen notes={notes} onOpen={(screen) => router.push(routeFor(screen))} />;
}
