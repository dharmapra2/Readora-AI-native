import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

import { sharedStyles } from "@/components/readora/Common";
import { Header } from "@/components/readora/Header";
import { colors } from "@/constants/readoraTheme";

type SettingsShape = {
  darkMode: boolean;
  fontSize: number;
  language: string;
  notifications: boolean;
  offlineMode: boolean;
};

export function SettingsScreen({
  onBack,
  onExport,
  settings,
  setSettings,
}: {
  onBack: () => void;
  onExport: () => void;
  settings: SettingsShape;
  setSettings: (settings: Partial<SettingsShape>) => void;
}) {
  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <Header title="Settings" subtitle="Profile and preferences" onBack={onBack} />
      <SettingRow label="Notifications" value={settings.notifications} onValueChange={(notifications) => setSettings({ notifications })} />
      <SettingRow label="Offline mode" value={settings.offlineMode} onValueChange={(offlineMode) => setSettings({ offlineMode })} />
      <SettingRow label="Dark mode" value={settings.darkMode} onValueChange={(darkMode) => setSettings({ darkMode })} />
      <View style={styles.panel}>
        <Text style={styles.label}>Font size</Text>
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepButton} onPress={() => setSettings({ fontSize: Math.max(12, settings.fontSize - 1) })}>
            <Ionicons name="remove" size={18} color={colors.purple} />
          </TouchableOpacity>
          <Text style={styles.fontValue}>{settings.fontSize}px</Text>
          <TouchableOpacity style={styles.stepButton} onPress={() => setSettings({ fontSize: Math.min(24, settings.fontSize + 1) })}>
            <Ionicons name="add" size={18} color={colors.purple} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.panel}>
        <Text style={styles.label}>AI explanation language</Text>
        <Text style={styles.value}>{settings.language}</Text>
      </View>
      <TouchableOpacity style={styles.exportButton} onPress={onExport}>
        <Ionicons name="download-outline" size={20} color={colors.surface} />
        <Text style={styles.exportText}>Export Local Data JSON</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SettingRow({ label, onValueChange, value }: { label: string; onValueChange: (value: boolean) => void; value: boolean }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.purple }} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    minHeight: 64,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
  },
  value: {
    color: colors.muted,
    fontWeight: "800",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.softPurple,
    alignItems: "center",
    justifyContent: "center",
  },
  fontValue: {
    color: colors.ink,
    fontWeight: "900",
  },
  exportButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: colors.purple,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  exportText: {
    color: colors.surface,
    fontWeight: "900",
  },
});
