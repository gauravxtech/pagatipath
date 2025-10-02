import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { DTOSidebar } from '@/components/dto/DTOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Search, Download, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DTOColleges() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    filterColleges();
  }, [searchQuery, statusFilter, colleges]);

  const fetchColleges = async () => {
    try {
      const { data: dtoData } = await supabase
        .from('dto_officers')
        .select('district, state')
        .eq('user_id', user?.id)
        .single();

      if (!dtoData) return;

      const { data: collegesData } = await supabase
        .from('colleges')
        .select('*')
        .eq('district', dtoData.district)
        .eq('state', dtoData.state)
        .order('created_at', { ascending: false });

      setColleges(collegesData || []);
    } catch (error) {
      toast.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const filterColleges = () => {
    let filtered = [...colleges];

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) =>
        statusFilter === 'active' ? c.approved : !c.approved
      );
    }

    setFilteredColleges(filtered);
  };

  const toggleCollegeStatus = async (collegeId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('colleges')
        .update({ approved: !currentStatus, updated_by: user?.id })
        .eq('id', collegeId);

      toast.success(`College ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      fetchColleges();
    } catch (error) {
      toast.error('Failed to update college status');
    }
  };

  const exportData = () => {
    const csv = [
      ['College Name', 'Code', 'District', 'Status', 'Email', 'Phone'].join(','),
      ...filteredColleges.map((c) =>
        [c.name, c.code, c.district, c.approved ? 'Active' : 'Pending', c.email, c.phone].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'colleges_report.csv';
    a.click();
  };

  const columns = [
    {
      key: 'name',
      label: 'College Name',
      render: (row: any) => row.name,
    },
    {
      key: 'code',
      label: 'Registration No.',
      render: (row: any) => row.code,
    },
    {
      key: 'email',
      label: 'Email',
      render: (row: any) => row.email,
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row: any) => row.phone,
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
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={row.approved ? 'destructive' : 'default'}
            onClick={() => toggleCollegeStatus(row.id, row.approved)}
          >
            {row.approved ? (
              <>
                <XCircle className="h-4 w-4 mr-1" />
                Disable
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                Enable
              </>
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="DTO Colleges" sidebar={<DTOSidebar />}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">College Management</h1>
            <p className="text-muted-foreground">Manage colleges in your district</p>
          </div>
          <Button onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>College Directory</CardTitle>
            <CardDescription>Search and filter colleges in your district</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or registration number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DataTable columns={columns} data={filteredColleges} searchable={false} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
