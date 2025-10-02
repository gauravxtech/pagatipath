import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { DTOSidebar } from '@/components/dto/DTOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function DTOStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      const { data: dtoData } = await supabase
        .from('dto_officers')
        .select('district, state')
        .eq('user_id', user?.id)
        .single();

      if (!dtoData) return;

      const { data: studentsData } = await supabase
        .from('students')
        .select(`
          *,
          colleges:college_id (
            name,
            code
          )
        `)
        .eq('district', dtoData.district)
        .eq('state', dtoData.state)
        .order('created_at', { ascending: false });

      setStudents(studentsData || []);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchQuery) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(
      (s) =>
        s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.abc_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.enrollment_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredStudents(filtered);
  };

  const columns = [
    {
      key: 'name',
      label: 'Student Name',
      render: (row: any) => row.full_name,
    },
    {
      key: 'abc_id',
      label: 'ABC ID',
      render: (row: any) => row.abc_id,
    },
    {
      key: 'enrollment',
      label: 'Roll Number',
      render: (row: any) => row.enrollment_number,
    },
    {
      key: 'college',
      label: 'College',
      render: (row: any) => row.colleges?.name || 'N/A',
    },
    {
      key: 'email',
      label: 'Email',
      render: (row: any) => row.email,
    },
    {
      key: 'year',
      label: 'Year/Semester',
      render: (row: any) => row.year_semester || 'N/A',
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
    <DashboardLayout title="DTO Students" sidebar={<DTOSidebar />}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Management</h1>
          <p className="text-muted-foreground">Manage students in your district</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Directory
            </CardTitle>
            <CardDescription>Search and filter students by college, department, or year</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ABC ID, roll number, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <DataTable columns={columns} data={filteredStudents} searchable={false} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
