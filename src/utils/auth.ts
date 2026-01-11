const TOKEN_KEY = 'somshare_token';
const USER_EMAIL_KEY = 'somshare_user_email';

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
};

export const saveUserEmail = (email: string): void => {
  localStorage.setItem(USER_EMAIL_KEY, email);
};

export const getUserEmail = (): string | null => {
  return localStorage.getItem(USER_EMAIL_KEY);
};

export const isLoggedIn = (): boolean => {
  return getToken() !== null;
};

export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};
