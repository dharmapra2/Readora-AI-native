import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/authStore";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email.trim() || !username.trim() || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await register(email.trim().toLowerCase(), username.trim(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Registration failed", e.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={s.root}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.card}>
          <Text style={s.logo}>📚</Text>
          <Text style={s.title}>Create account</Text>
          <Text style={s.sub}>Start your reading journey with Readora</Text>

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
            placeholder="Username (letters, numbers, _ -)"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={s.input}
            placeholder="Password (min 8 chars)"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={s.input}
            placeholder="Confirm password"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            onSubmitEditing={handleRegister}
          />

          <Pressable style={[s.btn, loading && s.btnDim]} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.btnText}>Create account</Text>
            )}
          </Pressable>

          <View style={s.row}>
            <Text style={s.grey}>Already have an account? </Text>
            <Pressable onPress={() => router.push("/login" as any)}>
              <Text style={s.link}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
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
