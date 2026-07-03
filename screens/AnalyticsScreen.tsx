import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { StatCard, sharedStyles } from "@/components/readora/Common";
import { colors } from "@/constants/readoraTheme";

export function AnalyticsScreen({
  analytics,
  onOpen,
  onLogout,
  user,
}: {
  analytics: {
    books_read?: number; booksRead?: number;
    reading_time?: string; readingTime?: string;
    pages_read?: number; pagesRead?: number;
    ai_interactions?: number; aiInteractions?: number;
    daily_reading_minutes?: number[]; dailyReadingMinutes?: number[];
  };
  onOpen?: (screen: string) => void;
  onLogout?: () => void;
  user: { name?: string; avatar?: string; streak: number };
}) {
  const booksRead = analytics.books_read ?? analytics.booksRead ?? 0;
  const readingTime = analytics.reading_time ?? analytics.readingTime ?? "0m";
  const pagesRead = analytics.pages_read ?? analytics.pagesRead ?? 0;
  const aiInteractions = analytics.ai_interactions ?? analytics.aiInteractions ?? 0;
  const dailyReadingMinutes = analytics.daily_reading_minutes ?? analytics.dailyReadingMinutes ?? [0,0,0,0,0,0,0];
  const max = Math.max(...dailyReadingMinutes, 1);

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <View style={styles.header}>
        <Text style={sharedStyles.pageTitle}>Reading Analytics</Text>
        <View style={styles.weekPill}>
          <Text style={styles.weekText}>This Week</Text>
          <Ionicons name="chevron-down" size={15} color={colors.ink} />
        </View>
      </View>
      <View style={styles.statsGrid}>
        <StatCard label="Books Read" value={String(booksRead)} tint="#F0ECFF" />
        <StatCard label="Reading Time" value={readingTime} tint="#FFF4DE" />
        <StatCard label="Pages Read" value={String(pagesRead)} tint="#EAF8EF" />
        <StatCard label="AI Interactions" value={String(aiInteractions)} tint="#F3EFFF" />
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Daily Reading Time</Text>
        <View style={styles.chart}>
          {dailyReadingMinutes.map((value, index) => (
            <View key={`${value}-${index}`} style={styles.barColumn}>
              <View style={[styles.bar, { height: 28 + (value / max) * 88 }]} />
              <Text style={styles.dayLabel}>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.streakPanel}>
        <View>
          <Text style={styles.panelTitle}>Reading Streak</Text>
          <Text style={styles.streakNumber}>{user.streak}</Text>
          <Text style={styles.streakText}>Days in a row! 🔥</Text>
        </View>
        <MaterialCommunityIcons name="fire" size={72} color="#FF9F1C" />
      </View>
      <TouchableOpacity style={styles.settingsButton} onPress={() => onOpen?.("settings")}>
        <Ionicons name="settings-outline" size={20} color={colors.surface} />
        <Text style={styles.settingsText}>Settings & Profile</Text>
      </TouchableOpacity>
      {onLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weekPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F2F3F8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  weekText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  panel: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 14,
  },
  chart: {
    height: 174,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barColumn: {
    alignItems: "center",
    gap: 8,
  },
  bar: {
    width: 14,
    borderRadius: 8,
    backgroundColor: colors.purple,
  },
  dayLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  streakPanel: {
    marginTop: 20,
    minHeight: 138,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  streakNumber: {
    color: colors.ink,
    fontSize: 44,
    fontWeight: "900",
    marginTop: 4,
  },
  streakText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
  },
  settingsButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: colors.purple,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },
  settingsText: {
    color: colors.surface,
    fontWeight: "900",
  },
  logoutButton: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#fecaca",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "700",
    fontSize: 14,
  },
});
