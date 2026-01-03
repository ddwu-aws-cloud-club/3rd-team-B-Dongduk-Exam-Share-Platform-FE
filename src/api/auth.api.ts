import { apiFetch } from './client';

interface LoginResponse {
  token?: string;
  message?: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};
