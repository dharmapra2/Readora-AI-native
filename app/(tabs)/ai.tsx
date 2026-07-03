import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { ChatScreen } from "@/screens/ChatScreen";

export default function AiRoute() {
  const { currentBook } = useReadoraData();

  return (
    <ChatScreen
      book={currentBook}
      inTab
      onOpen={(screen) => router.push(routeFor(screen))}
    />
  );
}
