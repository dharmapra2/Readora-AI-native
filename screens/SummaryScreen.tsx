import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/readora/Header";
import { sharedStyles } from "@/components/readora/Common";
import { colors } from "@/constants/readoraTheme";
import { api } from "@/lib/apiService";

const TABS = ["Overview", "Key Takeaways", "Quotes"] as const;
const ICONS = [
  "book-outline",
  "flame-outline",
  "leaf-outline",
  "sparkles-outline",
] as const;
const ICON_BG = ["#F0ECFF", "#FFF2D8", "#E8F8EF", "#EFEAFF"];

export function SummaryScreen({
  summary: staticSummary,
  onBack,
  readerText,
  bookTitle,
}: {
  summary: { chapter: string; takeaways: string[] };
  onBack: () => void;
  readerText?: string;
  bookTitle?: string;
}) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Overview");
  const [summaryText, setSummaryText] = useState(staticSummary.chapter);
  const [keyPoints, setKeyPoints] = useState(staticSummary.takeaways);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!readerText) return;
    setLoading(true);
    api
      .summary(readerText, bookTitle)
      .then((res) => {
        setSummaryText(res.summary);
        setKeyPoints(res.key_points);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [readerText, bookTitle]);

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <Header
        title="Summary"
        onBack={onBack}
        right={<Ionicons name="ellipsis-vertical" size={22} color={colors.ink} />}
      />

      <View style={styles.segmented}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.segment, activeTab === tab && styles.segmentActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.segmentText, activeTab === tab && styles.segmentTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.purple} size="large" />
          <Text style={styles.loadingText}>Generating summary with AI...</Text>
        </View>
      ) : (
        <>
          {activeTab === "Overview" && (
            <View style={styles.summaryCard}>
              <Text style={styles.panelTitle}>Chapter Summary</Text>
              <Text style={styles.summaryText}>{summaryText}</Text>
            </View>
          )}

          {activeTab === "Key Takeaways" && (
            <View style={styles.whitePanel}>
              <Text style={styles.panelTitle}>Key Takeaways</Text>
              {keyPoints.map((point, i) => (
                <View key={i} style={styles.takeawayRow}>
                  <View style={[styles.takeawayIcon, { backgroundColor: ICON_BG[i % ICON_BG.length] }]}>
                    <Ionicons name={ICONS[i % ICONS.length]} size={18} color={colors.purple} />
                  </View>
                  <Text style={styles.takeawayText}>{point}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "Quotes" && (
            <View style={styles.whitePanel}>
              <Text style={styles.panelTitle}>Notable Quotes</Text>
              <View style={styles.quoteCard}>
                <Text style={styles.quoteText}>
                  {`"Every action you take is a vote for the type of person you wish to become."`}
                </Text>
                <Text style={styles.quoteAuthor}>— Atomic Habits</Text>
              </View>
            </View>
          )}
        </>
      )}

      <TouchableOpacity style={styles.primaryButton}>
        <Ionicons name="git-network-outline" size={18} color={colors.surface} style={{ marginRight: 8 }} />
        <Text style={styles.primaryButtonText}>Generate Mind Map</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  segmented: {
    marginTop: 8,
    flexDirection: "row",
    backgroundColor: "#F2F3F8",
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  segmentTextActive: {
    color: colors.purple,
  },
  loadingWrap: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  summaryCard: {
    marginTop: 22,
    borderRadius: 16,
    backgroundColor: "#EFE7FF",
    padding: 22,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 14,
  },
  summaryText: {
    color: "#252159",
    fontSize: 15,
    lineHeight: 25,
  },
  whitePanel: {
    marginTop: 22,
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  takeawayRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  takeawayIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  takeawayText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 21,
  },
  quoteCard: {
    backgroundColor: "#F5F3FF",
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: colors.purple,
  },
  quoteText: {
    color: "#252159",
    fontSize: 15,
    lineHeight: 24,
    fontStyle: "italic",
    marginBottom: 10,
  },
  quoteAuthor: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: "700",
  },
  primaryButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 18,
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "800",
    fontSize: 15,
  },
});
