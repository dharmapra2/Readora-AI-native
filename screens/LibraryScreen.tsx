import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCover } from "@/components/readora/BookCover";
import { Pills, SearchBar, sharedStyles } from "@/components/readora/Common";
import { colors } from "@/constants/readoraTheme";
import { Book } from "@/lib/api";

export function LibraryScreen({ books, onOpen }: { books: Book[]; onOpen: (screen: string) => void }) {
  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <Text style={sharedStyles.pageTitle}>Library</Text>
      <SearchBar placeholder="Search books, notes..." />
      <Pills items={["All", "Books", "PDFs", "Articles", "Notes"]} />
      {books.map((book) => (
        <Pressable key={book.id} style={styles.row} onPress={() => onOpen("reader")}>
          <BookCover book={book} />
          <View style={styles.copy}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${book.progress}%` }]} />
            </View>
          </View>
          <Text style={styles.progressText}>{book.progress}%</Text>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.ink} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  copy: {
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
  },
  author: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  progressTrack: {
    marginTop: 11,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E7F0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.purple,
  },
  progressText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
});
