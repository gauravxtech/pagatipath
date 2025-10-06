import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  BarChart3,
  Bell,
  FileSearch,
  Settings,
  FolderTree,
} from 'lucide-react';

const navItems = [
  { to: '/clg-tpo/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clg-tpo/recruiters', label: 'Recruiters', icon: Building2 },
  { to: '/clg-tpo/jobs', label: 'Job Drives', icon: Briefcase },
  { to: '/clg-tpo/departments', label: 'Departments', icon: FolderTree },
  { to: '/clg-tpo/students', label: 'Students', icon: Users },
  { to: '/clg-tpo/reports', label: 'Reports', icon: BarChart3 },
  { to: '/clg-tpo/notifications', label: 'Notifications', icon: Bell },
  { to: '/clg-tpo/audit', label: 'Audit Logs', icon: FileSearch },
  { to: '/clg-tpo/settings', label: 'Settings', icon: Settings },
];

export function CollegeTPOSidebar() {
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
