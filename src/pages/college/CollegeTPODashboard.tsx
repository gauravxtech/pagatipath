import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";
import { StatsCard } from "@/components/analytics/StatsCard";
import { Building2, Users, Briefcase, TrendingUp, Award, FileText } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

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
    placementRate: 0,
  });
  const [deptDistribution, setDeptDistribution] = useState<any[]>([]);
  const [applicationsByDept, setApplicationsByDept] = useState<any[]>([]);
  const [placementTrend, setPlacementTrend] = useState<any[]>([]);

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

      const placementRate = studentCount ? Math.round((hiredCount / studentCount) * 100) : 0;

      setStats({
        totalDepartments: deptCount || 0,
        totalStudents: studentCount || 0,
        activeJobs: jobCount || 0,
        applicationsSent: appCount,
        studentsHired: hiredCount,
        placementRate,
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

      // Mock placement trend data (last 6 months)
      setPlacementTrend([
        { month: 'Jan', placements: 12 },
        { month: 'Feb', placements: 18 },
        { month: 'Mar', placements: 25 },
        { month: 'Apr', placements: 30 },
        { month: 'May', placements: 35 },
        { month: 'Jun', placements: hiredCount || 40 },
      ]);

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
    <DashboardLayout title="TPO Dashboard" sidebar={<CollegeTPOSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Training & Placement Officer Dashboard</h1>
          <p className="text-muted-foreground">College-level placement analytics and insights</p>
        </div>

        {/* Stats Cards - First Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Departments"
            value={stats.totalDepartments}
            icon={Building2}
            loading={loading}
          />
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            loading={loading}
          />
          <StatsCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={Briefcase}
            loading={loading}
          />
          <StatsCard
            title="Placement Rate"
            value={`${stats.placementRate}%`}
            icon={TrendingUp}
            loading={loading}
          />
        </div>

        {/* Stats Cards - Second Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Applications Sent"
            value={stats.applicationsSent}
            icon={FileText}
            loading={loading}
          />
          <StatsCard
            title="Students Hired"
            value={stats.studentsHired}
            icon={Award}
            loading={loading}
          />
          <StatsCard
            title="Success Rate"
            value={stats.applicationsSent ? `${Math.round((stats.studentsHired / stats.applicationsSent) * 100)}%` : '0%'}
            icon={TrendingUp}
            loading={loading}
          />
        </div>

        {/* Charts - First Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Student Distribution</CardTitle>
              <CardDescription>Total students enrolled across departments</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications by Department</CardTitle>
              <CardDescription>Number of job applications per department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicationsByDept}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts - Second Row */}
        <Card>
          <CardHeader>
            <CardTitle>Placement Trend</CardTitle>
            <CardDescription>Monthly student placement progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={placementTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="placements" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Students Placed"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
