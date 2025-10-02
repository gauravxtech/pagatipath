import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Award,
} from 'lucide-react';

const navItems = [
  { to: '/nto/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/nto/rankings', label: 'Rankings', icon: Award },
  { to: '/nto/analytics', label: 'Analytics', icon: TrendingUp },
  { to: '/nto/reports', label: 'Reports', icon: FileText },
];

export function NTOSidebar() {
  return (
    <nav className="p-4 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )
          }
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
