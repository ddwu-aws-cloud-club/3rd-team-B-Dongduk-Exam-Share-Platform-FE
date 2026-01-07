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
          onNavigateToBoard={(major?: string) => setCurrentPage("board")}
          onNavigateToMyPage={() => setCurrentPage("mypage")}
          onLogout={handleLogout}
        />
      ) : currentPage === "board" ? (
        <Board
          onNavigateToHome={() => setCurrentPage("home")}
          onUploadClick={() => setCurrentPage("upload")}
        />
      ) : currentPage === "mypage" ? (
        <MyPage
          onNavigateToHome={() => setCurrentPage("home")}
        />
      ) : currentPage === "upload" ? (
        <PdfUpload
          onNavigateToBoard={() => setCurrentPage("board")}
        />
      ) : null}
    </div>
  );
}
