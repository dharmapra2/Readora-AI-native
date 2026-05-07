import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { LibraryScreen } from "@/screens/LibraryScreen";

export default function LibraryRoute() {
  const { addBook, books, removeBook, selectBook, updateBookProgress } = useReadoraData();

  return (
    <LibraryScreen
      books={books}
      onAddBook={addBook}
      onOpen={(screen) => router.push(routeFor(screen))}
      onRemoveBook={removeBook}
      onSelectBook={selectBook}
      onUpdateProgress={updateBookProgress}
    />
  );
}
