import { router } from "expo-router";

import { useReadoraData } from "@/hooks/useReadoraData";
import { routeFor } from "@/lib/routes";
import { AnalyticsScreen } from "@/screens/AnalyticsScreen";

export default function ProfileRoute() {
  const { analytics, user } = useReadoraData();

  return <AnalyticsScreen analytics={analytics} user={user} onOpen={(screen) => router.push(routeFor(screen))} />;
}
