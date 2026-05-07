import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { ExplanationScreen } from "@/screens/ExplanationScreen";

export default function ExplanationRoute() {
  const { addNote, selectedScan } = useReadoraData();

  return (
    <ExplanationScreen
      scan={selectedScan}
      onBack={() => router.back()}
      onOpen={(screen) => router.push(routeFor(screen))}
      onSaveNote={addNote}
    />
  );
}
