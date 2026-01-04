import { apiFetch } from './client';

interface LoginResponse {
  token?: string;
  message?: string;
}

interface SignupResponse {
  email: string;
  message: string;
}

interface VerificationResponse {
  message: string;
}

export const sendVerificationCode = async (email: string): Promise<VerificationResponse> => {
  return apiFetch<VerificationResponse>('/api/auth/send-verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
};

export const verifyCode = async (email: string, code: string): Promise<VerificationResponse> => {
  return apiFetch<VerificationResponse>('/api/auth/verify-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  });
};

export const signup = async (email: string, password: string): Promise<SignupResponse> => {
  return apiFetch<SignupResponse>('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};

interface ProfileSetupData {
  email: string;
  nickname: string;
  college: string;
  major: string;
  profileImage: File | null;
}

interface ProfileSetupResponse {
  message: string;
}

export const setupProfile = async (data: ProfileSetupData): Promise<ProfileSetupResponse> => {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('nickname', data.nickname);
  formData.append('college', data.college);
  formData.append('major', data.major);

  if (data.profileImage) {
    formData.append('profileImage', data.profileImage);
  }

  const response = await fetch('/api/auth/profile-setup', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || 'Failed to setup profile');
  }

  return response.json();
};
