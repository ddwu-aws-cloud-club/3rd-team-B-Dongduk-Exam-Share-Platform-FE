import { useMemo, useRef, useState, type DragEvent } from "react";

type UploadResult = {
  originalName: string;
  storedName: string;
  url: string;
  size: number;
};

const API_BASE = "http://localhost:8080";

export default function PdfDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const fileInfo = useMemo(() => {
    if (!file) return null;
    return `${file.name} (${Math.round(file.size / 1024)} KB)`;
  }, [file]);

  const validatePdf = (f: File) => {
    const nameOk = f.name.toLowerCase().endsWith(".pdf");
    const typeOk = f.type === "application/pdf";
    if (!nameOk && !typeOk) return "PDF 파일만 업로드할 수 있어요.";
    if (f.size > 20 * 1024 * 1024)
      return "파일은 최대 20MB까지 업로드할 수 있어요.";
    return "";
  };

  const onPick = (f: File) => {
    const msg = validatePdf(f);
    if (msg) {
      setError(msg);
      setFile(null);
      setResult(null);
      return;
    }
    setError("");
    setResult(null);
    setFile(f);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const f = e.dataTransfer.files?.[0];
    if (f) onPick(f);
  };

  const onUpload = async () => {
    if (!file) {
      setError("업로드할 PDF를 선택해 주세요.");
      return;
    }
    setUploading(true);
    setError("");
    setResult(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${API_BASE}/api/files/upload`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "업로드 실패");
      }

      const data: UploadResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "업로드 중 오류가 발생했어요.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>PDF 드래그 & 드롭 업로드</h2>

      <div
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: "2px dashed",
          padding: "28px",
          borderRadius: "16px",
          cursor: "pointer",
          userSelect: "none",
          opacity: uploading ? 0.6 : 1,
        }}
      >
        <div style={{ fontSize: 14 }}>
          {isDragging
            ? "여기에 파일을 놓으세요"
            : "여기에 PDF를 드래그하거나 클릭해서 선택"}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
          }}
        />

        <div style={{ marginTop: 12, fontSize: 13 }}>
          {fileInfo ? `선택됨: ${fileInfo}` : "선택된 파일 없음"}
        </div>
      </div>

      <button
        onClick={onUpload}
        disabled={!file || uploading}
        style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10 }}
      >
        {uploading ? "업로드 중..." : "업로드"}
      </button>

      {error && <p style={{ marginTop: 12 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 16 }}>
          <div>업로드 성공</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>
            저장된 파일명: {result.storedName}
            <br />
            크기: {result.size} bytes
            <br />
            링크:{" "}
            <a href={`${API_BASE}${result.url}`} target="_blank" rel="noreferrer">
              {API_BASE}
              {result.url}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
