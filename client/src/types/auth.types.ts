export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
