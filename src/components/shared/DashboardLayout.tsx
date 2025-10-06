import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, sidebar, title, subtitle }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen bg-gradient-subtle w-full">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 border-b bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90 shadow-soft">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  {sidebar}
                </SheetContent>
              </Sheet>

              <Link to="/" className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-accent to-orange-500 rounded-xl shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl text-white">PragatiPath</span>
                  <p className="text-xs text-white/80 hidden sm:block">National Training & Placement Portal</p>
                </div>
              </Link>
            </div>

            {title && (
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-white">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-white/80">{subtitle}</p>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <NotificationBell />
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white hover:bg-white/10">
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-accent to-orange-500 text-white font-semibold">
                        {getInitials(user?.user_metadata?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-card shadow-soft border border-gray-200 dark:border-border">
                  <DropdownMenuItem onClick={signOut} className="text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-muted">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden w-full">
          {/* Desktop Sidebar - Fixed, scrollable independently */}
          <aside className="hidden lg:block w-72 border-r bg-white dark:bg-card shadow-soft overflow-y-auto">
            {sidebar}
          </aside>

          {/* Main Content - Scrollable independently */}
          <main className="flex-1 overflow-y-auto p-6 bg-gradient-subtle">
            <div className="container mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
