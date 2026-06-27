import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { SettingsScreen } from "@/screens/SettingsScreen";

export default function SettingsRoute() {
  const store = useReadoraData();

  return (
    <SettingsScreen
      settings={store.settings}
      setSettings={store.setSettings}
      onBack={() => router.back()}
      onExport={() => {
        console.log(JSON.stringify({ books: store.books, notes: store.notes, settings: store.settings }, null, 2));
      }}
    />
  );
}
