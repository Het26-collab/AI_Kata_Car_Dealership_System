import type { ApiErrorResponse } from "../types/api";

// In dev, Vite proxies /api -> http://localhost:4000 (see vite.config.ts),
// so a relative base URL works for both dev and a same-origin production
// deployment. Override with VITE_API_URL if the backend is hosted elsewhere.
const PRODUCTION_RAILWAY_URL = "https://aikatacardealershipsystem-production.up.railway.app/api";

function getBaseUrl(): string {
  if (import.meta.env.DEV) {
    return "/api";
  }
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.startsWith("http")) {
    const clean = envUrl.replace(/\/+$/, "");
    return clean.endsWith("/api") ? clean : `${clean}/api`;
  }
  return PRODUCTION_RAILWAY_URL;
}

export const BASE_URL = getBaseUrl();

export class ApiError extends Error {
  status: number;
  errors?: string[];

  constructor(message: string, status: number, errors?: string[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("driveflow_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : undefined;

  if (!res.ok) {
    const errBody = body as ApiErrorResponse | undefined;
    const message =
      errBody?.error ?? errBody?.errors?.join(" ") ?? `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, errBody?.errors);
  }

  return body as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data !== undefined ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PUT", body: data !== undefined ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
