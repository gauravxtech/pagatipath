import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  FileText,
  TrendingUp,
  FolderTree,
  Users,
  Bell,
  Shield,
  Settings,
  Briefcase,
} from 'lucide-react';

const navItems = [
  { to: '/dto/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dto/colleges', label: 'Colleges', icon: Building2 },
  { to: '/dto/departments', label: 'Departments', icon: FolderTree },
  { to: '/dto/students', label: 'Students', icon: Users },
  { to: '/dto/recruiters', label: 'Recruiters', icon: Briefcase },
  { to: '/dto/reports', label: 'Reports & Analytics', icon: FileText },
  { to: '/dto/notifications', label: 'Notifications', icon: Bell },
  { to: '/dto/audit', label: 'Audit Logs', icon: Shield },
  { to: '/dto/settings', label: 'Settings', icon: Settings },
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
