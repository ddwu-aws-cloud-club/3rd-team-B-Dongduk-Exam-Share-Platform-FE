import { useState } from 'react';
import logo from '../assets/somshare_logo.png';
import character from '../assets/somshare_character.png';
import './Login.css';
import { login } from '../api/auth.api';
import { saveToken, saveUserEmail } from '../utils/auth';

interface LoginProps {
  onSwitchToSignup: () => void;
  onLoginSuccess?: () => void;
}

function Login({ onSwitchToSignup, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const data = await login(email, password);

      // 로그인 성공 시 토큰 저장
      if (data.token) {
        saveToken(data.token);
        saveUserEmail(email);
      }

      // 성공 콜백 호출
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
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

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
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
