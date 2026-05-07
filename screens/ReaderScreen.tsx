import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/readora/Header";
import { colors, shadow } from "@/constants/readoraTheme";
import { Book } from "@/lib/api";

export function ReaderScreen({
  book,
  reader,
  onBack,
  onOpen,
}: {
  book: Book;
  reader: { quote: string; paragraphs: string[]; highlight: string };
  onBack: () => void;
  onOpen: (screen: string) => void;
}) {
  return (
    <View style={styles.screen}>
      <Header
        title={book.chapter}
        subtitle={book.chapterTitle}
        onBack={onBack}
        right={<Ionicons name="bookmark-outline" size={23} color={colors.ink} />}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.quote}>{`"${reader.quote}"`}</Text>
        <Text style={styles.paragraph}>{reader.paragraphs[0]}</Text>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>{reader.highlight}</Text>
        </View>
        <Text style={styles.paragraph}>{reader.paragraphs[2]}</Text>
      </ScrollView>
      <View style={styles.toolbar}>
        <ToolButton icon="bulb-outline" label="Explain" onPress={() => onOpen("chat")} />
        <ToolButton icon="reader-outline" label="Summarize" onPress={() => onOpen("summary")} />
        <ToolButton icon="heart-outline" label="Ask AI" onPress={() => onOpen("chat")} />
        <ToolButton icon="pencil-outline" label="Highlight" onPress={() => onOpen("notes")} accent="#F59E0B" />
      </View>
      <View style={styles.footer}>
        <Text style={styles.roundText}>Aa</Text>
        <Text style={styles.pageCount}>{book.pagesRead} / {book.totalPages}</Text>
        <Ionicons name="moon-outline" size={20} color={colors.ink} />
      </View>
      <TouchableOpacity style={styles.spark} onPress={() => onOpen("chat")}>
        <Ionicons name="sparkles" size={22} color={colors.surface} />
      </TouchableOpacity>
    </View>
  );
}

function ToolButton({
  icon,
  label,
  onPress,
  accent = colors.ink,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  accent?: string;
}) {
  return (
    <TouchableOpacity style={styles.toolButton} onPress={onPress}>
      <Ionicons name={icon} size={20} color={accent} />
      <Text style={styles.toolLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 34,
    paddingTop: 28,
    paddingBottom: 190,
  },
  quote: {
    color: colors.ink,
    fontSize: 22,
    lineHeight: 34,
    fontWeight: "700",
    marginBottom: 28,
  },
  paragraph: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 33,
    marginBottom: 22,
  },
  highlightBox: {
    borderRadius: 12,
    backgroundColor: "#EEE8FF",
    padding: 18,
    marginBottom: 20,
    borderRightWidth: 4,
    borderRightColor: colors.purple,
  },
  highlightText: {
    color: "#302169",
    fontSize: 17,
    lineHeight: 27,
  },
  toolbar: {
    ...shadow,
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 86,
    minHeight: 76,
    borderRadius: 16,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  toolButton: {
    alignItems: "center",
    gap: 7,
  },
  toolLabel: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roundText: {
    color: colors.ink,
    backgroundColor: "#F3F5FA",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontWeight: "800",
  },
  pageCount: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  spark: {
    position: "absolute",
    right: 28,
    bottom: 178,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
});
