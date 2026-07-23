import { apiClient } from "../api/client";
import type { ApiItemResponse, AuthResult, LoginPayload, RegisterPayload, User } from "../types/api";

export const authService = {
  register: (payload: RegisterPayload) =>
    apiClient.post<ApiItemResponse<User>>("/auth/register", payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    apiClient.post<ApiItemResponse<AuthResult>>("/auth/login", payload).then((r) => r.data),

  me: () => apiClient.get<ApiItemResponse<User>>("/auth/me").then((r) => r.data),
};
