import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, shadow } from "@/constants/readoraTheme";
import { sharedStyles } from "@/components/readora/Common";

export function OnboardingScreen({ onStart }: { onStart: () => void }) {
  const float = useRef(new Animated.Value(0)).current;
  const intro = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(intro, {
      duration: 420,
      toValue: 1,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          duration: 1400,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          duration: 1400,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [float, intro]);

  const heroTranslate = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <View style={[sharedStyles.screen, styles.screen]}>
      <Animated.View style={{ opacity: intro, transform: [{ translateY: intro.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }}>
        <Text style={styles.title}>
          <Text style={styles.accent}>AI</Text> Reading{"\n"}
          <Text style={styles.accent}>Companion</Text>
        </Text>
        <Text style={styles.copy}>
          Understand more.{"\n"}Remember longer.{"\n"}Grow every day.
        </Text>
      </Animated.View>
      <Animated.View style={[styles.heroArt, { transform: [{ translateY: heroTranslate }] }]}>
        <View style={styles.personHead}>
          <View style={styles.hair} />
          <View style={styles.face} />
        </View>
        <View style={styles.personBody}>
          <View style={styles.openBook}>
            <View style={styles.bookPage} />
            <View style={styles.bookPage} />
          </View>
        </View>
        <View style={styles.bot}>
          <Text style={styles.botFace}>AI</Text>
        </View>
      </Animated.View>
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={onStart}>
        <Text style={styles.primaryButtonText}>Get Started</Text>
        <Ionicons name="arrow-forward" color={colors.surface} size={18} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 30,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  title: {
    marginTop: 48,
    color: "#1F2252",
    fontSize: 33,
    fontWeight: "800",
    lineHeight: 39,
  },
  accent: {
    color: colors.purple,
  },
  copy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 26,
    marginTop: 24,
  },
  heroArt: {
    height: 360,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  personHead: {
    position: "absolute",
    top: 54,
    left: 76,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F7BE8B",
    zIndex: 2,
  },
  hair: {
    position: "absolute",
    top: -10,
    left: -6,
    right: 12,
    height: 46,
    borderRadius: 30,
    backgroundColor: "#2D174E",
  },
  face: {
    position: "absolute",
    top: 42,
    left: 28,
    width: 42,
    height: 18,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderBottomWidth: 3,
    borderBottomColor: "#8A4B38",
  },
  personBody: {
    ...shadow,
    width: 220,
    height: 210,
    borderTopLeftRadius: 96,
    borderTopRightRadius: 96,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    backgroundColor: "#6C42DB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.purple,
    shadowOpacity: 0.35,
    shadowRadius: 28,
  },
  openBook: {
    flexDirection: "row",
    transform: [{ rotate: "-4deg" }],
  },
  bookPage: {
    width: 82,
    height: 86,
    marginHorizontal: 3,
    borderRadius: 12,
    backgroundColor: "#211845",
  },
  bot: {
    position: "absolute",
    right: 15,
    top: 104,
    width: 92,
    height: 78,
    borderRadius: 36,
    backgroundColor: "#DDF2FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: colors.surface,
  },
  botFace: {
    width: 58,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2842B8",
    color: "#BFF7FF",
    textAlign: "center",
    lineHeight: 36,
    fontWeight: "800",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 18,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D9D5FF",
  },
  dotActive: {
    width: 36,
    backgroundColor: colors.surface,
  },
  primaryButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "800",
    fontSize: 15,
  },
});
