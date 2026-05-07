import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/readora/Header";
import { sharedStyles } from "@/components/readora/Common";
import { colors } from "@/constants/readoraTheme";

export function QuizScreen({
  quiz,
  onBack,
}: {
  quiz: { question: string; options: string[]; answerIndex: number };
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(quiz.answerIndex);

  return (
    <View style={sharedStyles.screen}>
      <Header title="Quiz" onBack={onBack} />
      <View style={styles.progress}>
        <Text style={sharedStyles.smallKicker}>Question 2 of 10</Text>
        <View style={styles.track}>
          <View style={styles.fill} />
        </View>
      </View>
      <Text style={styles.question}>{quiz.question}</Text>
      {quiz.options.map((option, index) => {
        const isSelected = selected === index;
        const isCorrect = index === quiz.answerIndex;
        return (
          <Pressable
            key={option}
            style={[styles.optionRow, isSelected && isCorrect && styles.correctOption]}
            onPress={() => setSelected(index)}
          >
            <View style={styles.optionLetter}>
              <Text style={styles.optionLetterText}>{String.fromCharCode(65 + index)}</Text>
            </View>
            <Text style={styles.optionText}>{option}</Text>
            {isSelected && isCorrect && <Ionicons name="checkmark-circle" size={18} color="#22A867" />}
          </Pressable>
        );
      })}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Next Question</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    marginTop: 34,
    paddingHorizontal: 28,
    gap: 14,
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E7F0",
  },
  fill: {
    width: "42%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.purple,
  },
  question: {
    marginHorizontal: 28,
    marginTop: 56,
    color: colors.ink,
    fontSize: 25,
    lineHeight: 34,
    fontWeight: "900",
  },
  optionRow: {
    marginHorizontal: 28,
    marginTop: 14,
    minHeight: 62,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8DCE7",
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
  },
  correctOption: {
    backgroundColor: "#EAF8EF",
    borderColor: "#79D2A5",
  },
  optionLetter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#BFC5D2",
    alignItems: "center",
    justifyContent: "center",
  },
  optionLetterText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800",
  },
  optionText: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    fontWeight: "700",
  },
  primaryButton: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 98,
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "800",
    fontSize: 15,
  },
});
