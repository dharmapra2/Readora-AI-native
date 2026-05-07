import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { SummaryScreen } from "@/screens/SummaryScreen";

export default function SummaryRoute() {
  const { summary } = useReadoraData();

  return <SummaryScreen summary={summary} onBack={() => router.back()} />;
}
