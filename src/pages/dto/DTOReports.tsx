import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { DTOSidebar } from '@/components/dto/DTOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Download, TrendingUp, Users, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DTOReports() {
  const [stats, setStats] = useState({
    totalColleges: 0,
    totalStudents: 0,
    totalDepartments: 0,
    activeUsers: 0,
  });
  const [collegeData, setCollegeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const { data: dtoData } = await supabase
        .from('dto_officers')
        .select('district, state')
        .eq('user_id', user?.id)
        .single();

      if (!dtoData) return;

      // Fetch colleges
      const { data: colleges } = await supabase
        .from('colleges')
        .select('id, name')
        .eq('district', dtoData.district)
        .eq('state', dtoData.state);

      const collegeIds = colleges?.map((c) => c.id) || [];

      // Fetch students per college
      const collegeStats = await Promise.all(
        (colleges || []).map(async (college) => {
          const { count } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('college_id', college.id);

          return {
            name: college.name,
            students: count || 0,
          };
        })
      );

      setCollegeData(collegeStats);

      // Get total stats
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('district', dtoData.district)
        .eq('state', dtoData.state);

      const { count: deptCount } = await supabase
        .from('departments')
        .select('*', { count: 'exact', head: true })
        .in('college_id', collegeIds);

      setStats({
        totalColleges: colleges?.length || 0,
        totalStudents: studentCount || 0,
        totalDepartments: deptCount || 0,
        activeUsers: 0,
      });
    } catch (error) {
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const downloadCollegeReport = () => {
    const csv = [
      ['College Name', 'Total Students'].join(','),
      ...collegeData.map((c) => [c.name, c.students].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'college_enrollment_report.csv';
    a.click();
    toast.success('Report downloaded successfully');
  };

  return (
    <DashboardLayout title="DTO Reports" sidebar={<DTOSidebar />}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">District Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download district-level reports</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalColleges}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDepartments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>College-wise Student Enrollment</CardTitle>
              <CardDescription>Number of students per college</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={collegeData}>
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
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Departments across colleges</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={collegeData}
                    dataKey="students"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {collegeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <CardTitle>Downloadable Reports</CardTitle>
            <CardDescription>Generate and download district-level reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">College-wise Student Enrollment Report</h3>
                <p className="text-sm text-muted-foreground">Complete enrollment data by college</p>
              </div>
              <Button onClick={downloadCollegeReport}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
