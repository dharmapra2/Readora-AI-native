import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants/readoraTheme";

export function SectionTitle({
  title,
  action,
  onPress,
}: {
  title: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionHeading}>{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <View style={styles.searchBar}>
      <TextInput placeholder={placeholder} placeholderTextColor="#9AA0B4" style={styles.searchInput} />
    </View>
  );
}

export function Pills({ items, trailingIcon }: { items: string[]; trailingIcon?: boolean }) {
  return (
    <View style={styles.pillRow}>
      {items.map((item, index) => (
        <View key={item} style={[styles.pill, index === 0 && styles.pillActive]}>
          <Text style={[styles.pillText, index === 0 && styles.pillTextActive]}>{item}</Text>
        </View>
      ))}
      {trailingIcon && <Ionicons name="options-outline" size={21} color={colors.ink} />}
    </View>
  );
}

export function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={23} color={colors.purple} />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export function StatCard({ label, value, tint }: { label: string; value: string; tint: string }) {
  return (
    <View style={[styles.statCard, { backgroundColor: tint }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 22,
    paddingBottom: 112,
  },
  pageTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 18,
    marginBottom: 20,
  },
  sectionHeading: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
  },
  smallKicker: {
    color: "#666C82",
    fontSize: 13,
    fontWeight: "600",
  },
});

const styles = StyleSheet.create({
  sectionTitleRow: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeading: sharedStyles.sectionHeading,
  sectionAction: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: "700",
  },
  searchBar: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#F1F3F8",
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 16,
  },
  searchInput: {
    color: colors.ink,
    fontSize: 14,
  },
  pillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  pill: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pillActive: {
    backgroundColor: colors.softPurple,
    borderWidth: 1,
    borderColor: colors.purple,
  },
  pillText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "700",
  },
  pillTextActive: {
    color: colors.purple,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
  },
  quickIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.softPurple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickLabel: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "700",
  },
  statCard: {
    width: "48%",
    minHeight: 100,
    borderRadius: 14,
    padding: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(17,19,42,0.05)",
  },
  statLabel: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 10,
  },
  statValue: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: "900",
  },
});
