"use client";

interface AppHeaderProps {
  phaseLabel: string;
  onOpenSources: () => void;
  onOpenChangelog: () => void;
}

export function AppHeader({
  phaseLabel,
  onOpenSources,
  onOpenChangelog,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">
          3
        </span>
        <div>
          <a className="brand-name" href="#main-content">
            삼권분립 사건 처리실
          </a>
          <p>{phaseLabel}</p>
        </div>
      </div>
      <div className="header-actions">
        <button className="text-button" type="button" onClick={onOpenSources}>
          공식 근거
        </button>
        <button className="text-button" type="button" onClick={onOpenChangelog}>
          업데이트 내역
        </button>
      </div>
    </header>
  );
}
