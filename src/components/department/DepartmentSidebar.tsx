import { 
  LayoutDashboard,
  Users,
  Briefcase,
  TrendingUp,
  Settings,
  FileText
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/department/dashboard",
  },
  {
    title: "Students",
    icon: Users,
    url: "/department/students",
  },
  {
    title: "Applications",
    icon: Briefcase,
    url: "/department/applications",
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    url: "/department/analytics",
  },
  {
    title: "Reports",
    icon: FileText,
    url: "/department/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/department/settings",
  },
];

export function DepartmentSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Department Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive ? "bg-accent" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
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
