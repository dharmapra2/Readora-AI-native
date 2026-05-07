import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { ChatScreen } from "@/screens/ChatScreen";

export default function AiRoute() {
  const { chat, currentBook } = useReadoraData();

  return (
    <ChatScreen
      book={currentBook}
      chat={chat}
      inTab
      onOpen={(screen) => router.push(routeFor(screen))}
    />
  );
}
