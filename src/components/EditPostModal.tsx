import { useState } from 'react';
import { COLLEGES, getAllMajors } from '../constants/majors';
import { updatePost, type PostSummary, type PostUpdateParams } from '../api/file.api';
import './EditPostModal.css';

interface EditPostModalProps {
  post: PostSummary;
  onClose: () => void;
  onUpdate: (updatedPost: PostSummary) => void;
}

function EditPostModal({ post, onClose, onUpdate }: EditPostModalProps) {
  const [title, setTitle] = useState(post.title);
  const [subject, setSubject] = useState(post.subject);
  const [professor, setProfessor] = useState(post.professor);
  const [major, setMajor] = useState(post.major);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allMajors = getAllMajors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params: PostUpdateParams = {
        title,
        subject,
        professor,
        major,
      };

      await updatePost(post.id, params);

      // 로컬 상태 업데이트
      const updatedPost: PostSummary = {
        ...post,
        title,
        subject,
        professor,
        major,
      };

      onUpdate(updatedPost);
      alert('족보가 성공적으로 수정되었습니다.');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : '수정 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>족보 수정</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="edit-title">제목</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={100}
              placeholder="족보 제목을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-subject">과목명</label>
            <input
              id="edit-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              minLength={2}
              maxLength={50}
              placeholder="과목명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-professor">교수명</label>
            <input
              id="edit-professor"
              type="text"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              required
              minLength={2}
              maxLength={20}
              placeholder="교수명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-major">전공</label>
            <select
              id="edit-major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              required
            >
              <option value="general-education">교양</option>
              {allMajors.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose} disabled={loading}>
              취소
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? '수정 중...' : '수정하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPostModal;
