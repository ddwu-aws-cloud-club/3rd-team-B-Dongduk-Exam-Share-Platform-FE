import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileSetup from "./components/ProfileSetup";
import PdfDropzone from "./PdfDropzone";

import "./App.css";

type Page = "login" | "signup" | "profile-setup" | "pdf";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [userEmail, setUserEmail] = useState<string>("");

  return (
    <div className="app">
      {currentPage === "login" ? (
        <Login
          onSwitchToSignup={() => setCurrentPage("signup")}
          onLoginSuccess={() => setCurrentPage("pdf")}
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
        <ProfileSetup email={userEmail} onProfileComplete={() => setCurrentPage("pdf")} />
      ) : (
        <PdfDropzone />
      )}
    </div>
  );
}
