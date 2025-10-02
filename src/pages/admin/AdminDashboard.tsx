import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Users,
  Building2,
  Briefcase,
  Award,
  TrendingUp,
  Shield,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalColleges: 0,
    totalRecruiters: 0,
    totalOpportunities: 0,
    pendingApprovals: 0,
  });
  const [colleges, setColleges] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Get counts
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      const { count: collegesCount } = await supabase
        .from('colleges')
        .select('*', { count: 'exact', head: true });

      const { count: recruitersCount } = await supabase
        .from('recruiters')
        .select('*', { count: 'exact', head: true });

      const { count: opportunitiesCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true });

      const { count: pendingCount } = await supabase
        .from('colleges')
        .select('*', { count: 'exact', head: true })
        .eq('approved', false);

      setStats({
        totalStudents: studentsCount || 0,
        totalColleges: collegesCount || 0,
        totalRecruiters: recruitersCount || 0,
        totalOpportunities: opportunitiesCount || 0,
        pendingApprovals: pendingCount || 0,
      });

      // Get colleges for approval
      const { data: collegesData } = await supabase
        .from('colleges')
        .select('*')
        .order('created_at', { ascending: false });

      setColleges(collegesData || []);

      // Get recruiters for verification
      const { data: recruitersData } = await supabase
        .from('recruiters')
        .select('*')
        .order('created_at', { ascending: false });

      setRecruiters(recruitersData || []);

      // Get audit logs
      const { data: logsData } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      setAuditLogs(logsData || []);
    } catch (error: any) {
      toast.error('Failed to load admin data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveCollege = async (id: string) => {
    try {
      const { error } = await supabase
        .from('colleges')
        .update({ approved: true })
        .eq('id', id);

      if (error) throw error;
      toast.success('College approved successfully');
      loadAdminData();
    } catch (error: any) {
      toast.error('Failed to approve college');
    }
  };

  const rejectCollege = async (id: string) => {
    try {
      const { error } = await supabase.from('colleges').delete().eq('id', id);

      if (error) throw error;
      toast.success('College rejected');
      loadAdminData();
    } catch (error: any) {
      toast.error('Failed to reject college');
    }
  };

  const verifyRecruiter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recruiters')
        .update({ verified: true })
        .eq('id', id);

      if (error) throw error;
      toast.success('Recruiter verified successfully');
      loadAdminData();
    } catch (error: any) {
      toast.error('Failed to verify recruiter');
    }
  };

  const collegeColumns = [
    {
      key: 'name',
      label: 'College Name',
      render: (college: any) => college.name,
    },
    {
      key: 'code',
      label: 'Code',
      render: (college: any) => college.code,
    },
    {
      key: 'location',
      label: 'Location',
      render: (college: any) => `${college.district}, ${college.state}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (college: any) => (
        <Badge variant={college.approved ? 'default' : 'secondary'}>
          {college.approved ? 'Approved' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (college: any) =>
        !college.approved && (
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={() => approveCollege(college.id)}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={() => rejectCollege(college.id)}>
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        ),
    },
  ];

  const recruiterColumns = [
    {
      key: 'company',
      label: 'Company',
      render: (recruiter: any) => recruiter.company_name,
    },
    {
      key: 'contact',
      label: 'Contact Person',
      render: (recruiter: any) => recruiter.contact_person,
    },
    {
      key: 'email',
      label: 'Email',
      render: (recruiter: any) => recruiter.email,
    },
    {
      key: 'status',
      label: 'Status',
      render: (recruiter: any) => (
        <Badge variant={recruiter.verified ? 'default' : 'secondary'}>
          {recruiter.verified ? 'Verified' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (recruiter: any) =>
        !recruiter.verified && (
          <Button size="sm" onClick={() => verifyRecruiter(recruiter.id)}>
            <Shield className="h-4 w-4 mr-1" />
            Verify
          </Button>
        ),
    },
  ];

  return (
    <DashboardLayout sidebar={<div />} title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
              <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalColleges}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recruiters</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRecruiters}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOpportunities}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="colleges" className="space-y-4">
          <TabsList>
            <TabsTrigger value="colleges">Colleges</TabsTrigger>
            <TabsTrigger value="recruiters">Recruiters</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="colleges">
            <Card>
              <CardHeader>
                <CardTitle>College Approvals</CardTitle>
                <CardDescription>Approve or reject college registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={colleges}
                  columns={collegeColumns}
                  searchable
                  searchPlaceholder="Search colleges..."
                  pageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recruiters">
            <Card>
              <CardHeader>
                <CardTitle>Recruiter Verification</CardTitle>
                <CardDescription>Verify recruiter accounts and KYC documents</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={recruiters}
                  columns={recruiterColumns}
                  searchable
                  searchPlaceholder="Search recruiters..."
                  pageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>System Audit Logs</CardTitle>
                <CardDescription>Track all system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.entity_type} • {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
