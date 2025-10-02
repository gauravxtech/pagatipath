import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MapPin,
  Building,
  Building2,
  FileText,
  Bell,
  FileSearch,
  Settings,
  Briefcase,
} from 'lucide-react';

const navItems = [
  { to: '/nto/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/nto/states', label: 'States (STOs)', icon: MapPin },
  { to: '/nto/districts', label: 'Districts (DTOs)', icon: Building },
  { to: '/nto/colleges', label: 'Colleges', icon: Building2 },
  { to: '/nto/recruiters', label: 'Recruiters', icon: Briefcase },
  { to: '/nto/reports', label: 'Reports & Analytics', icon: FileText },
  { to: '/nto/notifications', label: 'Notifications', icon: Bell },
  { to: '/nto/audit', label: 'Audit Logs', icon: FileSearch },
  { to: '/nto/settings', label: 'Settings', icon: Settings },
];

export function NTOSidebar() {
  return (
    <nav className="p-4 space-y-2">
      <div className="mb-6">
        <h2 className="text-lg font-bold">NTO Panel</h2>
        <p className="text-sm text-muted-foreground">National Training Officer</p>
      </div>
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
