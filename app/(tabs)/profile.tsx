import { router } from "expo-router";
import { useReadoraData } from "@/hooks/useReadoraData";
import { useAuth } from "@/lib/authStore";
import { routeFor } from "@/lib/routes";
import { AnalyticsScreen } from "@/screens/AnalyticsScreen";

export default function ProfileRoute() {
  const { analytics } = useReadoraData();
  const { authState, logout } = useAuth();

  const user =
    authState.status === "authenticated"
      ? {
          name: authState.user.full_name ?? authState.user.username,
          avatar: authState.user.avatar_url ?? "",
          streak: analytics?.streak ?? 0,
        }
      : { name: "Reader", avatar: "", streak: 0 };

  async function handleLogout() {
    await logout();
    router.replace("/onboarding");
  }

  return (
    <AnalyticsScreen
      analytics={analytics}
      user={user}
      onOpen={(screen) => router.push(routeFor(screen))}
      onLogout={handleLogout}
    />
  );
}
