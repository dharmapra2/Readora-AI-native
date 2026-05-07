import { StyleSheet, Text, View } from "react-native";

import { colors, shadow } from "@/constants/readoraTheme";
import { Book } from "@/lib/api";

type CoverSize = "tiny" | "normal" | "large";

export function BookCover({ book, size = "normal" }: { book: Book; size?: CoverSize }) {
  return (
    <View
      style={[
        styles.cover,
        size === "large" && styles.large,
        size === "tiny" && styles.tiny,
        { backgroundColor: book.coverColor },
      ]}
    >
      <Text
        numberOfLines={3}
        style={[
          styles.title,
          book.coverColor === "#111827" && styles.lightTitle,
          size === "tiny" && styles.tinyTitle,
        ]}
      >
        {book.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    ...shadow,
    width: 64,
    height: 92,
    borderRadius: 8,
    padding: 7,
    justifyContent: "center",
  },
  large: {
    width: 78,
    height: 112,
  },
  tiny: {
    width: 34,
    height: 48,
    borderRadius: 5,
    padding: 4,
  },
  title: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
  lightTitle: {
    color: colors.surface,
  },
  tinyTitle: {
    fontSize: 7,
  },
});
