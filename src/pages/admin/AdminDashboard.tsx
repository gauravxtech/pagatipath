import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/analytics/StatsCard";
import { Users, GraduationCap, Building2, UserCheck, AlertCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalColleges: 0,
    totalStudents: 0,
    totalOfficers: 0,
    pendingApprovals: 0,
    activeUsers: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [students, colleges, nto, sto, dto, tpo, dept, pendingRoles] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('colleges').select('id', { count: 'exact', head: true }),
        supabase.from('nto_officers').select('id', { count: 'exact', head: true }),
        supabase.from('sto_officers').select('id', { count: 'exact', head: true }),
        supabase.from('dto_officers').select('id', { count: 'exact', head: true }),
        supabase.from('college_tpo').select('id', { count: 'exact', head: true }),
        supabase.from('department_coordinators').select('id', { count: 'exact', head: true }),
        supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('approved', false),
      ]);

      const totalOfficers = (nto.count || 0) + (sto.count || 0) + (dto.count || 0);
      const totalUsers = (students.count || 0) + totalOfficers + (tpo.count || 0) + (dept.count || 0);

      setStats({
        totalUsers,
        totalColleges: colleges.count || 0,
        totalStudents: students.count || 0,
        totalOfficers,
        pendingApprovals: pendingRoles.count || 0,
        activeUsers: totalUsers
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const roleDistribution = [
    { name: 'Students', value: stats.totalStudents, color: '#3b82f6' },
    { name: 'Officers', value: stats.totalOfficers, color: '#10b981' },
    { name: 'Colleges', value: stats.totalColleges, color: '#f59e0b' },
  ];

  const monthlyTrend = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 180 },
    { month: 'Mar', users: 250 },
    { month: 'Apr', users: 320 },
    { month: 'May', users: 400 },
    { month: 'Jun', users: stats.totalUsers },
  ];

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and key performance indicators</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Registered Users"
            value={stats.totalUsers}
            description="All roles combined"
            icon={Users}
            trend={{ value: 12, label: 'from last month' }}
          />
          <StatsCard
            title="Total Colleges"
            value={stats.totalColleges}
            description="Registered institutions"
            icon={Building2}
            trend={{ value: 5, label: 'from last month' }}
          />
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            description="Active learners"
            icon={GraduationCap}
            trend={{ value: 18, label: 'from last month' }}
          />
          <StatsCard
            title="Training Officers"
            value={stats.totalOfficers}
            description="NTO, STO, DTO combined"
            icon={UserCheck}
            trend={{ value: 3, label: 'from last month' }}
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            description="Awaiting review"
            icon={AlertCircle}
          />
          <StatsCard
            title="Active Users"
            value={stats.activeUsers}
            description="Currently online"
            icon={TrendingUp}
            trend={{ value: 8, label: 'from last hour' }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Registration Trend</CardTitle>
              <CardDescription>Monthly user growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role-wise Distribution</CardTitle>
              <CardDescription>User breakdown by role</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm">New student registered</span>
                </div>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">College approved</span>
                </div>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Pending approval for TPO</span>
                </div>
                <span className="text-xs text-muted-foreground">3 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
