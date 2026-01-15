import { apiFetch } from './client';

const getAuthHeaders = () : Record<string, string> => {
  const token = localStorage.getItem('accessToken'); 
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export interface PointHistoryItem {
  id: number;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

export interface PointHistoryResponse {
  content: PointHistoryItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface UploadCompleteRequest {
  fileName: string;
  originalName: string;
  fileSize: number;
  description: string;
}

export const getPointBalance = async (): Promise<number> => {
  return apiFetch<number>('/api/points/balance', {
    method: 'GET',
    headers: getAuthHeaders(), 
  });
};

export const reducePoints = async (fileId: number, description: string): Promise<string> => {
  return apiFetch<string>('/api/points/reduce', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(), 
    },
    body: JSON.stringify({ fileId, description }),
  });
};

export const getPointHistory = async (type: string = 'ALL', page: number = 0, size: number = 20): Promise<PointHistoryResponse> => {
  const params = new URLSearchParams({
    type,
    page: page.toString(),
    size: size.toString(),
  }).toString();

  return apiFetch<PointHistoryResponse>(`/api/points/history?${params}`, {
    method: 'GET',
    headers: getAuthHeaders(), 
  });
};

export const completeUpload = async (data: UploadCompleteRequest): Promise<void> => {
  return apiFetch<void>('/api/points/upload-complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(), 
    },
    body: JSON.stringify(data),
  });
};