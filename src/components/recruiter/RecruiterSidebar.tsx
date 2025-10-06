import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  UserCheck,
  BarChart3,
  Bell,
  FileSearch,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/recruiter/jobs', label: 'Job Postings', icon: Briefcase },
  { to: '/recruiter/applications', label: 'Applications', icon: FileText },
  { to: '/recruiter/interviews', label: 'Interviews', icon: Calendar },
  { to: '/recruiter/hired', label: 'Hired Candidates', icon: UserCheck },
  { to: '/recruiter/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/recruiter/notifications', label: 'Notifications', icon: Bell },
  { to: '/recruiter/audit', label: 'Audit Logs', icon: FileSearch },
  { to: '/recruiter/settings', label: 'Settings', icon: Settings },
];

export function RecruiterSidebar() {
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
