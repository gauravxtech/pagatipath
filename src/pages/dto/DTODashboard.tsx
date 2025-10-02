import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { DTOSidebar } from '@/components/dto/DTOSidebar';
import { StatsCard } from '@/components/analytics/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function DTODashboard() {
  const [stats, setStats] = useState({
    totalColleges: 0,
    pendingApprovals: 0,
    activeStudents: 0,
    placementRate: 0,
  });
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch colleges
      const { data: collegesData } = await supabase
        .from('colleges')
        .select('*')
        .order('created_at', { ascending: false });

      if (collegesData) {
        setColleges(collegesData);
        setStats((prev) => ({
          ...prev,
          totalColleges: collegesData.length,
          pendingApprovals: collegesData.filter((c) => !c.approved).length,
        }));
      }

      // Fetch student stats
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      const { count: placedCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('placed', true);

      setStats((prev) => ({
        ...prev,
        activeStudents: studentCount || 0,
        placementRate: studentCount ? Math.round(((placedCount || 0) / studentCount) * 100) : 0,
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Colleges"
            value={stats.totalColleges}
            icon={Building2}
            loading={loading}
          />
          <StatsCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={CheckCircle}
            description="Colleges awaiting approval"
            loading={loading}
          />
          <StatsCard
            title="Active Students"
            value={stats.activeStudents}
            icon={Users}
            loading={loading}
          />
          <StatsCard
            title="Placement Rate"
            value={`${stats.placementRate}%`}
            icon={TrendingUp}
            loading={loading}
          />
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
