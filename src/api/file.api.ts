import { API_BASE } from './client';
import { getToken } from '../utils/auth';

export interface UploadResult {
  originalName: string;
  storedName: string;
  url: string;
  size: number;
}

export interface PostUploadParams {
  file: File;
  title: string;
  subject: string;
  professor: string;
  major: string;
}

export interface PostUploadResponse {
  id: number;
  title: string;
  subject: string;
  professor: string;
  major: string;
  pdfUrl: string;
  uploadDate: string;
  earnedPoints: number;
  message: string;
}

export const uploadFile = async (file: File): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || '업로드 실패');
  }

  return res.json();
};

export const uploadPost = async (params: PostUploadParams): Promise<PostUploadResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('title', params.title);
  formData.append('subject', params.subject);
  formData.append('professor', params.professor);
  formData.append('major', params.major);

  const res = await fetch(`${API_BASE}/api/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    let errorMessage = '업로드 실패';
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      const text = await res.text();
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return res.json();
};
