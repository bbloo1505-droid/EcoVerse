import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  profilePhoto: string;
  profileName: string;
  onProfileMenuToggle: () => void;
  onNotificationsClick: () => void;
  notificationCount: number;
}

export function AppShell({
  children,
  profilePhoto,
  profileName,
  onProfileMenuToggle,
  onNotificationsClick,
  notificationCount,
}: AppShellProps) {
  return (
    <div className="app-shell-outer">
      <div className="app-shell">
        <div className="status-bar">
          <span>9:41</span>
          <span>EcoVerse</span>
          <span>5G 92%</span>
        </div>
        <header className="top-nav">
          <div>
            <p className="brand">EcoVerse</p>
            <p className="app-subtitle">Environmental careers, simplified</p>
          </div>
          <div className="top-nav-actions">
            <button
              className="icon-button icon-button-with-badge"
              aria-label="Open notifications"
              onClick={onNotificationsClick}
            >
              N
              {notificationCount > 0 && <span className="icon-badge">{notificationCount}</span>}
            </button>
            <button
              className="profile-avatar-button"
              aria-label="Open profile menu"
              onClick={onProfileMenuToggle}
            >
              <img src={profilePhoto} alt={`${profileName} profile`} className="profile-avatar" />
            </button>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
