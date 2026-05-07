import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants/readoraTheme";

export function Header({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}
      <View style={styles.titleWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 70,
    paddingHorizontal: 22,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F5FA",
  },
  titleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  right: {
    width: 42,
    alignItems: "flex-end",
  },
});
