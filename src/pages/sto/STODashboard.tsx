import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { STOSidebar } from '@/components/sto/STOSidebar';
import { StatsCard } from '@/components/analytics/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function STODashboard() {
  const [stats, setStats] = useState({
    totalColleges: 0,
    totalStudents: 0,
    placementRate: 0,
    totalOpportunities: 0,
  });
  const [domainData, setDomainData] = useState<any[]>([]);
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
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

      const { count: opportunityCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('active', true);

      setStats({
        totalColleges: collegeCount || 0,
        totalStudents: studentCount || 0,
        placementRate: studentCount ? Math.round(((placedCount || 0) / studentCount) * 100) : 0,
        totalOpportunities: opportunityCount || 0,
      });

      // Fetch domain distribution
      const { data: students } = await supabase
        .from('students')
        .select('domains_interested');

      const domainCounts: Record<string, number> = {};
      students?.forEach((student) => {
        student.domains_interested?.forEach((domain: string) => {
          domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        });
      });

      const topDomains = Object.entries(domainCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

      setDomainData(topDomains);

      // Fetch district distribution
      const { data: colleges } = await supabase
        .from('colleges')
        .select('district')
        .eq('approved', true);

      const districtCounts: Record<string, number> = {};
      colleges?.forEach((college) => {
        if (college.district) {
          districtCounts[college.district] = (districtCounts[college.district] || 0) + 1;
        }
      });

      const districtChartData = Object.entries(districtCounts).map(([district, count]) => ({
        district,
        count,
      }));

      setDistrictData(districtChartData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="STO Dashboard" sidebar={<STOSidebar />}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">State Training Officer</h1>
          <p className="text-muted-foreground">State-level analytics and insights</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            title="Placement Rate"
            value={`${stats.placementRate}%`}
            icon={TrendingUp}
            loading={loading}
          />
          <StatsCard
            title="Active Opportunities"
            value={stats.totalOpportunities}
            icon={Award}
            loading={loading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>District-wise Colleges</CardTitle>
              <CardDescription>Distribution of colleges across districts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Domains</CardTitle>
              <CardDescription>Most popular career domains among students</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={domainData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {domainData.map((entry, index) => (
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
