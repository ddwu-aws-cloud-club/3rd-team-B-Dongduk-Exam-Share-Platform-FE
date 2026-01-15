import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileSetup from "./components/ProfileSetup";
import Home from "./components/Home";
import Board from "./components/Board";
import MyPage from "./components/MyPage";
import PdfUpload from "./components/PdfUpload";

import "./App.css";

type Page = "login" | "signup" | "profile-setup" | "home" | "board" | "mypage" | "upload";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [userEmail, setUserEmail] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number>(1000); // TODO: API에서 가져오기

  const handlePointsUpdate = (points: number) => {
    setUserPoints(points);
  };

  const handlePointsAdd = (earnedPoints: number) => {
    setUserPoints((prev) => prev + earnedPoints);
  };

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
          onPointsUpdate={handlePointsUpdate}
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
          onPointsUpdate={handlePointsAdd}
        />
      ) : null}
    </div>
  );
}
