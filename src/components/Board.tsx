import { useState } from 'react';
import { COLLEGES, getAllMajors } from '../constants/majors';
import './Board.css';

interface Post {
  id: number;
  title: string;
  subject: string;
  professor: string;
  major: string;
  uploadDate: string;
  uploader: string;
  downloadCount: number;
  points: number;
  pdfUrl?: string;
}

interface BoardProps {
  onNavigateToHome: () => void;
  onUploadClick: () => void;
}

function Board({ onNavigateToHome, onUploadClick }: BoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const mockPosts: Post[] = [
    {
      id: 1,
      title: '2024-2학기 중간고사 족보',
      subject: '자료구조',
      professor: '김교수',
      major: 'computer-science',
      uploadDate: '2024-10-15',
      uploader: '익명',
      downloadCount: 45,
      points: 50,
    },
    {
      id: 2,
      title: '2024-1학기 기말고사 족보',
      subject: '알고리즘',
      professor: '이교수',
      major: 'computer-science',
      uploadDate: '2024-06-20',
      uploader: '익명',
      downloadCount: 78,
      points: 50,
    },
    {
      id: 3,
      title: '2024-2학기 중간고사',
      subject: '경영학원론',
      professor: '박교수',
      major: 'business-admin',
      uploadDate: '2024-10-18',
      uploader: '익명',
      downloadCount: 32,
      points: 50,
    },
  ];

  const allMajors = getAllMajors();

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.professor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMajor = selectedMajor === 'all' || post.major === selectedMajor;

    return matchesSearch && matchesMajor;
  });

  const handleDownload = (post: Post) => {
    alert(`"${post.title}" 다운로드! (${post.points}P 차감)`);
  };

  return (
    <div className="board-container">
      <header className="board-header">
        <div className="header-content">
          <h1 className="board-title">족보 게시판</h1>
          <div className="header-actions">
            <button onClick={onNavigateToHome} className="nav-button">
              홈으로
            </button>
            <button onClick={onUploadClick} className="upload-button">
              + 족보 업로드
            </button>
          </div>
        </div>
      </header>

      <main className="board-main">
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="과목명, 교수명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="major-select" className="filter-label">
              전공 필터
            </label>
            <select
              id="major-select"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="major-select"
            >
              <option value="all">전체 전공</option>
              {COLLEGES.map((college) =>
                college.majors.map((major) => (
                  <option key={major.value} value={major.value}>
                    {college.name} - {major.label}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="posts-section">
          <div className="posts-header">
            <h2 className="posts-title">
              총 {filteredPosts.length}개의 족보
            </h2>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="no-posts">
              <p>검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="posts-list">
              {filteredPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <h3 className="post-title">{post.title}</h3>
                    <span className="post-points">{post.points}P</span>
                  </div>

                  <div className="post-info">
                    <div className="info-row">
                      <span className="info-label">과목</span>
                      <span className="info-value">{post.subject}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">교수</span>
                      <span className="info-value">{post.professor}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">전공</span>
                      <span className="info-value">
                        {
                          allMajors.find((m) => m.value === post.major)
                            ?.label
                        }
                      </span>
                    </div>
                  </div>

                  <div className="post-meta">
                    <span className="meta-item">
                      업로드: {post.uploadDate}
                    </span>
                    <span className="meta-item">
                      다운로드: {post.downloadCount}회
                    </span>
                  </div>

                  <button
                    onClick={() => handleDownload(post)}
                    className="download-button"
                  >
                    다운로드 ({post.points}P)
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Board;
