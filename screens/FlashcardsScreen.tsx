import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/readora/Header";
import { sharedStyles } from "@/components/readora/Common";
import { colors, shadow } from "@/constants/readoraTheme";

export function FlashcardsScreen({
  card,
  progress,
  onBack,
}: {
  card: { question: string; answer: string };
  progress: string;
  onBack: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={sharedStyles.screen}>
      <Header title="Flashcards" subtitle="Atomic Habits" onBack={onBack} right={<Ionicons name="shuffle" size={20} color={colors.ink} />} />
      <View style={styles.progressHeader}>
        <Text style={sharedStyles.smallKicker}>Progress</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <Text style={sharedStyles.smallKicker}>{progress}</Text>
      </View>
      <Pressable style={styles.flashcard} onPress={() => setRevealed((value) => !value)}>
        <Text style={styles.question}>{revealed ? card.answer : card.question}</Text>
        <Text style={styles.revealText}>Tap to {revealed ? "show question" : "reveal answer"}</Text>
      </Pressable>
      <View style={styles.difficultyRow}>
        <Difficulty label="Again" color="#EF4444" />
        <Difficulty label="Good" color="#F59E0B" />
        <Difficulty label="Easy" color="#22C55E" />
      </View>
    </View>
  );
}

function Difficulty({ label, color }: { label: string; color: string }) {
  return (
    <TouchableOpacity style={styles.difficulty}>
      <Ionicons name="heart-outline" size={24} color={color} />
      <Text style={[styles.difficultyLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  progressHeader: {
    marginTop: 20,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E7F0",
  },
  progressFill: {
    width: "58%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.purple,
  },
  flashcard: {
    ...shadow,
    marginHorizontal: 28,
    marginTop: 38,
    height: 322,
    borderRadius: 18,
    backgroundColor: "#EDE7FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    borderWidth: 1,
    borderColor: "#CFC3FF",
    shadowColor: colors.purple,
  },
  question: {
    color: colors.ink,
    fontSize: 24,
    lineHeight: 34,
    fontWeight: "700",
    textAlign: "center",
  },
  revealText: {
    color: colors.purple,
    fontSize: 14,
    marginTop: 28,
    fontWeight: "700",
  },
  difficultyRow: {
    marginTop: 36,
    paddingHorizontal: 28,
    flexDirection: "row",
    gap: 14,
  },
  difficulty: {
    flex: 1,
    height: 92,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  difficultyLabel: {
    fontSize: 13,
    fontWeight: "800",
  },
});
