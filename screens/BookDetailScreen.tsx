import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BookCover } from "@/components/readora/BookCover";
import { sharedStyles } from "@/components/readora/Common";
import { Header } from "@/components/readora/Header";
import { colors } from "@/constants/readoraTheme";
import { Book, Note, Scan } from "@/lib/api";

export function BookDetailScreen({
  book,
  notes,
  onBack,
  onOpen,
  scans,
}: {
  book: Book;
  notes: Note[];
  onBack: () => void;
  onOpen: (screen: string) => void;
  scans: Scan[];
}) {
  const bookScans = scans.filter((scan) => scan.bookId === book.id);
  const bookNotes = notes.filter((note) => note.book === book.title);

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <Header title="Book Detail" subtitle={book.title} onBack={onBack} />
      <View style={styles.hero}>
        <BookCover book={book} size="large" />
        <View style={styles.heroCopy}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${book.progress}%` }]} />
          </View>
          <Text style={styles.meta}>{book.progress}% scanned</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onOpen("scan")}>
          <Ionicons name="scan-outline" size={18} color={colors.purple} />
          <Text style={styles.actionText}>Scan page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onOpen("summary")}>
          <Ionicons name="reader-outline" size={18} color={colors.purple} />
          <Text style={styles.actionText}>Summary</Text>
        </TouchableOpacity>
      </View>
      <Panel title="Scanned Pages">
        {(bookScans.length ? bookScans : []).map((scan) => (
          <Text key={scan.id} style={styles.rowText}>Page {scan.page}: {scan.text}</Text>
        ))}
        {bookScans.length === 0 && <Text style={styles.rowText}>No scans yet. Scan a page to start this book timeline.</Text>}
      </Panel>
      <Panel title="Key Insights">
        {bookNotes.slice(0, 3).map((note) => (
          <Text key={note.id} style={styles.rowText}>{note.text}</Text>
        ))}
        {bookNotes.length === 0 && <Text style={styles.rowText}>Saved explanations and notes appear here.</Text>}
      </Panel>
      <Panel title="Quiz History">
        <Text style={styles.rowText}>Latest score: 1 / 1 correct</Text>
        <Text style={styles.rowText}>Weak area: reward and reinforcement</Text>
      </Panel>
    </ScrollView>
  );
}

function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    flexDirection: "row",
    gap: 16,
  },
  heroCopy: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900",
  },
  author: {
    color: colors.muted,
    marginTop: 6,
    fontSize: 14,
  },
  progressTrack: {
    marginTop: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7F0",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.purple,
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 8,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.softPurple,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionText: {
    color: colors.purple,
    fontWeight: "900",
  },
  panel: {
    marginTop: 18,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  rowText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 9,
  },
});
