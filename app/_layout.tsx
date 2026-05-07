import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ReadoraProvider } from "@/lib/readoraStore";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ReadoraProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ReadoraProvider>
    </SafeAreaProvider>
  );
}
