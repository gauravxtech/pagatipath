import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/analytics/StatsCard";
import { Users, GraduationCap, Building2, UserCheck, AlertCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t } = useTranslation();
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
      const [students, colleges, nto, sto, dto, tpo, dept, recruiters, pendingRoles] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('colleges').select('id', { count: 'exact', head: true }),
        supabase.from('nto_officers').select('id', { count: 'exact', head: true }),
        supabase.from('sto_officers').select('id', { count: 'exact', head: true }),
        supabase.from('dto_officers').select('id', { count: 'exact', head: true }),
        supabase.from('college_tpo').select('id', { count: 'exact', head: true }),
        supabase.from('department_coordinators').select('id', { count: 'exact', head: true }),
        supabase.from('recruiters').select('id', { count: 'exact', head: true }),
        supabase.from('user_roles').select('id', { count: 'exact', head: true }).eq('approved', false),
      ]);

      console.log('Admin Dashboard Stats:', {
        pendingRolesCount: pendingRoles.count,
        pendingRolesError: pendingRoles.error,
        allCounts: {
          students: students.count,
          colleges: colleges.count,
          nto: nto.count,
          sto: sto.count,
          dto: dto.count,
          tpo: tpo.count,
          dept: dept.count,
          recruiters: recruiters.count
        }
      });

      const totalOfficers = (nto.count || 0) + (sto.count || 0) + (dto.count || 0);
      const totalUsers = (students.count || 0) + totalOfficers + (tpo.count || 0) + (dept.count || 0) + (recruiters.count || 0);

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
    { name: 'Students', value: stats.totalStudents, color: 'hsl(220 45% 15%)' },
    { name: 'Officers', value: stats.totalOfficers, color: 'hsl(20 95% 55%)' },
    { name: 'Colleges', value: stats.totalColleges, color: 'hsl(25 95% 60%)' },
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
        <div className="bg-white dark:bg-card rounded-xl p-6 shadow-soft border border-gray-100 dark:border-border">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-foreground">{t('admin.adminDashboard')}</h1>
          <p className="text-gray-600 dark:text-muted-foreground mt-2">{t('admin.systemOverview')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title={t('admin.totalRegisteredUsers')}
            value={stats.totalUsers}
            description={t('admin.allRolesCombined')}
            icon={Users}
            trend={{ value: 12, label: t('admin.fromLastMonth') }}
          />
          <StatsCard
            title={t('admin.totalColleges')}
            value={stats.totalColleges}
            description={t('admin.registeredInstitutions')}
            icon={Building2}
            trend={{ value: 5, label: t('admin.fromLastMonth') }}
          />
          <StatsCard
            title={t('admin.totalStudents')}
            value={stats.totalStudents}
            description={t('admin.activeLearners')}
            icon={GraduationCap}
            trend={{ value: 18, label: t('admin.fromLastMonth') }}
          />
          <StatsCard
            title={t('admin.trainingOfficers')}
            value={stats.totalOfficers}
            description={t('admin.ntoStoDtoCombined')}
            icon={UserCheck}
            trend={{ value: 3, label: t('admin.fromLastMonth') }}
          />
          <StatsCard
            title={t('admin.pendingApprovals')}
            value={stats.pendingApprovals}
            description={t('admin.awaitingReview')}
            icon={AlertCircle}
          />
          <StatsCard
            title={t('admin.activeUsers')}
            value={stats.activeUsers}
            description={t('admin.currentlyOnline')}
            icon={TrendingUp}
            trend={{ value: 8, label: t('admin.fromLastHour') }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-foreground">User Registration Trend</CardTitle>
              <CardDescription className="text-gray-600 dark:text-muted-foreground">Monthly user growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(20 95% 55%)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(20 95% 55%)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-foreground">Role-wise Distribution</CardTitle>
              <CardDescription className="text-gray-600 dark:text-muted-foreground">User breakdown by role</CardDescription>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-foreground">Recent Activity</CardTitle>
            <CardDescription className="text-gray-600 dark:text-muted-foreground">Latest system events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-foreground">New student registered</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-muted-foreground font-medium">2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-foreground">College approved</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-muted-foreground font-medium">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-foreground">Pending approval for TPO</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-muted-foreground font-medium">3 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
