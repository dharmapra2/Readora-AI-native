import { useEffect } from "react";
import { Stack, router, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "@/lib/authStore";
import { ReadoraProvider } from "@/lib/readoraStore";

function AuthGate() {
  const { authState } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (authState.status === "loading") return;

    const inAuthGroup = (segments[0] as string) === "(auth)";
    const inTabs = segments[0] === "(tabs)";
    const onOnboarding = segments[0] === "onboarding";

    if (authState.status === "unauthenticated") {
      // Redirect to onboarding/login if trying to access protected tabs
      if (inTabs) router.replace("/onboarding");
    } else if (authState.status === "authenticated") {
      // Redirect away from auth screens once logged in
      if (inAuthGroup || onOnboarding) router.replace("/(tabs)");
    }
  }, [authState.status, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ReadoraProvider>
          <AuthGate />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/register" />
            <Stack.Screen name="onboarding" />
          </Stack>
        </ReadoraProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
