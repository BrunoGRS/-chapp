import { ApiError, hasApiBaseUrl, requestApi } from "@/services/apiClient";
import type { AuthSession, AuthUser, SignInPayload, SignUpPayload } from "@/types/auth";

type AuthApiResponse = {
  token?: string;
  accessToken?: string;
  user?: AuthUser;
};

function buildMockSession(payload: SignInPayload): AuthSession {
  const now = new Date().toISOString();
  return {
    token: `mock-token-${payload.email}`,
    user: {
      id: "local-user",
      name: payload.email.split("@")[0] || "Torcedor",
      email: payload.email,
      updatedAt: now,
    },
  };
}

function buildMockSignUpSession(payload: SignUpPayload): AuthSession {
  const now = new Date().toISOString();
  return {
    token: `mock-token-${payload.email}`,
    user: {
      id: "local-user",
      name: payload.name,
      email: payload.email,
      updatedAt: now,
    },
  };
}

function normalizeSession(data: AuthApiResponse, fallback: { id: string; name: string; email: string }): AuthSession {
  const token = data.token ?? data.accessToken;
  if (!token) {
    throw new ApiError("Token not provided by authentication endpoint", 500);
  }

  return {
    token,
    user: {
      id: data.user?.id ?? fallback.id,
      name: data.user?.name ?? fallback.name,
      email: data.user?.email ?? fallback.email,
      updatedAt: data.user?.updatedAt,
    },
  };
}

export async function signInRequest(payload: SignInPayload): Promise<AuthSession> {
  if (!hasApiBaseUrl()) {
    return buildMockSession(payload);
  }

  const loginPath = process.env.EXPO_PUBLIC_AUTH_LOGIN_PATH ?? "/auth/login";
  const data = await requestApi<AuthApiResponse>(loginPath, {
    method: "POST",
    withAuth: false,
    body: payload,
  });

  const fallbackName = payload.email.split("@")[0] || "Torcedor";

  return normalizeSession(data, {
    id: payload.email,
    name: fallbackName,
    email: payload.email,
  });
}

export async function signUpRequest(payload: SignUpPayload): Promise<AuthSession> {
  if (!hasApiBaseUrl()) {
    return buildMockSignUpSession(payload);
  }

  const registerPath = process.env.EXPO_PUBLIC_AUTH_REGISTER_PATH ?? "/auth/register";
  const data = await requestApi<AuthApiResponse>(registerPath, {
    method: "POST",
    withAuth: false,
    body: payload,
  });

  return normalizeSession(data, {
    id: payload.email,
    name: payload.name,
    email: payload.email,
  });
}
