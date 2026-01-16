import { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import { getPointBalance, getPointHistory, type PointHistoryItem } from '../api/point.api'; 
import './MyPage.css';

interface UserInfo {
  email: string;
  name: string;
  major: string;
  points: number;
  profileImage?: string;
}

interface Activity {
  id: number;
  type: 'upload' | 'download';
  title: string; // description
  date: string;  // createdAt
  points: number; // amount
}

interface MyPageProps {
  onNavigateToHome: () => void;
  onLogout: () => void;
  userPoints: number; 
}

function MyPage({ onNavigateToHome, onLogout, userPoints: initialPoints }: MyPageProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'uploads' | 'downloads'>('info');
  const [loading, setLoading] = useState<boolean>(true);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: '',
    name: '',
    major: '',
    points: initialPoints,
  });

  const [uploadedPosts, setUploadedPosts] = useState<Activity[]>([]);
  const [downloadedPosts, setDownloadedPosts] = useState<Activity[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const storedEmail = localStorage.getItem('userEmail') || 'student@dongduk.ac.kr';
        const storedName = localStorage.getItem('userName') || '학생';
        const storedMajor = localStorage.getItem('userMajor') || '전공 미설정';

        const currentBalance = await getPointBalance();

        setUserInfo({
          email: storedEmail,
          name: storedName,
          major: storedMajor,
          points: currentBalance, 
        });

        const historyData = await getPointHistory('ALL', 0, 100);
        
        const allHistory = historyData.content;

        const uploads = allHistory
          .filter((item: PointHistoryItem) => item.type === 'EARN' || item.type === 'CHARGE')
          .map((item: PointHistoryItem) => ({
            id: item.id,
            type: 'upload' as const,
            title: item.description,
            date: formatDate(item.createdAt),
            points: item.amount,
          }));

        const downloads = allHistory
          .filter((item: PointHistoryItem) => item.type === 'USE')
          .map((item: PointHistoryItem) => ({
            id: item.id,
            type: 'download' as const,
            title: item.description,
            date: formatDate(item.createdAt),
            points: item.amount,
          }));

        setUploadedPosts(uploads);
        setDownloadedPosts(downloads);

      } catch (error) {
        console.error('마이페이지 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  const totalEarned = uploadedPosts.reduce((sum, post) => sum + post.points, 0);
  const totalSpent = downloadedPosts.reduce((sum, post) => sum + post.points, 0);

  return (
    <div className="mypage-container">
      <PageHeader
        pageTitle="마이페이지"
        onLogoClick={onNavigateToHome}
        onBackClick={onNavigateToHome}
        onLogout={onLogout}
        userPoints={userInfo.points} 
      />

      <main className="mypage-main">
        {/* 프로필 섹션 */}
        <section className="profile-section">
          <div className="profile-card">
            <div className="profile-image-container">
              {userInfo.profileImage ? (
                <img
                  src={userInfo.profileImage}
                  alt="프로필"
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  <span>{userInfo.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{userInfo.name}</h2>
              <p className="profile-email">{userInfo.email}</p>
              <p className="profile-major">{userInfo.major}</p>
            </div>
          </div>

          <div className="points-card">
            <h3 className="points-title">포인트 현황</h3>
            <div className="points-total">
              <span className="points-label">보유 포인트</span>
              {/* 로딩 중일 때는 ... 표시 */}
              <span className="points-amount">
                {loading ? '...' : `${userInfo.points.toLocaleString()}P`}
              </span>
            </div>
            <div className="points-details">
              <div className="points-item">
                <span className="item-label">총 획득</span>
                <span className="item-value earn">+{totalEarned.toLocaleString()}P</span>
              </div>
              <div className="points-item">
                <span className="item-label">총 사용</span>
                <span className="item-value spend">-{totalSpent.toLocaleString()}P</span>
              </div>
            </div>
          </div>
        </section>

        {/* 활동 내역 탭 섹션 */}
        <section className="activity-section">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              내 정보
            </button>
            <button
              className={`tab ${activeTab === 'uploads' ? 'active' : ''}`}
              onClick={() => setActiveTab('uploads')}
            >
              업로드 내역 ({uploadedPosts.length})
            </button>
            <button
              className={`tab ${activeTab === 'downloads' ? 'active' : ''}`}
              onClick={() => setActiveTab('downloads')}
            >
              다운로드 내역 ({downloadedPosts.length})
            </button>
          </div>

          <div className="tab-content">
            {loading ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                 데이터를 불러오는 중입니다...
               </div>
            ) : (
              <>
                {activeTab === 'info' && (
                  <div className="info-content">
                    <h3 className="content-title">계정 정보</h3>
                    <div className="info-list">
                      <div className="info-row">
                        <span className="info-label">이메일</span>
                        <span className="info-value">{userInfo.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">이름</span>
                        <span className="info-value">{userInfo.name}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">전공</span>
                        <span className="info-value">{userInfo.major}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">가입일</span>
                        <span className="info-value">2024-03-01</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'uploads' && (
                  <div className="activity-content">
                    <h3 className="content-title">내가 업로드한 족보</h3>
                    {uploadedPosts.length === 0 ? (
                      <div className="empty-state">
                        <p>업로드한 족보가 없습니다.</p>
                      </div>
                    ) : (
                      <div className="activity-list">
                        {uploadedPosts.map((post) => (
                          <div key={post.id} className="activity-item">
                            <div className="activity-info">
                              <h4 className="activity-title">{post.title}</h4>
                              <p className="activity-date">{post.date}</p>
                            </div>
                            <span className="activity-points earn">
                              +{post.points}P
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'downloads' && (
                  <div className="activity-content">
                    <h3 className="content-title">내가 다운로드한 족보</h3>
                    {downloadedPosts.length === 0 ? (
                      <div className="empty-state">
                        <p>다운로드한 족보가 없습니다.</p>
                      </div>
                    ) : (
                      <div className="activity-list">
                        {downloadedPosts.map((post) => (
                          <div key={post.id} className="activity-item">
                            <div className="activity-info">
                              <h4 className="activity-title">{post.title}</h4>
                              <p className="activity-date">{post.date}</p>
                            </div>
                            <span className="activity-points spend">
                              -{post.points}P
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MyPage;