import { API_BASE } from './client';

export interface UploadResult {
  originalName: string;
  storedName: string;
  url: string;
  size: number;
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
