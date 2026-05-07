import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { QuizScreen } from "@/screens/QuizScreen";

export default function QuizRoute() {
  const { quiz } = useReadoraData();

  return <QuizScreen quiz={quiz} onBack={() => router.back()} />;
}
