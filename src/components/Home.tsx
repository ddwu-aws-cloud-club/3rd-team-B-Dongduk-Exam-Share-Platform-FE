import { useState, useEffect } from 'react';
import { COLLEGES } from '../constants/majors';
import { getUserInfo } from '../utils/auth';
import { getPosts } from '../api/file.api';
import './Home.css';

interface HomeProps {
  onNavigateToBoard: (collegeName?: string) => void;
  onNavigateToMyPage: () => void;
  onLogout: () => void;
}

function Home({ onNavigateToBoard, onNavigateToMyPage, onLogout }: HomeProps) {
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [collegeCounts, setCollegeCounts] = useState<Record<string, number>>({});
  const [gyoyangCount, setGyoyangCount] = useState<number>(0);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUserName(userInfo.nickname || '사용자');
      setUserPoints(userInfo.points);
    }

    // 전체 족보 개수 가져오기
    const fetchTotalPosts = async () => {
      try {
        const response = await getPosts({ size: 1 });
        setTotalPosts(response.totalElements);
      } catch (error) {
        console.error('족보 개수 불러오기 실패:', error);
      }
    };
    fetchTotalPosts();

    // 각 단과대학별 족보 개수 가져오기
    const fetchCollegeCounts = async () => {
      const counts: Record<string, number> = {};

      for (const college of COLLEGES) {
        let collegeTotal = 0;
        for (const major of college.majors) {
          try {
            const response = await getPosts({ major: major.value, size: 1 });
            collegeTotal += response.totalElements;
          } catch (error) {
            // ignore
          }
        }
        counts[college.name] = collegeTotal;
      }

      setCollegeCounts(counts);
    };
    fetchCollegeCounts();

    // 교양 게시판 개수 가져오기
    const fetchGyoyangCount = async () => {
      try {
        const response = await getPosts({ major: 'general-education', size: 1 });
        setGyoyangCount(response.totalElements);
      } catch (error) {
        console.error('교양 족보 개수 불러오기 실패:', error);
      }
    };
    fetchGyoyangCount();
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-left">
          <h1 className="header-title">SomShare</h1>
          <p className="header-subtitle">동덕여대 족보 공유 플랫폼</p>
        </div>
        <div className="header-right">
          <div className="user-points">
            <span className="points-label">내 포인트</span>
            <span className="points-value">{userPoints}P</span>
          </div>
          <button onClick={onNavigateToMyPage} className="header-button">
            마이페이지
          </button>
          <button onClick={onLogout} className="header-button logout-button">
            로그아웃
          </button>
        </div>
      </header>

      <main className="home-main">
        <section className="welcome-section">
          <h2 className="welcome-title">{userName}님, 환영합니다!</h2>
          <p className="welcome-message">
            필요한 족보를 찾아보고, 공유해서 포인트를 적립하세요.
          </p>
        </section>

        <section className="colleges-section">
          <h3 className="section-title">단과대학별 게시판</h3>
          <div className="colleges-grid">
            {COLLEGES.map((college) => (
              <div
                key={college.name}
                className="college-card"
                onClick={() => onNavigateToBoard(college.name)}
              >
                <h4 className="college-name">{college.name}</h4>
                <p className="college-majors-count">
                  {collegeCounts[college.name] !== undefined
                    ? `${collegeCounts[college.name]}개의 족보`
                    : '로딩 중...'}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="quick-actions-section">
          <h3 className="section-title">기타</h3>
          <div className="quick-actions">
            <button
              className="quick-action-button"
              onClick={() => onNavigateToBoard('교양')}
            >
              <div className="action-icon">📖</div>
              <div className="action-label">교양 게시판 ({gyoyangCount}개)</div>
            </button>
            <button
              className="quick-action-button"
              onClick={() => onNavigateToBoard()}
            >
              <div className="action-icon">📚</div>
              <div className="action-label">전체 족보 보기 ({totalPosts}개)</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
