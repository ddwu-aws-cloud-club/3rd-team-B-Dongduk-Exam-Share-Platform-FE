import { API_BASE } from './client';
import { getToken } from '../utils/auth';

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

export interface PostSummary {
  id: number;
  title: string;
  subject: string;
  professor: string;
  major: string;
  uploadDate: string;
  uploaderNickname: string;
  downloadCount: number;
  points: number;
}

export interface PostListResponse {
  content: PostSummary[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const getPosts = async (params?: {
  search?: string;
  major?: string;
  page?: number;
  size?: number;
}): Promise<PostListResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append('search', params.search);
  if (params?.major) searchParams.append('major', params.major);
  if (params?.page !== undefined) searchParams.append('page', params.page.toString());
  if (params?.size !== undefined) searchParams.append('size', params.size.toString());

  const queryString = searchParams.toString();
  const url = `${API_BASE}/api/posts${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('족보 목록을 불러오는데 실패했습니다.');
  }

  return res.json();
};

export interface DownloadResponse {
  pdfUrl: string;
  fileName: string;
  pointsDeducted: number;
  remainingPoints: number;
  message: string;
}

export interface AlreadyDownloadedResponse {
  message: string;
  status: number;
  pdfUrl: string;
  fileName: string;
}

export const downloadPost = async (postId: number): Promise<DownloadResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const res = await fetch(`${API_BASE}/api/posts/${postId}/download`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 409) {
    // 이미 다운로드한 경우 - 포인트 차감 없이 URL 반환
    const data: AlreadyDownloadedResponse = await res.json();
    return {
      pdfUrl: data.pdfUrl,
      fileName: data.fileName,
      pointsDeducted: 0,
      remainingPoints: 0,
      message: data.message,
    };
  }

  if (!res.ok) {
    let errorMessage = '다운로드 실패';
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

