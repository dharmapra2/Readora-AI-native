import { useReadoraData } from "@/hooks/useReadoraData";
import { AnalyticsScreen } from "@/screens/AnalyticsScreen";

export default function ProfileRoute() {
  const { analytics, user } = useReadoraData();

  return <AnalyticsScreen analytics={analytics} user={user} />;
}
