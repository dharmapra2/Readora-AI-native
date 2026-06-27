import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BookCover } from "@/components/readora/BookCover";
import { FadeInView, Pills, SearchBar, sharedStyles } from "@/components/readora/Common";
import { colors, shadow } from "@/constants/readoraTheme";
import { Book } from "@/lib/api";

type NewBookInput = { title: string; author: string; totalPages?: number };

const filters = ["All", "Books", "PDFs", "Articles", "Notes"];

export function LibraryScreen({
  books,
  onAddBook,
  onOpen,
  onRemoveBook,
  onSelectBook,
  onUpdateProgress,
}: {
  books: Book[];
  onAddBook: (book: NewBookInput) => Promise<void> | void;
  onOpen: (screen: string) => void;
  onRemoveBook: (id: string) => Promise<void> | void;
  onSelectBook: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => Promise<void> | void;
}) {
  const [filter, setFilter] = useState(filters[0]);
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("220");

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return books.filter((book) => {
      const matchesQuery =
        !normalizedQuery ||
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery) ||
        book.chapterTitle.toLowerCase().includes(normalizedQuery);

      const matchesFilter =
        filter === "All" ||
        filter === "Books" ||
        filter === "PDFs" ||
        filter === "Articles" ||
        filter === "Notes";

      return matchesQuery && matchesFilter;
    });
  }, [books, filter, query]);

  const addDisabled = title.trim().length < 2 || author.trim().length < 2;

  const submitBook = () => {
    if (addDisabled) {
      return;
    }

    onAddBook({ title, author, totalPages: Number(pages) || 220 });
    setTitle("");
    setAuthor("");
    setPages("220");
    setShowAdd(false);
  };

  const openBook = (id: string) => {
    onSelectBook(id);
    onOpen("reader");
  };

  return (
    <View style={sharedStyles.screen}>
      <ScrollView contentContainerStyle={sharedStyles.scrollContent}>
        <View style={styles.header}>
          <Text style={sharedStyles.pageTitle}>Library</Text>
          <TouchableOpacity style={styles.addTopButton} onPress={() => setShowAdd(true)}>
            <Ionicons name="add" size={22} color={colors.surface} />
          </TouchableOpacity>
        </View>
        <SearchBar placeholder="Search books, authors, chapters..." value={query} onChangeText={setQuery} />
        <Pills items={filters} selected={filter} onChange={setFilter} />

        {filteredBooks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="library-outline" size={38} color={colors.purple} />
            <Text style={styles.emptyTitle}>No books found</Text>
            <Text style={styles.emptyCopy}>Try a different search or add a new local book.</Text>
          </View>
        ) : (
          filteredBooks.map((book, index) => (
            <FadeInView key={book.id} delay={index * 40}>
              <Pressable style={styles.row} onPress={() => openBook(book.id)}>
                <BookCover book={book} />
                <View style={styles.copy}>
                  <Text style={styles.title}>{book.title}</Text>
                  <Text style={styles.author}>{book.author}</Text>
                  <Text style={styles.chapter} numberOfLines={1}>{book.chapterTitle}</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${book.progress}%` }]} />
                  </View>
                  <View style={styles.rowActions}>
                    <TouchableOpacity onPress={() => onUpdateProgress(book.id, book.progress + 10)}>
                      <Text style={styles.actionText}>+10%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        onSelectBook(book.id);
                        onOpen("bookDetail");
                      }}
                    >
                      <Text style={styles.actionText}>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onUpdateProgress(book.id, Math.max(0, book.progress - 10))}>
                      <Text style={styles.actionText}>-10%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onRemoveBook(book.id)}>
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.progressText}>{book.progress}%</Text>
              </Pressable>
            </FadeInView>
          ))
        )}
      </ScrollView>

      <Modal animationType="slide" transparent visible={showAdd} onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modalScrim}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Book</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <Ionicons name="close" size={24} color={colors.ink} />
              </TouchableOpacity>
            </View>
            <FormInput label="Title" value={title} onChangeText={setTitle} placeholder="Book title" />
            <FormInput label="Author" value={author} onChangeText={setAuthor} placeholder="Author name" />
            <FormInput label="Pages" value={pages} onChangeText={setPages} placeholder="220" keyboardType="number-pad" />
            <TouchableOpacity style={[styles.saveButton, addDisabled && styles.saveDisabled]} onPress={submitBook} disabled={addDisabled}>
              <Text style={styles.saveText}>Save Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FormInput({
  keyboardType,
  label,
  onChangeText,
  placeholder,
  value,
}: {
  keyboardType?: "default" | "number-pad";
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <View style={styles.formGroup}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA0B4"
        style={styles.formInput}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addTopButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    ...shadow,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
  chapter: {
    color: "#596074",
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
  rowActions: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
  },
  actionText: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: "800",
  },
  removeText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "800",
  },
  progressText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 54,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  modalScrim: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(17,19,42,0.32)",
  },
  modal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "900",
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  formInput: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#F1F3F8",
    color: colors.ink,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  saveButton: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  saveDisabled: {
    opacity: 0.42,
  },
  saveText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900",
  },
});
