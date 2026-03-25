'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  User,
  Building2,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Search,
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyser un profil', href: '/analyser', icon: Search },
  { name: 'Mon Profil', href: '/profil', icon: User },
  { name: 'Pages Entreprise', href: '/pages', icon: Building2 },
  { name: 'Contenu', href: '/contenu', icon: FileText },
  { name: 'Calendrier', href: '/calendrier', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Paramètres', href: '/parametres', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-sidebar transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          'flex h-16 items-center border-b px-4',
          sidebarCollapsed ? 'justify-center' : 'justify-between'
        )}>
          {!sidebarCollapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Linkedin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">LinkedIn Manager</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Linkedin className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    sidebarCollapsed && 'justify-center px-2'
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Collapse Button */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'w-full justify-center',
              !sidebarCollapsed && 'justify-start'
            )}
            onClick={toggleSidebarCollapse}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Réduire</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
