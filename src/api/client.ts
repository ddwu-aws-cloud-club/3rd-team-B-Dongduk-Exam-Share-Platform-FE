export const API_BASE = import.meta.env.VITE_API_BASE;

interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
}

export async function apiFetch<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'omit',
  });

  if (!res.ok) {
    let errorMessage = 'API 오류가 발생했습니다.';

    try {
      const errorData: ErrorResponse = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }

    throw new Error(errorMessage);
  }

  return res.json();
}
