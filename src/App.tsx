import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PdfDropzone from "./PdfDropzone";

import "./App.css";

type Page = "login" | "signup" | "pdf";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");

  return (
    <div className="app">
      {currentPage === "login" ? (
        <Login
          onSwitchToSignup={() => setCurrentPage("signup")}
          onLoginSuccess={() => setCurrentPage("pdf")}
        />
      ) : currentPage === "signup" ? (
        <Signup onSwitchToLogin={() => setCurrentPage("login")} />
      ) : (
        <PdfDropzone />
      )}
    </div>
  );
}
