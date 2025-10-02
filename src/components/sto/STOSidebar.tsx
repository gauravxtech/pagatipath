import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MapPin,
  FileText,
  TrendingUp,
  Building2,
  Users,
  Settings,
  Briefcase,
} from 'lucide-react';

const navItems = [
  { to: '/sto/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/sto/districts', label: 'Districts (DTOs)', icon: MapPin },
  { to: '/sto/colleges', label: 'Colleges', icon: Building2 },
  { to: '/sto/students', label: 'Students', icon: Users },
  { to: '/sto/recruiters', label: 'Recruiters', icon: Briefcase },
  { to: '/sto/reports', label: 'Reports', icon: FileText },
  { to: '/sto/analytics', label: 'Analytics', icon: TrendingUp },
  { to: '/sto/settings', label: 'Settings', icon: Settings },
];

export function STOSidebar() {
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
