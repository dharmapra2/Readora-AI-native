import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useMemo, useState } from "react";
import { FlatList, ListRenderItem, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Pills, SearchBar, sharedStyles } from "@/components/readora/Common";
import { colors } from "@/constants/readoraTheme";

type Note = { id: string; book: string; text: string; type: string; chapter: string; tone: string };

const NoteCard = memo(function NoteCard({ note, onOpen }: { note: Note; onOpen: (screen: string) => void }) {
  return (
    <Pressable style={[styles.card, { backgroundColor: note.tone }]} onPress={() => onOpen("reader")}>
      <Text style={styles.text}>{`"${note.text}"`}</Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>{note.chapter} - {note.book}</Text>
        <Ionicons name={note.type === "Highlight" ? "star" : "reader-outline"} size={17} color={colors.ink} />
      </View>
    </Pressable>
  );
});

export function NotesScreen({ notes, onOpen }: { notes: Note[]; onOpen: (screen: string) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesQuery = !q || note.text.toLowerCase().includes(q) || note.book.toLowerCase().includes(q) || note.chapter.toLowerCase().includes(q);
      const matchesFilter = filter === "All" || note.type === filter || (filter === "AI Notes" && note.type === "AI Note");
      return matchesQuery && matchesFilter;
    });
  }, [filter, notes, query]);

  const renderItem = useCallback<ListRenderItem<Note>>(
    ({ item }) => <NoteCard note={item} onOpen={onOpen} />,
    [onOpen],
  );

  return (
    <View style={sharedStyles.screen}>
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={sharedStyles.scrollContent}
        removeClippedSubviews
        maxToRenderPerBatch={12}
        windowSize={5}
        ListHeaderComponent={
          <>
            <Text style={sharedStyles.pageTitle}>Notes & Highlights</Text>
            <SearchBar placeholder="Search notes..." value={query} onChangeText={setQuery} />
            <Pills items={["All", "Highlight", "Note", "AI Notes"]} selected={filter} onChange={setFilter} trailingIcon />
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={36} color={colors.purple} />
            <Text style={styles.emptyTitle}>No notes found</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={() => onOpen("reader")}>
        <Ionicons name="add" size={30} color={colors.surface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(17,19,42,0.08)",
    padding: 18,
    marginBottom: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 10,
  },
  text: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "700",
  },
  footer: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  addButton: {
    position: "absolute",
    right: 28,
    bottom: 98,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
});
