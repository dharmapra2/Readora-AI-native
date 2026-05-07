import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookCover } from "@/components/readora/BookCover";
import { FadeInView, QuickAction, SectionTitle, sharedStyles } from "@/components/readora/Common";
import { colors } from "@/constants/readoraTheme";
import { Book } from "@/lib/api";

export function HomeScreen({
  books,
  currentBook,
  onSelectBook,
  user,
  onOpen,
}: {
  books: Book[];
  currentBook: Book;
  onSelectBook: (id: string) => void;
  user: { name: string; avatar: string };
  onOpen: (screen: string) => void;
}) {
  const openBook = (book: Book) => {
    onSelectBook(book.id);
    onOpen("reader");
  };

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <View style={styles.header}>
        <View>
          <Text style={sharedStyles.smallKicker}>Good morning,</Text>
          <Text style={styles.h1}>{user.name}</Text>
        </View>
        <View style={styles.headerActions}>
          <Ionicons name="notifications-outline" size={22} color={colors.ink} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.avatar}</Text>
          </View>
        </View>
      </View>

      <FadeInView>
        <Pressable style={styles.continueCard} onPress={() => openBook(currentBook)}>
          <BookCover book={currentBook} size="large" />
          <View style={styles.continueCopy}>
            <Text style={styles.continueLabel}>Continue Reading</Text>
            <Text style={styles.cardTitle}>{currentBook.title}</Text>
            <Text style={styles.cardMeta}>{currentBook.author}</Text>
            <View style={styles.smallButton}>
              <Text style={styles.smallButtonText}>Continue</Text>
            </View>
            <Text style={styles.timeLeft}>{currentBook.minutesLeft} min left in this chapter</Text>
          </View>
          <View style={styles.ring}>
            <Text style={styles.ringText}>{currentBook.progress}%</Text>
          </View>
        </Pressable>
      </FadeInView>

      <SectionTitle title="Continue Reading" action="See all" onPress={() => onOpen("library")} />
      <View style={styles.bookRow}>
        {books.slice(1, 4).map((book) => (
          <Pressable key={book.id} style={styles.bookTile} onPress={() => openBook(book)}>
            <BookCover book={book} />
            <Text style={styles.bookName} numberOfLines={1}>{book.title}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[sharedStyles.sectionHeading, styles.actionTitle]}>AI Quick Actions</Text>
      <View style={styles.actionGrid}>
        <QuickAction icon="document-text-outline" label="Summarize" onPress={() => onOpen("summary")} />
        <QuickAction icon="chatbubble-ellipses-outline" label="Ask AI" onPress={() => onOpen("chat")} />
        <QuickAction icon="albums-outline" label="Flashcards" onPress={() => onOpen("flashcards")} />
        <QuickAction icon="scan-outline" label="Scan" onPress={() => onOpen("scan")} />
      </View>

      <SectionTitle title="Recommended for you" action="See all" onPress={() => onOpen("library")} />
      <View style={styles.recommendBand}>
        {books.slice(2, 5).map((book) => (
          <Pressable key={book.id} style={styles.recommendChip} onPress={() => openBook(book)}>
            <BookCover book={book} size="tiny" />
            <Text style={styles.recommendText} numberOfLines={1}>{book.title}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 22,
  },
  h1: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#BFD5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#704323",
    fontWeight: "900",
  },
  continueCard: {
    minHeight: 188,
    borderRadius: 18,
    backgroundColor: colors.purple,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  continueCopy: {
    flex: 1,
  },
  continueLabel: {
    color: colors.surface,
    fontWeight: "800",
    marginBottom: 12,
  },
  cardTitle: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: "800",
  },
  cardMeta: {
    color: "#ECE8FF",
    marginTop: 3,
    fontSize: 12,
  },
  smallButton: {
    alignSelf: "flex-start",
    marginTop: 14,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  smallButtonText: {
    color: colors.ink,
    fontWeight: "800",
    fontSize: 12,
  },
  timeLeft: {
    color: colors.surface,
    fontSize: 12,
    marginTop: 14,
    fontWeight: "700",
  },
  ring: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  ringText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "800",
  },
  bookRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18,
  },
  bookTile: {
    flex: 1,
  },
  bookName: {
    marginTop: 10,
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  bookAuthor: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  actionTitle: {
    marginTop: 24,
  },
  actionGrid: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  recommendBand: {
    flexDirection: "row",
    gap: 10,
  },
  recommendChip: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recommendText: {
    flex: 1,
    color: colors.ink,
    fontSize: 11,
    fontWeight: "800",
  },
});
