import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { STOSidebar } from '@/components/sto/STOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function STOAnalytics() {
  const [loading, setLoading] = useState(false);
  const [stoState, setStoState] = useState('');
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [domainData, setDomainData] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);

  useEffect(() => {
    fetchSTOProfile();
  }, []);

  useEffect(() => {
    if (stoState) {
      fetchAnalytics();
    }
  }, [stoState]);

  const fetchSTOProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('sto_officers')
        .select('state')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setStoState(data.state);
    } catch (error) {
      toast.error('Failed to fetch profile');
      console.error(error);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch district-wise college distribution
      const { data: colleges } = await supabase
        .from('colleges')
        .select('district')
        .eq('state', stoState)
        .eq('approved', true);

      const districtCounts: Record<string, number> = {};
      colleges?.forEach((college) => {
        if (college.district) {
          districtCounts[college.district] = (districtCounts[college.district] || 0) + 1;
        }
      });

      const districtChartData = Object.entries(districtCounts)
        .map(([district, count]) => ({ district, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setDistrictData(districtChartData);

      // Fetch domain distribution
      const { data: students } = await supabase
        .from('students')
        .select('domains_interested')
        .eq('state', stoState);

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

      // Mock monthly trend data (in production, fetch actual data)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const trendData = months.map(month => ({
        month,
        students: Math.floor(Math.random() * 1000) + 500
      }));
      setMonthlyTrend(trendData);

    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Analytics" sidebar={<STOSidebar />}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">State Analytics</h1>
          <p className="text-muted-foreground">Detailed insights for {stoState}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Districts by Colleges</CardTitle>
              <CardDescription>College distribution across districts</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Interest Domains</CardTitle>
              <CardDescription>Most popular career domains</CardDescription>
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

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Student Enrollment Trend</CardTitle>
              <CardDescription>Monthly student registration growth</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
