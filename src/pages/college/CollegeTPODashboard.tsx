import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";
import { Building2, Users, Briefcase, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function CollegeTPODashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDepartments: 0,
    totalStudents: 0,
    activeJobs: 0,
    applicationsSent: 0,
    studentsHired: 0,
  });
  const [deptDistribution, setDeptDistribution] = useState<any[]>([]);
  const [applicationsByDept, setApplicationsByDept] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Get TPO's college
      const { data: tpoData } = await supabase
        .from("college_tpo")
        .select("college_id")
        .eq("user_id", user?.id)
        .single();

      if (!tpoData?.college_id) {
        toast.error("College not found");
        return;
      }

      // Total departments
      const { count: deptCount } = await supabase
        .from("departments")
        .select("*", { count: "exact", head: true })
        .eq("college_id", tpoData.college_id);

      // Total students
      const { count: studentCount } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .eq("college_id", tpoData.college_id);

      // Active jobs
      const { count: jobCount } = await supabase
        .from("opportunities")
        .select("*", { count: "exact", head: true })
        .eq("active", true);

      // Applications from this college's students
      const { data: students } = await supabase
        .from("students")
        .select("id")
        .eq("college_id", tpoData.college_id);

      const studentIds = students?.map(s => s.id) || [];

      let appCount = 0;
      let hiredCount = 0;

      if (studentIds.length > 0) {
        const { count: applications } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .in("student_id", studentIds);

        const { count: hired } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .in("student_id", studentIds)
          .eq("status", "accepted");

        appCount = applications || 0;
        hiredCount = hired || 0;
      }

      setStats({
        totalDepartments: deptCount || 0,
        totalStudents: studentCount || 0,
        activeJobs: jobCount || 0,
        applicationsSent: appCount,
        studentsHired: hiredCount,
      });

      // Department-wise student distribution
      const { data: depts } = await supabase
        .from("departments")
        .select(`
          name,
          students (count)
        `)
        .eq("college_id", tpoData.college_id);

      const deptDist = depts?.map(dept => ({
        name: dept.name,
        value: dept.students[0]?.count || 0,
      })) || [];

      setDeptDistribution(deptDist);

      // Applications by department
      const { data: appsByDept } = await supabase
        .from("departments")
        .select(`
          name,
          students!inner (
            id,
            applications (count)
          )
        `)
        .eq("college_id", tpoData.college_id);

      const appDist = appsByDept?.map(dept => ({
        name: dept.name,
        applications: dept.students.reduce((sum: number, s: any) => sum + (s.applications[0]?.count || 0), 0),
      })) || [];

      setApplicationsByDept(appDist);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CollegeTPOSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">College TPO Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-5 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDepartments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeJobs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.applicationsSent}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Hired</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.studentsHired}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Department-wise Student Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deptDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deptDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Applications by Department</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicationsByDept}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
