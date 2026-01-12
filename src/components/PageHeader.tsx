import { ReactNode } from 'react';
import './PageHeader.css';
import logo from '../assets/somshare_logo.png';

interface PageHeaderProps {
  pageTitle: string;
  onLogoClick?: () => void;
  onBackClick?: () => void;
  rightActions?: ReactNode;
}

function PageHeader({ pageTitle, onLogoClick, onBackClick, rightActions }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-content">
        <div className="page-header-left">
          {onLogoClick && (
            <button onClick={onLogoClick} className="logo-button" aria-label="홈으로">
              <img src={logo} alt="SomShare" className="page-logo" />
            </button>
          )}
          {onBackClick && (
            <button onClick={onBackClick} className="back-button" aria-label="뒤로 가기">
              ← 뒤로
            </button>
          )}
        </div>

        <h1 className="page-header-title">{pageTitle}</h1>

        <div className="page-header-right">
          {rightActions}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
