import { API_BASE } from './client';
import { getToken } from '../utils/auth';
import { COLLEGES } from '../constants/majors';


const COLLEGE_TO_MAJORS: Record<string, string[]> = Object.fromEntries(
  COLLEGES.map((c) => [c.name, c.majors.map((m) => m.value)])
) as Record<string, string[]>;


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


function mapPostSummary(p: any): PostSummary {
  return {
    id: p.id,
    title: p.title ?? '',
    subject: p.subject ?? '',
    professor: p.professor ?? '',
    major: p.major ?? 'unknown',
    uploadDate: (p.uploadDate ?? p.createdAt ?? '').toString().slice(0, 10),
    uploaderNickname: p.uploaderNickname ?? p.uploaderName ?? '익명',
    downloadCount: p.downloadCount ?? 0,
    points: p.points ?? 0,
  };
}


async function fetchAllPostsFromApiPosts(params?: {
  search?: string;
  major?: string;
  page?: number;
  size?: number;
}): Promise<PostSummary[]> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append('search', params.search);
  if (params?.major) searchParams.append('major', params.major);
  if (params?.page !== undefined) searchParams.append('page', params.page.toString());
  if (params?.size !== undefined) searchParams.append('size', params.size.toString());

  const queryString = searchParams.toString();
  const url = `${API_BASE}/api/posts${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('족보 목록을 불러오는데 실패했습니다.');

  const data = await res.json();
  const list = Array.isArray(data) ? data : data?.content ?? [];

  return list.map(mapPostSummary);
}


export const getPosts = async (params?: {
  search?: string;
  major?: string;
  page?: number;
  size?: number;
  college?: string;
}): Promise<PostListResponse> => {
  const search = (params?.search ?? '').trim().toLowerCase();
  const major = params?.major;
  const college = params?.college;

  if (major && major !== 'all') {
    let content = await fetchAllPostsFromApiPosts({ search: params?.search });

    content = content.filter((p) => p.major === major);

    if (search) {
      content = content.filter((x) =>
        (x.title + x.subject + x.professor).toLowerCase().includes(search)
      );
    }

    return {
      content,
      totalElements: content.length,
      totalPages: 1,
      currentPage: 0,
    };
  }

  if (college) {
    const majorsInCollege = COLLEGE_TO_MAJORS[college] ?? [];

    if (majorsInCollege.length === 0) {
      return { content: [], totalElements: 0, totalPages: 1, currentPage: 0 };
    }

    let content = await fetchAllPostsFromApiPosts({ search: params?.search });

    const allowed = new Set(majorsInCollege);
    content = content.filter((p) => allowed.has(p.major));

    content.sort((a, b) =>
      (b.uploadDate || '').localeCompare(a.uploadDate || '')
    );

    if (search) {
      content = content.filter((x) =>
        (x.title + x.subject + x.professor).toLowerCase().includes(search)
      );
    }

    return {
      content,
      totalElements: content.length,
      totalPages: 1,
      currentPage: 0,
    };
  }

  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append('search', params.search);
  if (params?.major) searchParams.append('major', params.major);
  if (params?.page !== undefined) searchParams.append('page', params.page.toString());
  if (params?.size !== undefined) searchParams.append('size', params.size.toString());

  const queryString = searchParams.toString();
  const url = `${API_BASE}/api/posts${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('족보 목록을 불러오는데 실패했습니다.');

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
  if (!token) throw new Error('로그인이 필요합니다.');

  const res = await fetch(`${API_BASE}/api/posts/${postId}/download`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
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
    const text = await res.text();
    throw new Error(text || '다운로드 실패');
  }

  return res.json();
};


export const uploadPost = async (
  params: PostUploadParams
): Promise<PostUploadResponse> => {
  const token = getToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('title', params.title);
  formData.append('subject', params.subject);
  formData.append('professor', params.professor);
  formData.append('major', params.major);

  const res = await fetch(`${API_BASE}/api/posts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || '업로드 실패');
  }

  return res.json();
};
