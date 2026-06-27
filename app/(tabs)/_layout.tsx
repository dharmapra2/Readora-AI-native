import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/readoraTheme";

const tabIcons = {
  ai: "sparkles",
  index: "home-outline",
  library: "book-outline",
  notes: "document-text-outline",
  profile: "person-outline",
} as const;

function AICenterIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.aiButton, focused && styles.aiButtonActive]}>
      <Ionicons name="sparkles" size={24} color="#fff" />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: "#7E8496",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
        tabBarStyle: {
          height: 86,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },
        tabBarIcon: ({ color, focused }) => {
          if (route.name === "ai") {
            return <AICenterIcon focused={focused} />;
          }
          const name = tabIcons[route.name as keyof typeof tabIcons] ?? "ellipse-outline";
          return <Ionicons name={name} size={focused ? 24 : 22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="library" options={{ title: "Library" }} />
      <Tabs.Screen
        name="ai"
        options={{
          title: "AI",
          tabBarLabel: "AI",
          tabBarActiveTintColor: colors.purple,
        }}
      />
      <Tabs.Screen name="notes" options={{ title: "Notes" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  aiButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  aiButtonActive: {
    backgroundColor: "#5239e0",
  },
});
