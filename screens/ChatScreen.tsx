import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/readora/Header";
import { sharedStyles } from "@/components/readora/Common";
import { colors } from "@/constants/readoraTheme";
import { Book } from "@/lib/api";

export function ChatScreen({
  book,
  chat,
  onBack,
  onOpen,
  inTab,
}: {
  book: Book;
  chat: { prompt: string; answer: string; suggestions: string[] };
  onBack?: () => void;
  onOpen: (screen: string) => void;
  inTab?: boolean;
}) {
  return (
    <View style={sharedStyles.screen}>
      <Header
        title="AI Companion"
        subtitle={book.title}
        onBack={onBack}
        right={<Ionicons name="ellipsis-horizontal" size={23} color={colors.ink} />}
      />
      <ScrollView contentContainerStyle={[styles.content, inTab && styles.tabContent]}>
        <View style={styles.userBubble}>
          <Text style={styles.userBubbleText}>{chat.prompt}</Text>
        </View>
        <View style={styles.aiBubble}>
          <Text style={styles.aiAnswer}>{chat.answer}</Text>
        </View>
        <Text style={sharedStyles.sectionHeading}>Suggested Prompts</Text>
        <View style={styles.promptWrap}>
          {chat.suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={suggestion}
              style={styles.promptChip}
              onPress={() => onOpen(index === 1 ? "summary" : index === 3 ? "quiz" : "chat")}
            >
              <Text style={styles.promptChipText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.inputBar, inTab && styles.tabInputBar]}>
        <TextInput placeholder="Ask anything..." placeholderTextColor="#9AA0B4" style={styles.input} />
        <Ionicons name="mic-outline" size={22} color={colors.ink} />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="arrow-up" size={18} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 110,
  },
  tabContent: {
    paddingBottom: 190,
  },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "82%",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
    borderTopRightRadius: 18,
    backgroundColor: colors.purple,
    padding: 16,
    marginBottom: 28,
  },
  userBubbleText: {
    color: colors.surface,
    fontSize: 15,
    lineHeight: 22,
  },
  aiBubble: {
    maxWidth: "84%",
    borderRadius: 18,
    backgroundColor: "#F4F4F6",
    padding: 18,
    marginBottom: 32,
  },
  aiAnswer: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 25,
  },
  promptWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  promptChip: {
    borderRadius: 12,
    backgroundColor: colors.softPurple,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  promptChipText: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: "700",
  },
  inputBar: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 24,
    minHeight: 58,
    borderRadius: 22,
    backgroundColor: "#F0F1F5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  tabInputBar: {
    bottom: 104,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
});
