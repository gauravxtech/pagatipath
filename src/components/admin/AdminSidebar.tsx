import { Home, Users, GraduationCap, Building2, BarChart3, Settings, Bell, LogOut, FileText, Shield, HelpCircle, Briefcase } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

export const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    { icon: Home, label: t('navigation.dashboard'), path: "/admin/dashboard" },
    { icon: Users, label: t('sidebar.users'), path: "/admin/users" },
    { icon: Building2, label: t('sidebar.colleges'), path: "/admin/colleges" },
    { icon: Briefcase, label: t('sidebar.recruiters'), path: "/admin/recruiters" },
    { icon: BarChart3, label: t('sidebar.reports'), path: "/admin/reports" },
    { icon: Bell, label: t('sidebar.notifications'), path: "/admin/notifications" },
    { icon: FileText, label: t('sidebar.auditLogs'), path: "/admin/audit" },
    { icon: Shield, label: t('sidebar.accessControl'), path: "/admin/access" },
    { icon: Settings, label: t('sidebar.settings'), path: "/admin/settings" },
    { icon: HelpCircle, label: t('sidebar.helpdesk'), path: "/admin/help" },
  ];

  return (
    <div className="w-full bg-white dark:bg-card min-h-screen p-6 flex flex-col shadow-soft">
      <div className="mb-8 pb-6 border-b border-gray-100 dark:border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-accent to-orange-500 rounded-xl shadow-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-foreground">{t('admin.adminPanel')}</h2>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">PragatiPath</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive(item.path)
              ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-soft"
              : "text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-muted hover:text-primary dark:hover:text-accent"
              }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-border">
        <Button
          variant="outline"
          className="w-full justify-start border-gray-200 dark:border-border text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-muted hover:text-primary dark:hover:text-accent hover:border-primary/20 dark:hover:border-accent/20"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5 mr-3" />
          {t('navigation.signOut')}
        </Button>
      </div>
    </div>
  );
};
