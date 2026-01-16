import { useState, useEffect, useCallback } from 'react';
import { COLLEGES, getAllMajors } from '../constants/majors';
import { getPosts, downloadPost } from '../api/file.api';
import type { PostSummary, DownloadResponse } from '../api/file.api';
import { reducePoints } from '../api/point.api'; 
import PageHeader from './PageHeader';
import './Board.css';

interface BoardProps {
  selectedCollege: string | null;
  onNavigateToHome: () => void;
  onUploadClick: () => void;
  onLogout: () => void;
  onMyPageClick: () => void;
  userPoints: number;
}

function Board({ 
  selectedCollege, 
  onNavigateToHome, 
  onUploadClick, 
  onLogout, 
  onMyPageClick, 
  userPoints 
}: BoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadedPosts, setDownloadedPosts] = useState<Set<number>>(new Set());
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  const allMajors = getAllMajors();

  const availableMajors = selectedCollege
    ? COLLEGES.find((c) => c.name === selectedCollege)?.majors || []
    : allMajors;

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: { search?: string; major?: string } = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedMajor !== 'all') params.major = selectedMajor;

      const response = await getPosts(params);
      setPosts(response.content);
    } catch (error) {
      console.error('족보 목록 조회 실패:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedMajor]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDownload = async (post: PostSummary) => {
    if (isDownloading === post.id) return;

    const confirmMessage = `${post.points} 포인트가 차감됩니다. 다운로드하시겠습니까?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsDownloading(post.id);

    try {
      await reducePoints(post.id, `[자료 다운로드] ${post.title}`);

      const response: DownloadResponse = await downloadPost(post.id);

      window.open(response.pdfUrl, '_blank');

      setDownloadedPosts((prev) => new Set(prev).add(post.id));
      
      fetchPosts();

      alert("다운로드가 시작되었습니다.");

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '다운로드에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="board-container">
      <PageHeader
        pageTitle={selectedCollege ? `${selectedCollege} 족보 게시판` : '전체 족보 게시판'}
        onLogoClick={onNavigateToHome}
        onBackClick={onNavigateToHome}
        onLogout={onLogout}
        onMyPageClick={onMyPageClick}
        userPoints={userPoints}
        showUploadButton={true}
        onUploadClick={onUploadClick}
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
              총 {posts.length}개의 족보
            </h2>
          </div>

          {isLoading ? (
            <div className="no-posts">
              <p>로딩 중...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="no-posts">
              <p>등록된 족보가 없습니다.</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
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
                        {allMajors.find((m) => m.value === post.major)?.label || post.major}
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
                    <span className="meta-item">
                      작성자: {post.uploaderNickname}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDownload(post)}
                    disabled={isDownloading === post.id}
                    className={`download-button ${downloadedPosts.has(post.id) ? 'downloaded' : ''} ${isDownloading === post.id ? 'loading' : ''}`}
                  >
                    {isDownloading === post.id
                      ? '처리 중...'
                      : downloadedPosts.has(post.id)
                        ? '다시 받기' 
                        : `다운로드 (${post.points}P)`}
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