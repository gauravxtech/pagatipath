import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { STOSidebar } from '@/components/sto/STOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Download, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function STOStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [stoState, setStoState] = useState('');

  useEffect(() => {
    fetchSTOProfile();
  }, []);

  useEffect(() => {
    if (stoState) {
      fetchStudents();
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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('state', stoState)
        .order('full_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = students.filter(student => {
    const matchesSearch = 
      student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.abc_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.enrollment_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterDistrict === 'all' || student.district === filterDistrict;
    
    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      key: 'full_name',
      label: 'Name',
      render: (item: any) => (
        <div>
          <div className="font-medium">{item.full_name}</div>
          <div className="text-sm text-muted-foreground">{item.abc_id}</div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (item: any) => item.email
    },
    {
      key: 'enrollment_number',
      label: 'Enrollment',
      render: (item: any) => item.enrollment_number || 'N/A'
    },
    {
      key: 'district',
      label: 'District',
      render: (item: any) => <Badge variant="outline">{item.district || 'N/A'}</Badge>
    },
    {
      key: 'year_semester',
      label: 'Year/Sem',
      render: (item: any) => item.year_semester || 'N/A'
    },
    {
      key: 'profile_completed',
      label: 'Profile',
      render: (item: any) => item.profile_completed ? 
        <Badge className="bg-green-500">Complete</Badge> : 
        <Badge variant="secondary">Incomplete</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => (
        <Button size="sm" variant="outline">
          View Profile
        </Button>
      )
    }
  ];

  return (
    <DashboardLayout title="Students" sidebar={<STOSidebar />}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-muted-foreground">Students in {stoState}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchStudents} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Profile Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {students.filter(s => s.profile_completed).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Placed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {students.filter(s => s.placed).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students.length > 0 
                  ? Math.round(students.reduce((acc, s) => acc + (s.employability_score || 0), 0) / students.length)
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, ABC ID, or enrollment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterDistrict} onValueChange={setFilterDistrict}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription>
              {filteredData.length} students found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              data={filteredData} 
              columns={columns} 
              searchable={false}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
