import { Ionicons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Header } from "@/components/readora/Header";
import { sharedStyles } from "@/components/readora/Common";
import { colors } from "@/constants/readoraTheme";
import { Book } from "@/lib/api";
import { api, ChatMessage } from "@/lib/apiService";

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "user", content: chat.prompt },
    { role: "assistant", content: chat.answer },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      const userMsg: ChatMessage = { role: "user", content: trimmed };
      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setLoading(true);
      scrollRef.current?.scrollToEnd({ animated: true });
      try {
        const res = await api.chat(next, book.title);
        setMessages([...next, { role: "assistant", content: res.reply }]);
      } catch {
        setMessages([
          ...next,
          { role: "assistant", content: "Sorry, I couldn't reach the AI. Please check your connection." },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
      }
    },
    [messages, loading, book.title],
  );

  return (
    <KeyboardAvoidingView
      style={sharedStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={inTab ? 88 : 0}
    >
      <Header
        title="AI Companion"
        subtitle={book.title}
        onBack={onBack}
        right={<Ionicons name="ellipsis-horizontal" size={23} color={colors.ink} />}
      />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, inTab && styles.tabContent]}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <View key={i} style={styles.userBubble}>
              <Text style={styles.userBubbleText}>{msg.content}</Text>
            </View>
          ) : (
            <View key={i} style={styles.aiBubble}>
              <Text style={styles.aiAnswer}>{msg.content}</Text>
            </View>
          ),
        )}
        {loading && (
          <View style={styles.aiBubble}>
            <ActivityIndicator color={colors.purple} size="small" />
          </View>
        )}
        <Text style={[sharedStyles.sectionHeading, styles.suggestLabel]}>Suggested Prompts</Text>
        <View style={styles.promptWrap}>
          {chat.suggestions.map((s) => (
            <TouchableOpacity key={s} style={styles.promptChip} onPress={() => send(s)}>
              <Text style={styles.promptChipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.inputBar, inTab && styles.tabInputBar]}>
        <TextInput
          placeholder="Ask anything..."
          placeholderTextColor="#9AA0B4"
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send(input)}
          returnKeyType="send"
          editable={!loading}
        />
        <Ionicons name="mic-outline" size={22} color={colors.ink} />
        <TouchableOpacity style={styles.sendButton} onPress={() => send(input)} disabled={loading}>
          <Ionicons name="arrow-up" size={18} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  suggestLabel: {
    marginTop: 8,
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
    marginBottom: 16,
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
    marginBottom: 16,
    minHeight: 48,
    justifyContent: "center",
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
