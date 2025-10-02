import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Calendar, 
  UserCheck, 
  BarChart3, 
  Bell, 
  FileSearch, 
  Settings 
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
  { title: "Dashboard", url: "/recruiter/dashboard", icon: LayoutDashboard },
  { title: "Job Postings", url: "/recruiter/jobs", icon: Briefcase },
  { title: "Applications", url: "/recruiter/applications", icon: FileText },
  { title: "Interviews", url: "/recruiter/interviews", icon: Calendar },
  { title: "Hired Candidates", url: "/recruiter/hired", icon: UserCheck },
  { title: "Reports & Analytics", url: "/recruiter/reports", icon: BarChart3 },
  { title: "Notifications", url: "/recruiter/notifications", icon: Bell },
  { title: "Audit Logs", url: "/recruiter/audit", icon: FileSearch },
  { title: "Settings", url: "/recruiter/settings", icon: Settings },
];

export function RecruiterSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recruiter Portal</SidebarGroupLabel>
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
