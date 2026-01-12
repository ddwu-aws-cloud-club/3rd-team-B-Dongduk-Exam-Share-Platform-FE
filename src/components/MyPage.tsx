import { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
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
  title: string;
  date: string;
  points: number;
}

interface MyPageProps {
  onNavigateToHome: () => void;
  onLogout: () => void;
  userPoints: number;
}

function MyPage({ onNavigateToHome, onLogout, userPoints }: MyPageProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'uploads' | 'downloads'>(
    'info'
  );
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: 'student@dongduk.ac.kr',
    name: '홍길동',
    major: '컴퓨터학전공',
    points: 1000,
  });

  const [uploadedPosts, setUploadedPosts] = useState<Activity[]>([
    {
      id: 1,
      type: 'upload',
      title: '2024-2학기 자료구조 중간고사 족보',
      date: '2024-10-15',
      points: 100,
    },
    {
      id: 2,
      type: 'upload',
      title: '2024-1학기 알고리즘 기말고사 족보',
      date: '2024-06-20',
      points: 100,
    },
  ]);

  const [downloadedPosts, setDownloadedPosts] = useState<Activity[]>([
    {
      id: 1,
      type: 'download',
      title: '2024-2학기 운영체제 중간고사 족보',
      date: '2024-10-18',
      points: 50,
    },
    {
      id: 2,
      type: 'download',
      title: '2024-1학기 데이터베이스 기말고사 족보',
      date: '2024-06-25',
      points: 50,
    },
  ]);

  const totalEarned = uploadedPosts.reduce(
    (sum, post) => sum + post.points,
    0
  );
  const totalSpent = downloadedPosts.reduce((sum, post) => sum + post.points, 0);

  return (
    <div className="mypage-container">
      <PageHeader
        pageTitle="마이페이지"
        onLogoClick={onNavigateToHome}
        onBackClick={onNavigateToHome}
        onLogout={onLogout}
        userPoints={userPoints}
      />

      <main className="mypage-main">
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
              <span className="points-amount">{userInfo.points}P</span>
            </div>
            <div className="points-details">
              <div className="points-item">
                <span className="item-label">총 획득</span>
                <span className="item-value earn">+{totalEarned}P</span>
              </div>
              <div className="points-item">
                <span className="item-label">총 사용</span>
                <span className="item-value spend">-{totalSpent}P</span>
              </div>
            </div>
          </div>
        </section>

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
          </div>
        </section>
      </main>
    </div>
  );
}

export default MyPage;
