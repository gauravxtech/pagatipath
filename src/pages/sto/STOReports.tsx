import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { STOSidebar } from '@/components/sto/STOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, TrendingUp, Users, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function STOReports() {
  const [loading, setLoading] = useState(false);
  const [stoState, setStoState] = useState('');
  const [stats, setStats] = useState({
    totalDistricts: 0,
    totalDTOs: 0,
    totalColleges: 0,
    totalStudents: 0,
  });

  useEffect(() => {
    fetchSTOProfile();
  }, []);

  useEffect(() => {
    if (stoState) {
      fetchStats();
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

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [dtos, colleges, students] = await Promise.all([
        supabase.from('dto_officers').select('district', { count: 'exact' }).eq('state', stoState),
        supabase.from('colleges').select('id', { count: 'exact' }).eq('state', stoState),
        supabase.from('students').select('id', { count: 'exact' }).eq('state', stoState),
      ]);

      // Count unique districts
      const uniqueDistricts = new Set(dtos.data?.map(d => d.district));

      setStats({
        totalDistricts: uniqueDistricts.size,
        totalDTOs: dtos.count || 0,
        totalColleges: colleges.count || 0,
        totalStudents: students.count || 0,
      });
    } catch (error) {
      toast.error('Failed to fetch statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (reportType: string) => {
    toast.success(`Downloading ${reportType} report...`);
  };

  return (
    <DashboardLayout title="Reports & Analytics" sidebar={<STOSidebar />}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">State Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive reports for {stoState}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Districts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDistricts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                DTOs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDTOs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Colleges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalColleges}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Download comprehensive state reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => downloadReport('District-wise Student Enrollment')}
              >
                <FileText className="mr-2 h-4 w-4" />
                District-wise Student Enrollment Report
                <Download className="ml-auto h-4 w-4" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => downloadReport('DTO Performance')}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                DTO Performance Report
                <Download className="ml-auto h-4 w-4" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => downloadReport('College Summary')}
              >
                <Building2 className="mr-2 h-4 w-4" />
                College Summary Report (by District)
                <Download className="ml-auto h-4 w-4" />
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => downloadReport('Student Placement')}
              >
                <Users className="mr-2 h-4 w-4" />
                Student Placement Report
                <Download className="ml-auto h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Insights</CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Students per College</span>
                <span className="text-2xl font-bold">
                  {stats.totalColleges > 0 
                    ? Math.round(stats.totalStudents / stats.totalColleges)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Colleges per District</span>
                <span className="text-2xl font-bold">
                  {stats.totalDistricts > 0 
                    ? Math.round(stats.totalColleges / stats.totalDistricts)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">DTOs Coverage</span>
                <span className="text-2xl font-bold">
                  {stats.totalDistricts > 0 
                    ? Math.round((stats.totalDTOs / stats.totalDistricts) * 100)
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
