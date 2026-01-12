import { useState, useRef, type DragEvent } from 'react';
import { uploadPost, type PostUploadResponse } from '../api/file.api';
import { getAllMajors } from '../constants/majors';
import PageHeader from './PageHeader';
import './PdfUpload.css';

interface PdfUploadProps {
  onNavigateToBoard: () => void;
  onNavigateToHome: () => void;
  onLogout: () => void;
  onMyPageClick: () => void;
  userPoints: number;
}

function PdfUpload({ onNavigateToBoard, onNavigateToHome, onLogout, onMyPageClick, userPoints }: PdfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<PostUploadResponse | null>(null);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [professor, setProfessor] = useState('');
  const [major, setMajor] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const allMajors = getAllMajors();

  const validatePdf = (f: File) => {
    const nameOk = f.name.toLowerCase().endsWith('.pdf');
    const typeOk = f.type === 'application/pdf';
    if (!nameOk && !typeOk) return 'PDF 파일만 업로드할 수 있어요.';
    if (f.size > 20 * 1024 * 1024)
      return '파일은 최대 20MB까지 업로드할 수 있어요.';
    return '';
  };

  const onPick = (f: File) => {
    const msg = validatePdf(f);
    if (msg) {
      setError(msg);
      setFile(null);
      setResult(null);
      return;
    }
    setError('');
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
      setError('업로드할 PDF를 선택해 주세요.');
      return;
    }

    if (!title.trim()) {
      setError('제목을 입력해 주세요.');
      return;
    }

    if (!subject.trim()) {
      setError('과목명을 입력해 주세요.');
      return;
    }

    if (!professor.trim()) {
      setError('교수명을 입력해 주세요.');
      return;
    }

    if (!major) {
      setError('전공을 선택해 주세요.');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    try {
      const data = await uploadPost({
        file,
        title: title.trim(),
        subject: subject.trim(),
        professor: professor.trim(),
        major: major,
      });
      setResult(data);
      alert(data.message);

      setFile(null);
      setTitle('');
      setSubject('');
      setProfessor('');
      setMajor('');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '업로드 중 오류가 발생했어요.';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pdf-upload-container">
      <PageHeader
        pageTitle="족보 업로드"
        onLogoClick={onNavigateToHome}
        onBackClick={onNavigateToBoard}
        onLogout={onLogout}
        onMyPageClick={onMyPageClick}
        userPoints={userPoints}
      />

      <main className="upload-main">
        <div className="upload-card">
          <section className="dropzone-section">
            <h2 className="section-title">PDF 파일 선택</h2>
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
              className={`dropzone ${isDragging ? 'dragging' : ''} ${
                file ? 'has-file' : ''
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onPick(f);
                }}
              />

              {!file ? (
                <div className="dropzone-content">
                  <div className="dropzone-icon">📄</div>
                  <p className="dropzone-text">
                    {isDragging
                      ? '여기에 파일을 놓으세요'
                      : 'PDF 파일을 드래그하거나 클릭해서 선택하세요'}
                  </p>
                  <p className="dropzone-hint">최대 20MB까지 업로드 가능</p>
                </div>
              ) : (
                <div className="file-selected">
                  <div className="file-icon">✓</div>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">
                    {Math.round(file.size / 1024)} KB
                  </p>
                  <button
                    className="remove-file-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    파일 제거
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">족보 정보 입력</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  제목 *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 2024-2학기 중간고사 족보"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  과목명 *
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="예: 자료구조"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="professor" className="form-label">
                  교수명 *
                </label>
                <input
                  type="text"
                  id="professor"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="예: 김교수"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="major" className="form-label">
                  전공 *
                </label>
                <select
                  id="major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="form-select"
                >
                  <option value="">전공을 선택하세요</option>
                  {allMajors.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {error && <div className="error-message">{error}</div>}

          {result && (
            <div className="success-message">
              <p className="success-title">✓ 업로드 성공!</p>
              <p className="success-detail">{result.earnedPoints}P가 적립되었습니다.</p>
            </div>
          )}

          <button
            onClick={onUpload}
            disabled={!file || uploading}
            className="submit-button"
          >
            {uploading ? '업로드 중...' : '족보 업로드하기 (100P 적립)'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default PdfUpload;
