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
  uploaderId: number;
  uploaderNickname: string;
  downloadCount: number;
  points: number;
  likeCount: number;
  dislikeCount: number;
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
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.major) queryParams.append('major', params.major);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const url = `${API_BASE}/api/posts${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('게시글 목록을 불러오는데 실패했습니다.');
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

export interface RatingResponse {
  likeCount: number;
  dislikeCount: number;
  userRating: 'like' | 'dislike' | null;
}

export const ratePost = async (postId: number, type: 'like' | 'dislike'): Promise<RatingResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const res = await fetch(`${API_BASE}/api/posts/${postId}/rate?type=${type}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    let errorMessage = '평가 실패';
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

export const getDownloadedPostIds = async (): Promise<number[]> => {
  const token = getToken();
  if (!token) {
    return [];
  }

  try {
    const res = await fetch(`${API_BASE}/api/users/me/downloaded-posts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
};

export interface PostUpdateParams {
  title: string;
  subject: string;
  professor: string;
  major: string;
}

export const deletePost = async (postId: number): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    let errorMessage = '삭제 실패';
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      const text = await res.text();
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

export const updatePost = async (postId: number, params: PostUpdateParams): Promise<PostUploadResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    let errorMessage = '수정 실패';
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

// 업로드 내역 조회
export interface MyUploadItem {
  id: number;
  title: string;
  subject: string;
  professor: string;
  uploadDate: string;
  downloadCount: number;
  earnedPoints: number;
}

export interface MyUploadsResponse {
  content: MyUploadItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const getMyUploads = async (page = 0, size = 10): Promise<MyUploadsResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const res = await fetch(`${API_BASE}/api/users/me/uploads?page=${page}&size=${size}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('업로드 내역을 불러오는데 실패했습니다.');
  }

  return res.json();
};

// 다운로드 내역 조회
export interface MyDownloadItem {
  id: number;
  postId: number;
  title: string;
  subject: string;
  professor: string;
  downloadDate: string;
  pointsDeducted: number;
}

export interface MyDownloadsResponse {
  content: MyDownloadItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const getMyDownloads = async (page = 0, size = 10): Promise<MyDownloadsResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const res = await fetch(`${API_BASE}/api/users/me/downloads?page=${page}&size=${size}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('다운로드 내역을 불러오는데 실패했습니다.');
  }

  return res.json();
};
