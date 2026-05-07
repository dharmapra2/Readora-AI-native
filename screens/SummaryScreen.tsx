import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/readora/Header";
import { sharedStyles } from "@/components/readora/Common";
import { colors } from "@/constants/readoraTheme";

export function SummaryScreen({
  summary,
  onBack,
}: {
  summary: { chapter: string; takeaways: string[] };
  onBack: () => void;
}) {
  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <Header
        title="Summary"
        onBack={onBack}
        right={<Ionicons name="ellipsis-vertical" size={22} color={colors.ink} />}
      />
      <View style={styles.segmented}>
        {["Overview", "Key Takeaways", "Quotes"].map((item, index) => (
          <View key={item} style={[styles.segment, index === 0 && styles.segmentActive]}>
            <Text style={[styles.segmentText, index === 0 && styles.segmentTextActive]}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.panelTitle}>Chapter Summary</Text>
        <Text style={styles.summaryText}>{summary.chapter}</Text>
      </View>
      <View style={styles.whitePanel}>
        <Text style={styles.panelTitle}>Key Takeaways</Text>
        {summary.takeaways.map((takeaway, index) => (
          <View key={takeaway} style={styles.takeawayRow}>
            <View style={[styles.takeawayIcon, { backgroundColor: ["#F0ECFF", "#FFF2D8", "#E8F8EF", "#EFEAFF"][index] }]}>
              <Ionicons
                name={["book-outline", "flame-outline", "leaf-outline", "sparkles-outline"][index] as keyof typeof Ionicons.glyphMap}
                size={18}
                color={colors.purple}
              />
            </View>
            <Text style={styles.takeawayText}>{takeaway}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.primaryButton}>
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
    marginTop: 20,
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
  },
  takeawayText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 21,
  },
  primaryButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "800",
    fontSize: 15,
  },
});
