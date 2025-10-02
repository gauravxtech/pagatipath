import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  FileText,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { to: '/dto/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dto/colleges', label: 'Colleges', icon: Building2 },
  { to: '/dto/reports', label: 'Reports', icon: FileText },
  { to: '/dto/analytics', label: 'Analytics', icon: TrendingUp },
];

export function DTOSidebar() {
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
