import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileSetup from "./components/ProfileSetup";
import Home from "./components/Home";
import Board from "./components/Board";
import MyPage from "./components/MyPage";
import PdfUpload from "./components/PdfUpload";
import { getUserInfo, removeToken, saveUserInfo } from "./utils/auth";
import { getCurrentUser, logout } from "./api/auth.api";

import "./App.css";

type Page = "login" | "signup" | "profile-setup" | "home" | "board" | "mypage" | "upload";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [userEmail, setUserEmail] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // 앱 시작 시 서버에서 로그인 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // 서버에서 사용자 정보를 가져왔으면 로그인 상태 유지
          saveUserInfo(user);
          setUserPoints(user.points);
          setCurrentPage("home");
        }
      } catch {
        // 인증 실패 시 로그인 페이지 유지
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // 페이지 변경 시 포인트 업데이트
  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUserPoints(userInfo.points);
    }
  }, [currentPage]);

  const handleLogout = async () => {
    try {
      await logout(); // 서버에서 HttpOnly 쿠키 삭제
    } catch {
      // 로그아웃 API 실패해도 로컬 정보는 삭제
    }
    removeToken(); // localStorage 정보 삭제
    setCurrentPage("login");
  };

  // 인증 상태 확인 중 로딩 표시
  if (isCheckingAuth) {
    return (
      <div className="app" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {currentPage === "login" ? (
        <Login
          onSwitchToSignup={() => setCurrentPage("signup")}
          onLoginSuccess={() => setCurrentPage("home")}
        />
      ) : currentPage === "signup" ? (
        <Signup
          onSwitchToLogin={() => setCurrentPage("login")}
          onSignupSuccess={(email: string) => {
            setUserEmail(email);
            setCurrentPage("profile-setup");
          }}
        />
      ) : currentPage === "profile-setup" ? (
        <ProfileSetup
          email={userEmail}
          onProfileComplete={() => setCurrentPage("home")}
        />
      ) : currentPage === "home" ? (
        <Home
          onNavigateToBoard={(collegeName?: string) => {
            setSelectedCollege(collegeName || null);
            setCurrentPage("board");
          }}
          onNavigateToMyPage={() => setCurrentPage("mypage")}
          onLogout={handleLogout}
        />
      ) : currentPage === "board" ? (
        <Board
          selectedCollege={selectedCollege}
          onNavigateToHome={() => setCurrentPage("home")}
          onUploadClick={() => setCurrentPage("upload")}
          onLogout={handleLogout}
          onMyPageClick={() => setCurrentPage("mypage")}
          userPoints={userPoints}
        />
      ) : currentPage === "mypage" ? (
        <MyPage
          onNavigateToHome={() => setCurrentPage("home")}
          onLogout={handleLogout}
          userPoints={userPoints}
        />
      ) : currentPage === "upload" ? (
        <PdfUpload
          onNavigateToBoard={() => setCurrentPage("board")}
          onNavigateToHome={() => setCurrentPage("home")}
          onLogout={handleLogout}
          onMyPageClick={() => setCurrentPage("mypage")}
          userPoints={userPoints}
          onPointsUpdate={(points) => setUserPoints(points)}
        />
      ) : null}
    </div>
  );
}
