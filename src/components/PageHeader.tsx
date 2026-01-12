import './PageHeader.css';
import logo from '../assets/somshare_logo.png';

interface PageHeaderProps {
  pageTitle: string;
  onLogoClick?: () => void;
  onBackClick?: () => void;
  onLogout?: () => void;
  onMyPageClick?: () => void;
  userPoints?: number;
  showUploadButton?: boolean;
  onUploadClick?: () => void;
}

function PageHeader({
  pageTitle,
  onLogoClick,
  onBackClick,
  onLogout,
  onMyPageClick,
  userPoints,
  showUploadButton,
  onUploadClick
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-content">
        {/* 왼쪽 위 - 뒤로가기 */}
        <div className="page-header-top-left">
          {onBackClick && (
            <button onClick={onBackClick} className="back-button" aria-label="뒤로 가기">
              ← 뒤로
            </button>
          )}
        </div>

        {/* 오른쪽 위 - 포인트, 마이페이지, 로그아웃 */}
        <div className="page-header-top-right">
          {userPoints !== undefined && (
            <div className="header-points">
              <span className="points-label">내 포인트</span>
              <span className="points-value">{userPoints}P</span>
            </div>
          )}
          {onMyPageClick && (
            <button onClick={onMyPageClick} className="header-button mypage-button">
              마이페이지
            </button>
          )}
          {onLogout && (
            <button onClick={onLogout} className="header-button logout-button">
              로그아웃
            </button>
          )}
        </div>

        {/* 중앙 - 로고와 화면 이름 */}
        <div className="page-header-center">
          {onLogoClick && (
            <button onClick={onLogoClick} className="logo-button" aria-label="홈으로">
              <img src={logo} alt="SomShare" className="page-logo" />
            </button>
          )}
          <h1 className="page-header-title">{pageTitle}</h1>

          {showUploadButton && onUploadClick && (
            <button onClick={onUploadClick} className="upload-button-header">
              + 족보 업로드
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
