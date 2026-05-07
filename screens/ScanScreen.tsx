import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BookCover } from "@/components/readora/BookCover";
import { FadeInView, Pills, sharedStyles } from "@/components/readora/Common";
import { Header } from "@/components/readora/Header";
import { colors } from "@/constants/readoraTheme";
import { Book, ScanDifficulty } from "@/lib/api";

export function ScanScreen({
  books,
  currentBook,
  onBack,
  onCapture,
  onSelectBook,
}: {
  books: Book[];
  currentBook: Book;
  onBack: () => void;
  onCapture: (difficulty: ScanDifficulty) => void;
  onSelectBook: (id: string) => void;
}) {
  const [torch, setTorch] = useState(false);
  const [difficulty, setDifficulty] = useState<ScanDifficulty>("Normal");

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <Header title="Scan Page" subtitle="Local demo scanner" onBack={onBack} />
      <FadeInView>
        <View style={styles.camera}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerBottomRight} />
          <Ionicons name="scan-outline" size={72} color={colors.surface} />
          <Text style={styles.cameraTitle}>Page detected</Text>
          <Text style={styles.cameraCopy}>Tap capture to create a local OCR scan from the sample passage.</Text>
        </View>
      </FadeInView>

      <Text style={styles.sectionTitle}>Choose book</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookStrip}>
        {books.map((book) => (
          <Pressable
            key={book.id}
            style={[styles.bookOption, book.id === currentBook.id && styles.bookOptionActive]}
            onPress={() => onSelectBook(book.id)}
          >
            <BookCover book={book} size="tiny" />
            <Text style={styles.bookOptionText} numberOfLines={1}>{book.title}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Explanation style</Text>
      <Pills items={["Simple", "Normal", "Academic"]} selected={difficulty} onChange={(item) => setDifficulty(item as ScanDifficulty)} />

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.iconButton, torch && styles.iconButtonActive]} onPress={() => setTorch((value) => !value)}>
          <Ionicons name={torch ? "flash" : "flash-outline"} size={22} color={torch ? colors.surface : colors.purple} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={() => onCapture(difficulty)}>
          <Ionicons name="camera" size={24} color={colors.surface} />
          <Text style={styles.captureText}>Capture Page</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  camera: {
    height: 360,
    borderRadius: 26,
    backgroundColor: "#20243A",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 22,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 34,
    left: 34,
    width: 76,
    height: 76,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: colors.purple,
  },
  cornerBottomRight: {
    position: "absolute",
    right: 34,
    bottom: 34,
    width: 76,
    height: 76,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: colors.purple,
  },
  cameraTitle: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 16,
  },
  cameraCopy: {
    color: "#D8DCEF",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 260,
    textAlign: "center",
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 12,
  },
  bookStrip: {
    gap: 10,
    paddingBottom: 18,
  },
  bookOption: {
    width: 132,
    minHeight: 72,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bookOptionActive: {
    borderColor: colors.purple,
    backgroundColor: colors.softPurple,
  },
  bookOptionText: {
    flex: 1,
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  iconButton: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.softPurple,
  },
  iconButtonActive: {
    backgroundColor: colors.purple,
  },
  captureButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: colors.purple,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  captureText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900",
  },
});
