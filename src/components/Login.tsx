import { useState } from 'react';
import logo from '../assets/somshare_logo.png';
import character from '../assets/somshare_character.png';
import './Login.css';

interface LoginProps {
  onSwitchToSignup: () => void;
}

function Login({ onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 로그인 API 연동
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={character} alt="SomShare Character" className="character-image" />
      </div>

      <div className="login-right">
        <div className="login-box">
          <img src={logo} alt="SomShare Logo" className="logo" />
          <h1>로그인</h1>
          <p className="subtitle">동덕여대 족보 공유 플랫폼</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">학교 이메일</label>
              <input
                type="email"
                id="email"
                placeholder="학번@dongduk.ac.kr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">
              로그인
            </button>
          </form>

          <div className="login-footer">
            <p>
              계정이 없으신가요?{' '}
              <button onClick={onSwitchToSignup} className="link-button">
                회원가입
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
