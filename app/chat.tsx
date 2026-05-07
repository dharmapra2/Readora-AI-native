import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { ChatScreen } from "@/screens/ChatScreen";

export default function ChatRoute() {
  const { chat, currentBook } = useReadoraData();

  return (
    <ChatScreen
      book={currentBook}
      chat={chat}
      onBack={() => router.back()}
      onOpen={(screen) => router.push(routeFor(screen))}
    />
  );
}
