import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { DTOSidebar } from '@/components/dto/DTOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/shared/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FolderTree } from 'lucide-react';
import { toast } from 'sonner';

export default function DTODepartments() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data: dtoData } = await supabase
        .from('dto_officers')
        .select('district, state')
        .eq('user_id', user?.id)
        .single();

      if (!dtoData) return;

      const { data: collegesData } = await supabase
        .from('colleges')
        .select('id')
        .eq('district', dtoData.district)
        .eq('state', dtoData.state);

      const collegeIds = collegesData?.map((c) => c.id) || [];

      const { data: depts } = await supabase
        .from('departments')
        .select(`
          *,
          colleges:college_id (
            name,
            code
          ),
          department_coordinators:coordinator_id (
            coordinator_name,
            email
          )
        `)
        .in('college_id', collegeIds)
        .order('created_at', { ascending: false });

      setDepartments(depts || []);
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'college',
      label: 'College',
      render: (row: any) => row.colleges?.name || 'N/A',
    },
    {
      key: 'name',
      label: 'Department Name',
      render: (row: any) => row.name,
    },
    {
      key: 'code',
      label: 'Code',
      render: (row: any) => row.code,
    },
    {
      key: 'coordinator',
      label: 'Coordinator',
      render: (row: any) => row.department_coordinators?.coordinator_name || 'Not Assigned',
    },
    {
      key: 'email',
      label: 'Email',
      render: (row: any) => row.department_coordinators?.email || 'N/A',
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
          {row.approved ? 'Active' : 'Pending'}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout title="DTO Departments" sidebar={<DTOSidebar />}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Department Oversight</h1>
          <p className="text-muted-foreground">Manage departments across colleges in your district</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="h-5 w-5" />
              Department Directory
            </CardTitle>
            <CardDescription>Departments grouped by colleges</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={departments}
              searchable
              searchPlaceholder="Search departments..."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
