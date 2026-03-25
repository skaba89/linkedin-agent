'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  User, 
  Building2, 
  FileText, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useUIStore } from '@/lib/store';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mon Profil', href: '/profil', icon: User },
  { name: 'Pages LinkedIn', href: '/pages', icon: Building2 },
  { name: 'Contenu', href: '/contenu', icon: FileText },
  { name: 'Calendrier', href: '/calendrier', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Analyser', href: '/analyser', icon: BarChart3 },
  { name: 'Paramètres', href: '/parametres', icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapse } = useUIStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Wait for hydration to complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Check authentication once on mount
  useEffect(() => {
    if (!isHydrated) return;
    
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const result = await response.json();
        
        if (!result.success || !result.data?.user) {
          // Only redirect if we're not already on login page
          if (pathname !== '/login' && pathname !== '/register') {
            router.replace('/login');
          }
        }
      } catch {
        router.replace('/login');
      } finally {
        setIsChecking(false);
      }
    };
    
    checkSession();
  }, [isHydrated, router, pathname]);

  // Show loading state while checking auth or during hydration
  if (!isHydrated || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after check, don't render
  if (!isAuthenticated && !user) {
    return null;
  }

  const initials = user?.firstName?.[0] && user?.lastName?.[0] 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-40 h-screen bg-card border-r transition-all duration-300
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">LB</span>
              </div>
              <span className="font-semibold">LinkedInBoost</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="p-4 border-t">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.avatarUrl || ''} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`
        min-h-screen transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        {/* Top bar - Mobile */}
        <header className="lg:hidden h-16 border-b bg-card flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">LinkedInBoost</span>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </header>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
