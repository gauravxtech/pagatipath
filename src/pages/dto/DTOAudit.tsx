import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { DTOSidebar } from '@/components/dto/DTOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/shared/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DTOAudit() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const { data: dtoData } = await supabase
        .from('dto_officers')
        .select('district, state')
        .eq('user_id', user?.id)
        .single();

      if (!dtoData) return;

      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .or(`entity_type.eq.college,entity_type.eq.department,entity_type.eq.student`)
        .order('created_at', { ascending: false })
        .limit(100);

      setLogs(auditLogs || []);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const csv = [
      ['Date', 'Action', 'Entity Type', 'User', 'IP Address'].join(','),
      ...logs.map((log) =>
        [
          new Date(log.created_at).toLocaleString(),
          log.action,
          log.entity_type,
          log.user_id,
          log.ip_address || 'N/A',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs.csv';
    a.click();
    toast.success('Logs exported successfully');
  };

  const columns = [
    {
      key: 'created_at',
      label: 'Date & Time',
      render: (row: any) => new Date(row.created_at).toLocaleString(),
    },
    {
      key: 'action',
      label: 'Action',
      render: (row: any) => (
        <span className="font-medium">{row.action}</span>
      ),
    },
    {
      key: 'entity_type',
      label: 'Entity Type',
      render: (row: any) => (
        <span className="capitalize">{row.entity_type}</span>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      render: (row: any) => (
        <span className="text-sm text-muted-foreground">
          {JSON.stringify(row.details).substring(0, 50)}...
        </span>
      ),
    },
    {
      key: 'ip_address',
      label: 'IP Address',
      render: (row: any) => row.ip_address || 'N/A',
    },
  ];

  return (
    <DashboardLayout title="DTO Audit Logs" sidebar={<DTOSidebar />}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Audit Logs & Monitoring</h1>
            <p className="text-muted-foreground">Track district-level activities and changes</p>
          </div>
          <Button onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Activity Logs
            </CardTitle>
            <CardDescription>
              College registrations, department changes, and student activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={logs}
              searchable
              searchPlaceholder="Search logs..."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
