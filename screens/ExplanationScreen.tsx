import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { FadeInView, sharedStyles } from "@/components/readora/Common";
import { Header } from "@/components/readora/Header";
import { colors } from "@/constants/readoraTheme";
import { Scan } from "@/lib/api";

export function ExplanationScreen({
  onBack,
  onOpen,
  onSaveNote,
  scan,
}: {
  onBack: () => void;
  onOpen: (screen: string) => void;
  onSaveNote: (text: string) => void;
  scan: Scan;
}) {
  const [question, setQuestion] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    onSaveNote(scan.explanation);
    setSaved(true);
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <Header title="AI Explanation" subtitle={scan.difficulty} onBack={onBack} />
      <FadeInView>
        <View style={styles.panel}>
          <Text style={styles.label}>Scanned text</Text>
          <Text style={styles.scannedText}>{scan.text}</Text>
        </View>
      </FadeInView>
      <View style={styles.explainCard}>
        <Text style={styles.label}>Explanation</Text>
        <Text style={styles.explanation}>{scan.explanation}</Text>
      </View>
      <View style={styles.inputBar}>
        <TextInput
          placeholder="Ask a follow-up..."
          placeholderTextColor="#9AA0B4"
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
        />
        <Ionicons name="send" size={20} color={colors.purple} />
      </View>
      {!!question && (
        <View style={styles.answerBox}>
          <Text style={styles.answerText}>Short answer: the passage is about building identity through repeated action.</Text>
        </View>
      )}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={save}>
          <Ionicons name={saved ? "checkmark-circle" : "bookmark-outline"} size={19} color={colors.purple} />
          <Text style={styles.secondaryText}>{saved ? "Saved" : "Save Note"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={() => onOpen("quiz")}>
          <Text style={styles.primaryText}>Create Quiz</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  scannedText: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 27,
  },
  explainCard: {
    borderRadius: 16,
    backgroundColor: "#EFE7FF",
    padding: 18,
    marginTop: 18,
  },
  explanation: {
    color: "#252159",
    fontSize: 16,
    lineHeight: 26,
  },
  inputBar: {
    marginTop: 18,
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: "#F1F3F8",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
  },
  answerBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  answerText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: colors.softPurple,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondaryText: {
    color: colors.purple,
    fontWeight: "900",
  },
  primaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: colors.surface,
    fontWeight: "900",
  },
});
