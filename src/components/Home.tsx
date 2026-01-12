import { useState, useEffect } from 'react';
import { COLLEGES } from '../constants/majors';
import './Home.css';

interface HomeProps {
  onNavigateToBoard: (collegeName?: string) => void;
  onNavigateToMyPage: () => void;
  onLogout: () => void;
}

function Home({ onNavigateToBoard, onNavigateToMyPage, onLogout }: HomeProps) {
  const [userPoints, setUserPoints] = useState<number>(1000);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || '사용자';
    setUserName(storedName);
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
                  {college.majors.length > 0
                    ? `${college.majors.length}개 전공`
                    : '전공 정보 없음'}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="quick-actions-section">
          <h3 className="section-title">빠른 메뉴</h3>
          <div className="quick-actions">
            <button
              className="quick-action-button"
              onClick={() => onNavigateToBoard()}
            >
              <div className="action-icon">📚</div>
              <div className="action-label">전체 족보 보기</div>
            </button>
            <button
              className="quick-action-button"
              onClick={() => onNavigateToBoard('ARETE 교양대학')}
            >
              <div className="action-icon">📖</div>
              <div className="action-label">교양 게시판</div>
            </button>
            <button
              className="quick-action-button"
              onClick={onNavigateToMyPage}
            >
              <div className="action-icon">👤</div>
              <div className="action-label">내 활동</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
