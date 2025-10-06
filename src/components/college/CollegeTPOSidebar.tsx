import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar, 
  BarChart3, 
  Bell, 
  FileSearch, 
  Settings,
  FolderTree 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/clg-tpo/dashboard", icon: LayoutDashboard },
  { title: "Recruiters", url: "/clg-tpo/recruiters", icon: Building2 },
  { title: "Job Drives", url: "/clg-tpo/jobs", icon: Briefcase },
  { title: "Departments", url: "/clg-tpo/departments", icon: FolderTree },
  { title: "Students", url: "/clg-tpo/students", icon: Users },
  { title: "Reports", url: "/clg-tpo/reports", icon: BarChart3 },
  { title: "Notifications", url: "/clg-tpo/notifications", icon: Bell },
  { title: "Audit Logs", url: "/clg-tpo/audit", icon: FileSearch },
  { title: "Settings", url: "/clg-tpo/settings", icon: Settings },
];

export function CollegeTPOSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>College TPO Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
