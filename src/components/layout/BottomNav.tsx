import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Calendar, Users, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/opportunities', label: 'Discover', icon: Compass },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/mentorship', label: 'Mentors', icon: Users },
  { to: '/assistant', label: 'AI', icon: Sparkles },
];

export function BottomNav() {
  const { pathname } = useLocation();
  // Hide on marketing/auth/onboarding
  const hidden =
    ['/', '/login', '/signup', '/onboarding', '/auth/callback'].includes(pathname) || pathname.startsWith('/admin');
  if (hidden) return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur md:hidden safe-bottom">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn('flex h-7 w-7 items-center justify-center rounded-full transition-colors', isActive && 'bg-primary-soft')}>
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
