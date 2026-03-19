import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { signInRequest, signUpRequest } from "@/services/auth.service";
import { setApiToken } from "@/services/apiClient";
import type { AuthSession, AuthUser, SignInPayload, SignUpPayload } from "@/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  signIn: (payload: SignInPayload) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

const AUTH_STORAGE_KEY = "chapp.auth.session";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const applySession = useCallback(async (session: AuthSession | null) => {
    if (!session) {
      setApiToken(null);
      setToken(null);
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    setApiToken(session.token);
    setToken(session.token);
    setUser(session.user);
    setStatus("authenticated");
  }, []);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const storedSession = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);
        if (!storedSession) {
          await applySession(null);
          return;
        }

        const parsed = JSON.parse(storedSession) as AuthSession;
        if (!parsed?.token) {
          await applySession(null);
          return;
        }

        await applySession(parsed);
      } catch {
        await applySession(null);
      }
    };

    void bootstrapSession();
  }, [applySession]);

  const signIn = useCallback(
    async (payload: SignInPayload) => {
      const session = await signInRequest(payload);
      await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(session));
      await applySession(session);
    },
    [applySession]
  );

  const signOut = useCallback(async () => {
    await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY);
    await applySession(null);
  }, [applySession]);

  const signUp = useCallback(
    async (payload: SignUpPayload) => {
      const session = await signUpRequest(payload);
      await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(session));
      await applySession(session);
    },
    [applySession]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      isAuthenticated: status === "authenticated",
      token,
      user,
      signIn,
      signUp,
      signOut,
    }),
    [status, token, user, signIn, signOut, signUp]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
