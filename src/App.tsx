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
          // 로그인 성공 시 PdfDropzone으로 넘어가게 하려면
          // Login 컴포넌트에 onLoginSuccess 같은 props 추가해서 연결하면 됨
        />
      ) : currentPage === "signup" ? (
        <Signup onSwitchToLogin={() => setCurrentPage("login")} />
      ) : (
        <PdfDropzone />
      )}

      {/* 임시 이동 버튼 */}
      {/* <button onClick={() => setCurrentPage("pdf")}>PDF 업로드로 이동</button> */}
    </div>
  );
}
