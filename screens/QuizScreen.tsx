import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/readora/Header";
import { sharedStyles } from "@/components/readora/Common";
import { colors } from "@/constants/readoraTheme";
import { api, QuizQuestion } from "@/lib/apiService";

type StaticQuiz = { question: string; options: string[]; answerIndex: number };

function toApiQuestions(q: StaticQuiz): QuizQuestion {
  return {
    question: q.question,
    options: q.options.map((text, i) => ({ label: String.fromCharCode(65 + i), text })),
    correct: String.fromCharCode(65 + q.answerIndex),
  };
}

export function QuizScreen({
  quiz: staticQuiz,
  onBack,
  readerText,
  bookTitle,
}: {
  quiz: StaticQuiz;
  onBack: () => void;
  readerText?: string;
  bookTitle?: string;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([toApiQuestions(staticQuiz)]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!readerText) return;
    setLoading(true);
    api
      .quiz(readerText, 10, bookTitle)
      .then((res) => {
        if (res.questions.length > 0) {
          setQuestions(res.questions);
          setQIndex(0);
          setSelected(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [readerText, bookTitle]);

  const current = questions[qIndex];
  const total = questions.length;
  const fillPct = ((qIndex + 1) / total) * 100;

  const next = () => {
    setSelected(null);
    setQIndex((i) => (i + 1 < total ? i + 1 : 0));
  };

  return (
    <View style={sharedStyles.screen}>
      <Header title="Quiz" onBack={onBack} />

      <View style={styles.progress}>
        <Text style={sharedStyles.smallKicker}>
          Question {qIndex + 1} of {total}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${fillPct}%` as any }]} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.purple} size="large" />
          <Text style={styles.loadingText}>Generating quiz with AI...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.question}>{current.question}</Text>
          <View style={styles.optionsList}>
            {current.options.map((opt) => {
              const isSelected = selected === opt.label;
              const isCorrect = opt.label === current.correct;
              const showCorrect = selected !== null && isCorrect;
              const showWrong = isSelected && !isCorrect;
              return (
                <Pressable
                  key={opt.label}
                  style={[
                    styles.optionRow,
                    showCorrect && styles.correctOption,
                    showWrong && styles.wrongOption,
                  ]}
                  onPress={() => setSelected(opt.label)}
                >
                  <View
                    style={[
                      styles.optionLetter,
                      showCorrect && styles.correctLetter,
                      showWrong && styles.wrongLetter,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionLetterText,
                        (showCorrect || showWrong) && styles.optionLetterTextWhite,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </View>
                  <Text style={styles.optionText}>{opt.text}</Text>
                  {showCorrect && <Ionicons name="checkmark-circle" size={20} color="#22A867" />}
                  {showWrong && <Ionicons name="close-circle" size={20} color="#EF4444" />}
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      <TouchableOpacity
        style={[styles.primaryButton, !selected && styles.primaryButtonDisabled]}
        onPress={next}
        disabled={!selected && !loading}
      >
        <Text style={styles.primaryButtonText}>
          {qIndex + 1 < total ? "Next Question" : "Finish Quiz"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    marginTop: 28,
    paddingHorizontal: 28,
    gap: 14,
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E8E8EE",
  },
  fill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.purple,
  },
  loadingWrap: {
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
  question: {
    paddingHorizontal: 28,
    marginTop: 28,
    color: colors.ink,
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 30,
    marginBottom: 24,
  },
  optionsList: {
    flex: 1,
    paddingHorizontal: 22,
    gap: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  correctOption: {
    borderColor: "#22A867",
    backgroundColor: "#F0FBF6",
  },
  wrongOption: {
    borderColor: "#EF4444",
    backgroundColor: "#FFF5F5",
  },
  optionLetter: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F2F3F8",
    alignItems: "center",
    justifyContent: "center",
  },
  correctLetter: {
    backgroundColor: "#22A867",
  },
  wrongLetter: {
    backgroundColor: "#EF4444",
  },
  optionLetterText: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 13,
  },
  optionLetterTextWhite: {
    color: "#fff",
  },
  optionText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    margin: 22,
  },
  primaryButtonDisabled: {
    backgroundColor: "#C4B5FD",
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "800",
    fontSize: 15,
  },
});
