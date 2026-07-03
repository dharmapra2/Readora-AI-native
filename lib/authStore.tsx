import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { authApi, tokenStore, UserRecord } from "./apiService";
import { registerForPushNotifications } from "./notifications";

type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; user: UserRecord };

type AuthStore = {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthStore | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ status: "loading" });

  // On mount: check for existing token
  useEffect(() => {
    (async () => {
      const token = await tokenStore.get();
      if (!token) {
        setAuthState({ status: "unauthenticated" });
        return;
      }
      try {
        const user = await authApi.me();
        setAuthState({ status: "authenticated", user });
      } catch {
        await tokenStore.clear();
        setAuthState({ status: "unauthenticated" });
      }
    })();
  }, []);

  const _registerPushToken = useCallback(async () => {
    try {
      const token = await registerForPushNotifications();
      if (token) await authApi.updatePushToken(token);
    } catch {
      // Non-critical — app works without push notifications
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login(email, password);
    const user = await authApi.me();
    setAuthState({ status: "authenticated", user });
    _registerPushToken();
  }, [_registerPushToken]);

  const register = useCallback(async (email: string, username: string, password: string) => {
    await authApi.register(email, username, password);
    const user = await authApi.me();
    setAuthState({ status: "authenticated", user });
    _registerPushToken();
  }, [_registerPushToken]);

  const logout = useCallback(async () => {
    await authApi.logout();
    setAuthState({ status: "unauthenticated" });
  }, []);

  const refreshUser = useCallback(async () => {
    const user = await authApi.me();
    setAuthState({ status: "authenticated", user });
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useUser(): UserRecord {
  const { authState } = useAuth();
  if (authState.status !== "authenticated") throw new Error("Not authenticated");
  return authState.user;
}
