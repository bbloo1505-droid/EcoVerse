import { Link, NavLink, useLocation } from 'react-router-dom';
import { Leaf, Bell, Search, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DEFAULT_TIP_WALL_KEY } from '@/lib/tipWallKeys';

type NavItem = {
  to: string;
  label: string;
  /** When set, use instead of exact route match (e.g. any `/tips/:wall`). */
  activeMatch?: (pathname: string) => boolean;
};

/** Main discovery — keep the bar readable; everything else lives under the profile menu. */
const primaryNavItems: NavItem[] = [
  { to: '/home', label: 'Home' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/events', label: 'Events' },
  { to: '/news', label: 'News' },
  { to: '/assistant', label: 'AI coach' },
];

const moreNavItems: NavItem[] = [
  { to: '/memberships', label: 'Memberships' },
  { to: '/mentorship', label: 'Mentorship' },
  { to: '/career-tips', label: 'Career plan' },
  { to: `/tips/${DEFAULT_TIP_WALL_KEY}`, label: 'Tip wall', activeMatch: (p) => p.startsWith('/tips') },
  { to: '/share-photo', label: 'Share photo' },
];

function routeActive(pathname: string, item: NavItem, isActive: boolean) {
  return item.activeMatch ? item.activeMatch(pathname) : isActive;
}

function moreMenuContainsPath(pathname: string) {
  return moreNavItems.some((i) =>
    i.activeMatch ? i.activeMatch(pathname) : pathname === i.to,
  );
}

function isMoreItemActive(pathname: string, item: NavItem) {
  if (item.activeMatch) return item.activeMatch(pathname);
  return pathname === item.to;
}

function avatarInitials(user: { user_metadata?: { full_name?: string }; email?: string | null } | null) {
  if (!user) return '?';
  const name = typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.trim() : '';
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  const em = user.email || '?';
  return em.slice(0, 2).toUpperCase();
}

export function TopNav() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const isMarketing = pathname === '/';
  const isAuth = ['/login', '/signup', '/onboarding', '/auth/callback'].includes(pathname);

  if (isAuth) {
    return (
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
        <div className="container-app flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
            <Leaf className="h-5 w-5" /> EcoVerse
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Back to home</Link>
        </div>
      </header>
    );
  }

  if (isMarketing) {
    return (
      <header className="sticky top-0 z-40 border-b border-border/60 bg-surface/85 backdrop-blur">
        <div className="container-app flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-primary">
            <Leaf className="h-5 w-5" /> EcoVerse
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-text-secondary">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <Link to="/opportunities" className="hover:text-foreground">Explore</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/signup"><Button size="sm">Start free trial</Button></Link>
          </div>
        </div>
      </header>
    );
  }

  // App top nav (web)
  const profileSectionActive = pathname === '/account' || moreMenuContainsPath(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4 sm:gap-6">
        <Link to="/home" className="flex items-center gap-2 font-display text-lg font-bold text-primary shrink-0 min-w-0">
          <Leaf className="h-5 w-5 shrink-0" /> <span className="truncate">EcoVerse</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium min-w-0 flex-1 justify-center">
          {primaryNavItems.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 transition-colors whitespace-nowrap',
                  routeActive(pathname, i, isActive)
                    ? 'bg-primary-soft text-primary'
                    : 'text-text-secondary hover:bg-surface-alt hover:text-foreground',
                )
              }
            >
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'ml-1 flex h-9 items-center gap-0.5 rounded-full pl-1 pr-1.5 outline-none transition-[box-shadow,background-color] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  profileSectionActive && 'ring-2 ring-primary/35 ring-offset-2 ring-offset-background',
                )}
                aria-label="Account menu"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-hero text-sm font-semibold text-primary-foreground">
                  {avatarInitials(user)}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                {user?.email ? <span className="truncate block max-w-[13rem]">{user.email}</span> : "Account"}
              </DropdownMenuLabel>
              {user && (
                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={() => {
                    void signOut();
                  }}
                >
                  <LogOut className="h-4 w-4" /> Log out
                </DropdownMenuItem>
              )}
              {!user && (
                <DropdownMenuItem asChild>
                  <Link to="/login" className="cursor-pointer">
                    Log in
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/account"
                  className={cn(
                    'cursor-pointer',
                    pathname === '/account' && 'bg-accent text-accent-foreground',
                  )}
                >
                  Profile & settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">More pages</DropdownMenuLabel>
              {moreNavItems.map((i) => (
                <DropdownMenuItem key={i.to} asChild>
                  <Link
                    to={i.to}
                    className={cn(
                      'cursor-pointer',
                      isMoreItemActive(pathname, i) && 'bg-accent text-accent-foreground',
                    )}
                  >
                    {i.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
