import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FadeInView, sharedStyles } from "@/components/readora/Common";
import { Header } from "@/components/readora/Header";
import { colors, shadow } from "@/constants/readoraTheme";
import { api, Flashcard } from "@/lib/apiService";

export function FlashcardsScreen({
  card: staticCard,
  progress: staticProgress,
  onBack,
  readerText,
  bookTitle,
}: {
  card: { question: string; answer: string };
  progress: string;
  onBack: () => void;
  readerText?: string;
  bookTitle?: string;
}) {
  const [cards, setCards] = useState<Flashcard[]>([
    { question: staticCard.question, answer: staticCard.answer },
  ]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!readerText) return;
    setLoading(true);
    api
      .flashcards(readerText, 10, bookTitle)
      .then((res) => {
        if (res.flashcards.length > 0) {
          setCards(res.flashcards);
          setIndex(0);
          setRevealed(false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [readerText, bookTitle]);

  const current = cards[index];
  const total = cards.length;
  const fillPct = ((index + 1) / total) * 100;

  const nextCard = () => {
    setRevealed(false);
    setIndex((i) => (i + 1 < total ? i + 1 : 0));
  };

  return (
    <View style={sharedStyles.screen}>
      <Header
        title="Flashcards"
        subtitle={bookTitle ?? "Atomic Habits"}
        onBack={onBack}
        right={<Ionicons name="shuffle" size={20} color={colors.ink} />}
      />

      <View style={styles.progressHeader}>
        <Text style={sharedStyles.smallKicker}>Progress</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${fillPct}%` as any }]} />
        </View>
        <Text style={sharedStyles.smallKicker}>{`${index + 1} / ${total}`}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={colors.purple} size="large" />
          <Text style={styles.loadingText}>Generating flashcards with AI...</Text>
        </View>
      ) : (
        <Pressable style={styles.flashcard} onPress={() => setRevealed((v) => !v)}>
          <FadeInView key={`${index}-${revealed}`}>
            <Text style={styles.question}>{revealed ? current.answer : current.question}</Text>
            <Text style={styles.revealText}>
              {revealed ? "Tap to show question" : "Tap to reveal answer"}
            </Text>
          </FadeInView>
        </Pressable>
      )}

      <View style={styles.difficultyRow}>
        <DiffBtn label="Again" color="#EF4444" icon="heart-dislike-outline" onPress={nextCard} />
        <DiffBtn label="Good" color="#F59E0B" icon="heart-outline" onPress={nextCard} />
        <DiffBtn label="Easy" color="#22C55E" icon="heart" onPress={nextCard} />
      </View>
    </View>
  );
}

function DiffBtn({
  label,
  color,
  icon,
  onPress,
}: {
  label: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.difficulty} onPress={onPress}>
      <Ionicons name={icon} size={24} color={color} />
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
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E8E8EE",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.purple,
  },
  loadingCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  flashcard: {
    ...shadow,
    flex: 1,
    margin: 28,
    borderRadius: 24,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    shadowColor: colors.purple,
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  question: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 24,
  },
  revealText: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  difficultyRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  difficulty: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  difficultyLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
});
