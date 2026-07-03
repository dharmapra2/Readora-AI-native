import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/authStore";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Login failed", e.message ?? "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.root}>
      <View style={s.card}>
        <Text style={s.logo}>📚</Text>
        <Text style={s.title}>Welcome back</Text>
        <Text style={s.sub}>Sign in to your Readora account</Text>

        <TextInput
          style={s.input}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={s.input}
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleLogin}
        />

        <Pressable style={[s.btn, loading && s.btnDim]} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.btnText}>Sign in</Text>
          )}
        </Pressable>

        <View style={s.row}>
          <Text style={s.grey}>Don't have an account? </Text>
          <Pressable onPress={() => router.push("/register" as any)}>
            <Text style={s.link}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc", justifyContent: "center", padding: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  logo: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "800", color: "#1a1a2e", textAlign: "center" },
  sub: { fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 24, marginTop: 4 },
  input: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1a1a2e",
    marginBottom: 12,
    backgroundColor: "#f8fafc",
  },
  btn: {
    backgroundColor: "#6B4CFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  btnDim: { opacity: 0.7 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  row: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  grey: { color: "#64748b", fontSize: 13 },
  link: { color: "#6B4CFF", fontWeight: "700", fontSize: 13 },
});
