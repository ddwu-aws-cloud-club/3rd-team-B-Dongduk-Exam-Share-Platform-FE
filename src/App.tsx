import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileSetup from "./components/ProfileSetup";
import Home from "./components/Home";
import Board from "./components/Board";
import MyPage from "./components/MyPage";
import PdfUpload from "./components/PdfUpload";
import { getPointBalance } from "./api/point.api"; 

import "./App.css";

type Page = "login" | "signup" | "profile-setup" | "home" | "board" | "mypage" | "upload";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [userEmail, setUserEmail] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0); 

  useEffect(() => {
    if (currentPage !== "login" && currentPage !== "signup" && currentPage !== "profile-setup") {
      getPointBalance()
        .then((balance) => setUserPoints(balance))
        .catch((err) => {
          console.error("앱 포인트 조회 실패:", err);
        });
    }
  }, [currentPage]); 

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setCurrentPage("login");
  };

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
        />
      ) : null}
    </div>
  );
}