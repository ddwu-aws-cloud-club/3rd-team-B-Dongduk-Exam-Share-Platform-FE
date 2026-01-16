import { useState, useRef } from 'react';
import logo from '../assets/somshare_logo.png';
import './ProfileSetup.css';
import { COLLEGES } from '../constants/majors';
import { setupProfile } from '../api/auth.api';

interface ProfileSetupProps {
  email: string;
  onProfileComplete: () => void;
}

function ProfileSetup({ email, onProfileComplete }: ProfileSetupProps) {
  const [nickname, setNickname] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 파일 검증
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }

      setProfileImage(file);
      setError('');

      // 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCollege(e.target.value);
    setSelectedMajor(''); // 대학 변경 시 전공 초기화
  };

  const getCurrentMajors = () => {
    const college = COLLEGES.find((c) => c.name === selectedCollege);
    return college?.majors || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.length < 3 || nickname.length > 10) {
      setError('닉네임은 3자 이상 10자 이하로 입력해주세요.');
      return;
    }

    if (!selectedCollege) {
      setError('소속 대학을 선택해주세요.');
      return;
    }

    if (!selectedMajor) {
      setError('전공을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await setupProfile({
        email,
        nickname,
        college: selectedCollege,
        major: selectedMajor,
        profileImage,
      });
      alert('프로필 설정이 완료되었습니다!');
      onProfileComplete();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '프로필 설정 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="profile-setup-container">
      <div className="profile-setup-box">
        <img src={logo} alt="SomShare Logo" className="logo" />
        <h1>프로필 설정</h1>
        <p className="subtitle">환영합니다! 프로필을 설정해주세요.</p>

        <form onSubmit={handleSubmit}>
          {/* 프로필 사진 */}
          <div className="profile-image-section">
            <div className="profile-image-wrapper" onClick={handleImageClick}>
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" className="profile-preview" />
              ) : (
                <div className="profile-placeholder">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="camera-icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                  <p>사진 추가</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <p className="image-hint">프로필 사진을 업로드해주세요 (선택사항, 최대 5MB)</p>
          </div>

          {/* 닉네임 */}
          <div className="input-group">
            <label htmlFor="nickname">닉네임 *</label>
            <input
              type="text"
              id="nickname"
              placeholder="닉네임을 입력하세요 (3-10자)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={10}
              required
            />
          </div>

          {/* 소속 대학 */}
          <div className="input-group">
            <label htmlFor="college">소속 대학 *</label>
            <select
              id="college"
              value={selectedCollege}
              onChange={handleCollegeChange}
              required
            >
              <option value="">대학을 선택하세요</option>
              {COLLEGES.map((college) => (
                <option key={college.name} value={college.name}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          {/* 전공 */}
          {selectedCollege && (
            <div className="input-group">
              <label htmlFor="major">전공 *</label>
              <select
                id="major"
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                required
              >
                <option value="">전공을 선택하세요</option>
                {getCurrentMajors().map((major) => (
                  <option key={major.value} value={major.label}>
                    {major.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? '저장 중...' : '완료'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;
