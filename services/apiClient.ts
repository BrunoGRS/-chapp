export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const rawApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";
const apiBaseUrl = rawApiBaseUrl.replace(/\/$/, "");

let authToken: string | null = null;

export function setApiToken(token: string | null) {
  authToken = token;
}

type RequestOptions = Omit<RequestInit, "headers" | "body"> & {
  headers?: Record<string, string>;
  body?: unknown;
  withAuth?: boolean;
};

export async function requestApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!apiBaseUrl) {
    throw new ApiError("API base URL not configured", 500);
  }

  const { body, headers, withAuth = true, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers ?? {}),
  };

  if (withAuth && authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errorData = (await response.json()) as { message?: string };
      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      // Keep fallback message when response body is not JSON.
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function hasApiBaseUrl() {
  return Boolean(apiBaseUrl);
}
