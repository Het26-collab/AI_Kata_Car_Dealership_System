export interface ApiListResponse<T> {
  data: T[];
  total: number;
  limit?: number;
  offset?: number;
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error?: string;
  errors?: string[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  dealership: string;
  email: string;
  avatar: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResult {
  token: string;
  user: User;
}
