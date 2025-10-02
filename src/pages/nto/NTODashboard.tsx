import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { NTOSidebar } from '@/components/nto/NTOSidebar';
import { StatsCard } from '@/components/analytics/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/shared/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, TrendingUp, Award, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'sonner';

export default function NTODashboard() {
  const [stats, setStats] = useState({
    totalStates: 0,
    totalColleges: 0,
    totalStudents: 0,
    nationalPlacementRate: 0,
  });
  const [rankings, setRankings] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
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

      // Fetch basic stats
      const { count: collegeCount } = await supabase
        .from('colleges')
        .select('*', { count: 'exact', head: true })
        .eq('approved', true);

      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      const { count: placedCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('placed', true);

      setStats({
        totalStates: uniqueStates.size,
        totalColleges: collegeCount || 0,
        totalStudents: studentCount || 0,
        nationalPlacementRate: studentCount ? Math.round(((placedCount || 0) / studentCount) * 100) : 0,
      });

      // Fetch college rankings
      const { data: rankingsData } = await supabase
        .from('college_rankings')
        .select('*, colleges(name, state)')
        .eq('year', new Date().getFullYear())
        .order('rank', { ascending: true })
        .limit(10);

      setRankings(rankingsData || []);

      // Mock trend data (in production, this would come from analytics_events)
      setTrendData([
        { month: 'Jan', placements: 120, applications: 450 },
        { month: 'Feb', placements: 180, applications: 520 },
        { month: 'Mar', placements: 240, applications: 680 },
        { month: 'Apr', placements: 310, applications: 790 },
        { month: 'May', placements: 380, applications: 920 },
        { month: 'Jun', placements: 450, applications: 1100 },
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const rankingColumns = [
    {
      key: 'rank',
      label: 'Rank',
      render: (row: any) => (
        <span className="font-bold text-lg">#{row.rank}</span>
      ),
    },
    {
      key: 'college',
      label: 'College',
      render: (row: any) => (
        <div>
          <p className="font-semibold">{row.colleges?.name}</p>
          <p className="text-sm text-muted-foreground">{row.colleges?.state}</p>
        </div>
      ),
    },
    {
      key: 'placement_rate',
      label: 'Placement Rate',
      render: (row: any) => `${row.placement_rate}%`,
    },
    {
      key: 'students_placed',
      label: 'Students Placed',
      render: (row: any) => row.students_placed,
    },
    {
      key: 'highest_package',
      label: 'Highest Package',
      render: (row: any) => `₹${row.highest_package}L`,
    },
    {
      key: 'companies_visited',
      label: 'Companies',
      render: (row: any) => row.companies_visited,
    },
  ];

  return (
    <DashboardLayout title="NTO Dashboard" sidebar={<NTOSidebar />}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">National Training Officer</h1>
          <p className="text-muted-foreground">National-level analytics and rankings</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active States"
            value={stats.totalStates}
            icon={MapPin}
            loading={loading}
          />
          <StatsCard
            title="Total Colleges"
            value={stats.totalColleges}
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
            title="National Placement Rate"
            value={`${stats.nationalPlacementRate}%`}
            icon={TrendingUp}
            loading={loading}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Placement Trends</CardTitle>
            <CardDescription>Monthly placement and application statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="placements" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="applications" stroke="hsl(var(--secondary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top College Rankings</CardTitle>
            <CardDescription>National college rankings based on placement performance</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={rankingColumns} data={rankings} searchable searchPlaceholder="Search colleges..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
