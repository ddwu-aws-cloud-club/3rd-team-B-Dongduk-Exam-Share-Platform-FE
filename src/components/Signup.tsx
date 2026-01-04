import { useState } from 'react';
import logo from '../assets/somshare_logo.png';
import character from '../assets/somshare_character.png';
import './Signup.css';
import { sendVerificationCode, verifyCode, signup } from '../api/auth.api';

interface SignupProps {
  onSwitchToLogin: () => void;
}

function Signup({ onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendVerification = async () => {
    if (!email || !email.endsWith('@dongduk.ac.kr')) {
      setError('동덕여대 이메일 주소를 입력해주세요. (학번@dongduk.ac.kr)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await sendVerificationCode(email);
      setIsVerificationSent(true);
      alert(response.message + ' 이메일을 확인하세요!');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '인증 코드 전송 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError('인증 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyCode(email, verificationCode);
      setIsEmailVerified(true);
      alert(response.message);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '인증 코드 확인 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmailVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await signup(email, password);
      alert(response.message);
      onSwitchToLogin();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src={character} alt="SomShare Character" className="character-image" />
      </div>

      <div className="signup-right">
        <div className="signup-box">
          <img src={logo} alt="SomShare Logo" className="logo" />
          <h1>회원가입</h1>
          <p className="subtitle">동덕여대 재학생 전용</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">학교 이메일</label>
              <div className="email-verification-group">
                <input
                  type="email"
                  id="email"
                  placeholder="학번@dongduk.ac.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isEmailVerified}
                  required
                />
                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={handleSendVerification}
                    className="verify-button"
                    disabled={isVerificationSent || loading}
                  >
                    {isVerificationSent ? '전송됨' : '인증'}
                  </button>
                )}
                {isEmailVerified && (
                  <span className="verified-badge">✓ 인증완료</span>
                )}
              </div>
            </div>

            {isVerificationSent && !isEmailVerified && (
              <div className="input-group">
                <label htmlFor="verificationCode">인증 코드</label>
                <div className="verification-code-group">
                  <input
                    type="text"
                    id="verificationCode"
                    placeholder="6자리 인증 코드를 입력하세요"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="verify-code-button"
                    disabled={loading}
                  >
                    확인
                  </button>
                </div>
              </div>
            )}

            {isEmailVerified && (
              <>
                <div className="input-group">
                  <label htmlFor="password">비밀번호 (최소 8자)</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">비밀번호 확인</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="signup-button" disabled={loading}>
                  {loading ? '가입 중...' : '가입하기'}
                </button>
              </>
            )}

            {error && <p className="error-message">{error}</p>}
          </form>

          <div className="signup-footer">
            <p>
              이미 계정이 있으신가요?{' '}
              <button onClick={onSwitchToLogin} className="link-button">
                로그인
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
