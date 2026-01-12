import { useState } from 'react';
import { COLLEGES, getAllMajors } from '../constants/majors';
import PageHeader from './PageHeader';
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
  likeCount: number;
  dislikeCount: number;
}

interface BoardProps {
  selectedCollege: string | null;
  onNavigateToHome: () => void;
  onUploadClick: () => void;
}

function Board({ selectedCollege, onNavigateToHome, onUploadClick }: BoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [downloadedPosts, setDownloadedPosts] = useState<Set<number>>(new Set());
  const [ratings, setRatings] = useState<Map<number, 'like' | 'dislike'>>(new Map());

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
      likeCount: 32,
      dislikeCount: 3,
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
      likeCount: 56,
      dislikeCount: 8,
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
      likeCount: 24,
      dislikeCount: 2,
    },
  ];

  const allMajors = getAllMajors();

  // 선택된 단과대학의 전공만 가져오기
  const availableMajors = selectedCollege
    ? COLLEGES.find((c) => c.name === selectedCollege)?.majors || []
    : allMajors;

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.professor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMajor = selectedMajor === 'all' || post.major === selectedMajor;

    return matchesSearch && matchesMajor;
  });

  const handleDownload = (post: Post) => {
    if (downloadedPosts.has(post.id)) {
      return; // 이미 다운로드한 경우 무시
    }
    alert(`"${post.title}" 다운로드! (${post.points}P 차감)`);
    setDownloadedPosts((prev) => new Set(prev).add(post.id));
  };

  const handleRating = (postId: number, type: 'like' | 'dislike') => {
    if (!downloadedPosts.has(postId)) {
      alert('다운로드 후에 평가할 수 있습니다.');
      return;
    }

    const currentRating = ratings.get(postId);
    if (currentRating === type) {
      // 이미 같은 평가를 한 경우 취소
      setRatings((prev) => {
        const newRatings = new Map(prev);
        newRatings.delete(postId);
        return newRatings;
      });
    } else {
      // 새로운 평가 또는 다른 평가로 변경
      setRatings((prev) => {
        const newRatings = new Map(prev);
        newRatings.set(postId, type);
        return newRatings;
      });
    }
  };

  return (
    <div className="board-container">
      <PageHeader
        pageTitle={selectedCollege ? `${selectedCollege} 족보 게시판` : '전체 족보 게시판'}
        onLogoClick={onNavigateToHome}
        onBackClick={onNavigateToHome}
        rightActions={
          <button onClick={onUploadClick} className="upload-button">
            + 족보 업로드
          </button>
        }
      />

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
              <option value="all">
                {selectedCollege ? `${selectedCollege} 전체` : '전체 전공'}
              </option>
              {availableMajors.map((major) => (
                <option key={major.value} value={major.value}>
                  {major.label}
                </option>
              ))}
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
                    disabled={downloadedPosts.has(post.id)}
                    className={`download-button ${downloadedPosts.has(post.id) ? 'downloaded' : ''}`}
                  >
                    {downloadedPosts.has(post.id) ? '다운로드 완료' : `다운로드 (${post.points}P)`}
                  </button>

                  {downloadedPosts.has(post.id) && (
                    <div className="rating-section">
                      <p className="rating-label">이 족보가 도움이 되었나요?</p>
                      <div className="rating-buttons">
                        <button
                          onClick={() => handleRating(post.id, 'like')}
                          className={`rating-button like ${ratings.get(post.id) === 'like' ? 'active' : ''}`}
                        >
                          👍 좋아요 ({post.likeCount})
                        </button>
                        <button
                          onClick={() => handleRating(post.id, 'dislike')}
                          className={`rating-button dislike ${ratings.get(post.id) === 'dislike' ? 'active' : ''}`}
                        >
                          👎 별로예요 ({post.dislikeCount})
                        </button>
                      </div>
                    </div>
                  )}
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
