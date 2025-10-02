import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { FileText, Loader2 } from 'lucide-react';

export default function StudentApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    if (!user) return;

    try {
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!student) return;

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunities (
            title,
            type,
            recruiters (company_name)
          )
        `)
        .eq('student_id', student.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'secondary';
      case 'shortlisted':
        return 'default';
      case 'interview_scheduled':
        return 'default';
      case 'selected':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const columns = [
    {
      key: 'position',
      label: 'Position',
      sortable: true,
      render: (app: any) => (
        <div>
          <p className="font-medium">{app.opportunities?.title}</p>
          <p className="text-sm text-muted-foreground">
            {app.opportunities?.recruiters?.company_name}
          </p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (app: any) => (
        <Badge variant="outline">
          {app.opportunities?.type}
        </Badge>
      ),
    },
    {
      key: 'applied_at',
      label: 'Applied On',
      sortable: true,
      render: (app: any) => new Date(app.applied_at).toLocaleDateString(),
    },
    {
      key: 'status',
      label: 'Status',
      render: (app: any) => (
        <Badge variant={getStatusColor(app.status)}>
          {app.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'interview',
      label: 'Interview',
      render: (app: any) =>
        app.interview_scheduled_at ? (
          <span className="text-sm">
            {new Date(app.interview_scheduled_at).toLocaleString()}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Not scheduled</span>
        ),
    },
    {
      key: 'feedback',
      label: 'Feedback',
      render: (app: any) =>
        app.recruiter_feedback ? (
          <span className="text-sm">{app.recruiter_feedback}</span>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
  ];

  return (
    <DashboardLayout sidebar={<StudentSidebar />} title="My Applications">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application History
          </CardTitle>
          <CardDescription>
            Track your application status and feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              data={applications}
              columns={columns}
              searchable
              searchPlaceholder="Search applications..."
              pageSize={10}
            />
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
