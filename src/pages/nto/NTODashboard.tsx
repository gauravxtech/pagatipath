import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { NTOSidebar } from '@/components/nto/NTOSidebar';
import { StatsCard } from '@/components/analytics/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, TrendingUp, MapPin, Activity, School } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';

export default function NTODashboard() {
  const [stats, setStats] = useState({
    totalStates: 0,
    totalSTOs: 0,
    totalDTOs: 0,
    totalColleges: 0,
    totalStudents: 0,
    activeUsers: 0,
    pendingApprovals: 0,
  });
  const [trendData, setTrendData] = useState<any[]>([]);
  const [roleData, setRoleData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch state count
      const { data: colleges } = await supabase
        .from('colleges')
        .select('state')
        .eq('approved', true);

      const uniqueStates = new Set(colleges?.map((c) => c.state));

      // Fetch STOs
      const { count: stoCount, data: stos } = await supabase
        .from('sto_officers')
        .select('*', { count: 'exact' });

      // Fetch DTOs
      const { count: dtoCount, data: dtos } = await supabase
        .from('dto_officers')
        .select('*', { count: 'exact' });

      // Fetch colleges
      const { count: collegeCount } = await supabase
        .from('colleges')
        .select('*', { count: 'exact', head: true })
        .eq('approved', true);

      // Fetch students
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      // Count pending approvals
      const pendingStos = stos?.filter(s => !s.approved).length || 0;
      const pendingDtos = dtos?.filter(d => !d.approved).length || 0;

      setStats({
        totalStates: uniqueStates.size,
        totalSTOs: stoCount || 0,
        totalDTOs: dtoCount || 0,
        totalColleges: collegeCount || 0,
        totalStudents: studentCount || 0,
        activeUsers: 245, // Mock data
        pendingApprovals: pendingStos + pendingDtos,
      });

      // Mock trend data
      setTrendData([
        { month: 'Jan', students: 4500 },
        { month: 'Feb', students: 5200 },
        { month: 'Mar', students: 6100 },
        { month: 'Apr', students: 7300 },
        { month: 'May', students: 8400 },
        { month: 'Jun', students: 9500 },
      ]);

      // Role-wise breakdown
      setRoleData([
        { name: 'STOs', value: stoCount || 0 },
        { name: 'DTOs', value: dtoCount || 0 },
        { name: 'TPOs', value: 150 },
        { name: 'Students', value: studentCount || 0 },
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <DashboardLayout title="NTO Dashboard" sidebar={<NTOSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">National Training Officer Dashboard</h1>
          <p className="text-muted-foreground">National-level KPIs and insights</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active States"
            value={stats.totalStates}
            icon={MapPin}
            loading={loading}
          />
          <StatsCard
            title="Total STOs"
            value={stats.totalSTOs}
            icon={Users}
            loading={loading}
          />
          <StatsCard
            title="Total DTOs"
            value={stats.totalDTOs}
            icon={Activity}
            loading={loading}
          />
          <StatsCard
            title="Total Colleges"
            value={stats.totalColleges}
            icon={Building2}
            loading={loading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            icon={School}
            loading={loading}
          />
          <StatsCard
            title="Active Users (24hrs)"
            value={stats.activeUsers}
            icon={TrendingUp}
            loading={loading}
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={Activity}
            loading={loading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Student Growth Trend</CardTitle>
              <CardDescription>National-level student registration growth</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role-wise Breakdown</CardTitle>
              <CardDescription>Distribution of users by role</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
