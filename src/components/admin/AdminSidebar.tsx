import { Home, Users, GraduationCap, Building2, BarChart3, Settings, Bell, LogOut, FileText, Shield, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname.startsWith(path);
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Building2, label: "Colleges", path: "/admin/colleges" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Bell, label: "Notifications", path: "/admin/notifications" },
    { icon: FileText, label: "Audit Logs", path: "/admin/audit" },
    { icon: Shield, label: "Access Control", path: "/admin/access" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
    { icon: HelpCircle, label: "Helpdesk", path: "/admin/help" },
  ];

  return (
    <div className="w-64 bg-card border-r min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">PragatiPath</p>
      </div>
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
