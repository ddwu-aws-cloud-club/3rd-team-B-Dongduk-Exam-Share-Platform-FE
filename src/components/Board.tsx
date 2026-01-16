import { useState, useEffect } from 'react';
import { COLLEGES, getAllMajors } from '../constants/majors';
import { deletePost as deletePostApi, downloadPost, getDownloadedPostIds, getPosts, ratePost, type PostSummary } from '../api/file.api';
import { getUserInfo, saveUserInfo } from '../utils/auth';
import PageHeader from './PageHeader';
import EditPostModal from './EditPostModal';
import './Board.css';

interface BoardProps {
  selectedCollege: string | null;
  onNavigateToHome: () => void;
  onUploadClick: () => void;
  onLogout: () => void;
  onMyPageClick: () => void;
  userPoints: number;
  onPointsUpdate?: (newPoints: number) => void;
}

function Board({ selectedCollege, onNavigateToHome, onUploadClick, onLogout, onMyPageClick, userPoints, onPointsUpdate: _onPointsUpdate }: BoardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [downloadedPosts, setDownloadedPosts] = useState<Set<number>>(new Set());
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<Map<number, 'like' | 'dislike'>>(new Map());
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<PostSummary | null>(null);
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  // 현재 로그인한 사용자 ID 가져오기 및 다운로드 내역 불러오기
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setCurrentUserId(userInfo.id);
    }

    // 서버에서 다운로드 내역 불러오기
    const fetchDownloadedPosts = async () => {
      const downloadedIds = await getDownloadedPostIds();
      if (downloadedIds.length > 0) {
        setDownloadedPosts(new Set(downloadedIds));
      }
    };

    fetchDownloadedPosts();
  }, []);

  const allMajors = getAllMajors();

  // 선택된 단과대학의 전공만 가져오기
  const availableMajors = selectedCollege && selectedCollege !== '교양'
    ? COLLEGES.find((c) => c.name === selectedCollege)?.majors || []
    : allMajors;

  // 게시글 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // major 파라미터 결정
        let majorParam: string | undefined;
        if (selectedCollege === '교양') {
          majorParam = 'general-education';
        } else if (selectedMajor !== 'all') {
          majorParam = selectedMajor;
        }

        const response = await getPosts({
          search: searchTerm || undefined,
          major: majorParam,
        });
        setPosts(response.content);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, selectedMajor, selectedCollege]);

  const handleDownload = async (post: PostSummary) => {
    if (downloadedPosts.has(post.id) || isDownloading !== null) {
      return;
    }

    setIsDownloading(post.id);
    try {
      const response = await downloadPost(post.id);

      setDownloadedPosts((prev) => new Set(prev).add(post.id));

      // 다운로드 횟수 즉시 증가
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id ? { ...p, downloadCount: p.downloadCount + 1 } : p
        )
      );

      const userInfo = getUserInfo();
      if (userInfo) {
        userInfo.points = response.remainingPoints;
        saveUserInfo(userInfo);
      }

      // 실제 PDF 다운로드 (blob 방식으로 강제 다운로드)
      try {
        const pdfResponse = await fetch(response.pdfUrl);
        const blob = await pdfResponse.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = response.fileName || `${post.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch {
        // blob 다운로드 실패시 새 창으로 열기
        window.open(response.pdfUrl, '_blank');
      }

      alert(`다운로드 완료! (${response.pointsDeducted}P 차감, 잔여: ${response.remainingPoints}P)`);
    } catch (error) {
      const message = error instanceof Error ? error.message : '다운로드 중 오류가 발생했습니다.';
      alert(message);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleRating = async (postId: number, type: 'like' | 'dislike') => {
    if (!downloadedPosts.has(postId)) {
      alert('다운로드 후에 평가할 수 있습니다.');
      return;
    }

    try {
      const response = await ratePost(postId, type);

      // 로컬 상태 업데이트 - 좋아요/싫어요 수 갱신
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, likeCount: response.likeCount, dislikeCount: response.dislikeCount }
            : p
        )
      );

      // 사용자의 평가 상태 업데이트
      if (response.userRating) {
        setRatings((prev) => {
          const newRatings = new Map(prev);
          newRatings.set(postId, response.userRating as 'like' | 'dislike');
          return newRatings;
        });
      } else {
        setRatings((prev) => {
          const newRatings = new Map(prev);
          newRatings.delete(postId);
          return newRatings;
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '평가 중 오류가 발생했습니다.';
      alert(message);
    }
  };

  // 전공 코드를 한글 이름으로 변환
  const getMajorLabel = (majorCode: string): string => {
    if (majorCode === 'general-education') return '교양';
    const major = allMajors.find((m) => m.value === majorCode);
    return major ? major.label : majorCode;
  };

  // 내 게시글인지 확인
  const isMyPost = (post: PostSummary): boolean => {
    return currentUserId !== null && post.uploaderId === currentUserId;
  };

  // 다운로드 차감 포인트 계산 (내 게시글은 0P, 다른 사람 게시글은 50P)
  const getDownloadCost = (post: PostSummary): number => {
    return isMyPost(post) ? 0 : post.points;
  };

  // 수정 버튼 핸들러
  const handleEdit = (post: PostSummary) => {
    setEditingPost(post);
  };

  // 수정 완료 핸들러
  const handleUpdatePost = (updatedPost: PostSummary) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  // 삭제 핸들러
  const handleDelete = async (post: PostSummary) => {
    if (!confirm(`"${post.title}" 족보를 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.`)) {
      return;
    }

    try {
      await deletePostApi(post.id);
      // 로컬 상태에서 삭제된 게시글 제거
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
      setTotalElements((prev) => prev - 1);
      alert('족보가 삭제되었습니다.');
    } catch (error) {
      const message = error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.';
      alert(message);
    }
  };

  return (
    <div className="board-container">
      <PageHeader
        pageTitle={selectedCollege === '교양' ? '교양 족보 게시판' : selectedCollege ? `${selectedCollege} 족보 게시판` : '전체 족보 게시판'}
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

          {selectedCollege !== '교양' && (
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
          )}
        </div>

        <div className="posts-section">
          <div className="posts-header">
            <h2 className="posts-title">
              총 {totalElements}개의 족보
            </h2>
          </div>

          {loading ? (
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
                    <div className="post-header-right">
                      {isMyPost(post) && (
                        <>
                          <button
                            onClick={() => handleEdit(post)}
                            className="edit-button"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            className="delete-button"
                          >
                            삭제
                          </button>
                        </>
                      )}
                      <span className="post-points">{post.points}P</span>
                    </div>
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
                      <span className="info-value">{getMajorLabel(post.major)}</span>
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

                  <div className="rating-stats">
                    <span className="stat-item">👍 좋아요 {post.likeCount}</span>
                    <span className="stat-item">👎 별로예요 {post.dislikeCount}</span>
                  </div>

                  <button
                    onClick={() => handleDownload(post)}
                    disabled={downloadedPosts.has(post.id) || isDownloading === post.id}
                    className={`download-button ${downloadedPosts.has(post.id) ? 'downloaded' : ''} ${isDownloading === post.id ? 'loading' : ''}`}
                  >
                    {downloadedPosts.has(post.id) ? '다운로드 완료' : `다운로드 (${getDownloadCost(post)}P)`}
                  </button>

                  {downloadedPosts.has(post.id) && (
                    <div className="rating-section">
                      <p className="rating-label">이 족보가 도움이 되었나요?</p>
                      <div className="rating-buttons">
                        <button
                          onClick={() => handleRating(post.id, 'like')}
                          className={`rating-button like ${ratings.get(post.id) === 'like' ? 'active' : ''}`}
                        >
                          👍 좋아요
                        </button>
                        <button
                          onClick={() => handleRating(post.id, 'dislike')}
                          className={`rating-button dislike ${ratings.get(post.id) === 'dislike' ? 'active' : ''}`}
                        >
                          👎 별로예요
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

      {/* 수정 모달 */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={handleUpdatePost}
        />
      )}
    </div>
  );
}

export default Board;
