import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  const { pathname } = useLocation();
  const isApp = !['/', '/login', '/signup', '/onboarding', '/auth/callback'].includes(pathname);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <main className={isApp ? 'flex-1 pb-24 md:pb-10' : 'flex-1'}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
