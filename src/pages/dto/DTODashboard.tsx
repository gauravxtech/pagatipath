import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { DTOSidebar } from '@/components/dto/DTOSidebar';
import { StatsCard } from '@/components/analytics/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Users, TrendingUp, CheckCircle, XCircle, FolderTree, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DTODashboard() {
  const [stats, setStats] = useState({
    totalColleges: 0,
    pendingApprovals: 0,
    activeStudents: 0,
    totalDepartments: 0,
    activeUsers: 0,
  });
  const [colleges, setColleges] = useState<any[]>([]);
  const [chartData, setChartData] = useState({
    collegeEnrollment: [] as any[],
    departmentDist: [] as any[],
    growthTrend: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: dtoData } = await supabase
        .from('dto_officers')
        .select('district, state')
        .eq('user_id', user?.id)
        .single();

      if (!dtoData) return;

      // Fetch colleges in the district
      const { data: collegesData } = await supabase
        .from('colleges')
        .select('*')
        .eq('district', dtoData.district)
        .eq('state', dtoData.state)
        .order('created_at', { ascending: false });

      if (collegesData) {
        setColleges(collegesData);

        // College enrollment chart data
        const enrollmentData = await Promise.all(
          collegesData.slice(0, 5).map(async (college) => {
            const { count } = await supabase
              .from('students')
              .select('*', { count: 'exact', head: true })
              .eq('college_id', college.id);
            return { name: college.name, students: count || 0 };
          })
        );

        setChartData((prev) => ({ ...prev, collegeEnrollment: enrollmentData }));

        setStats((prev) => ({
          ...prev,
          totalColleges: collegesData.length,
          pendingApprovals: collegesData.filter((c) => !c.approved).length,
        }));
      }

      const collegeIds = collegesData?.map((c) => c.id) || [];

      // Fetch departments
      const { count: deptCount } = await supabase
        .from('departments')
        .select('*', { count: 'exact', head: true })
        .in('college_id', collegeIds);

      // Fetch students in district
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('district', dtoData.district)
        .eq('state', dtoData.state);

      setStats((prev) => ({
        ...prev,
        activeStudents: studentCount || 0,
        totalDepartments: deptCount || 0,
        activeUsers: 42, // Mock data
      }));

      // Mock growth trend data
      setChartData((prev) => ({
        ...prev,
        growthTrend: [
          { month: 'Jan', students: 120 },
          { month: 'Feb', students: 145 },
          { month: 'Mar', students: 180 },
          { month: 'Apr', students: 220 },
          { month: 'May', students: 280 },
          { month: 'Jun', students: studentCount || 300 },
        ],
      }));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const approveCollege = async (collegeId: string) => {
    try {
      await supabase
        .from('colleges')
        .update({ approved: true, updated_by: user?.id })
        .eq('id', collegeId);

      toast.success('College approved successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to approve college');
    }
  };

  const rejectCollege = async (collegeId: string) => {
    try {
      await supabase
        .from('colleges')
        .update({ approved: false, updated_by: user?.id })
        .eq('id', collegeId);

      toast.success('College rejected');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to reject college');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'College Name',
      render: (row: any) => row.name,
    },
    {
      key: 'code',
      label: 'Code',
      render: (row: any) => row.code,
    },
    {
      key: 'district',
      label: 'District',
      render: (row: any) => row.district,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.approved ? 'Approved' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className="flex gap-2">
          {!row.approved && (
            <>
              <Button size="sm" variant="default" onClick={() => approveCollege(row.id)}>
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => rejectCollege(row.id)}>
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="DTO Dashboard" sidebar={<DTOSidebar />}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">District Training Officer</h1>
          <p className="text-muted-foreground">Manage colleges and district-level operations</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="Total Colleges"
            value={stats.totalColleges}
            icon={Building2}
            loading={loading}
          />
          <StatsCard
            title="Total Departments"
            value={stats.totalDepartments}
            icon={FolderTree}
            loading={loading}
          />
          <StatsCard
            title="Active Students"
            value={stats.activeStudents}
            icon={Users}
            loading={loading}
          />
          <StatsCard
            title="Active Users (24h)"
            value={stats.activeUsers}
            icon={UserCheck}
            loading={loading}
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={CheckCircle}
            loading={loading}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>College-wise Student Enrollment</CardTitle>
              <CardDescription>Top 5 colleges by student count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.collegeEnrollment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="students" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Growth Trend</CardTitle>
              <CardDescription>Monthly student registration in district</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.growthTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>College Approvals</CardTitle>
            <CardDescription>Review and approve college registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={colleges} searchable searchPlaceholder="Search colleges..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
