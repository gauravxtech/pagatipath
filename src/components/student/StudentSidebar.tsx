import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Award,
  HelpCircle,
} from 'lucide-react';

const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/profile', label: 'My Profile', icon: User },
  { to: '/student/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/student/applications', label: 'My Applications', icon: FileText },
  { to: '/student/certificates', label: 'Certificates', icon: Award },
  { to: '/student/support', label: 'Support', icon: HelpCircle },
];

export function StudentSidebar() {
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
