import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  LogOut, 
  Users,
  GraduationCap,
  Briefcase,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const CollegeDashboard = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [collegeData, setCollegeData] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    activeDepartments: 0,
    verifiedRecruiters: 0
  });

  useEffect(() => {
    fetchCollegeData();
  }, [user]);

  const fetchCollegeData = async () => {
    try {
      setLoading(true);
      
      // For college placement role, we need to find their college
      // This is a simplified approach - you might need to adjust based on your auth setup
      const { data: colleges, error: collegeError } = await supabase
        .from('colleges')
        .select('*')
        .limit(1)
        .single();

      if (collegeError) throw collegeError;
      setCollegeData(colleges);

      // Fetch departments
      const { data: depts, error: deptsError } = await supabase
        .from('departments')
        .select('*, students(count)')
        .eq('college_id', colleges.id);

      if (!deptsError) setDepartments(depts || []);

      // Fetch students
      const { data: studs, error: studsError } = await supabase
        .from('students')
        .select('*, departments(name)')
        .eq('college_id', colleges.id);

      if (!studsError) {
        setStudents(studs || []);
        setStats(prev => ({
          ...prev,
          totalStudents: studs?.length || 0,
          placedStudents: studs?.filter(s => s.placed).length || 0
        }));
      }

      // Fetch recruiters
      const { data: recs, error: recsError } = await supabase
        .from('recruiters')
        .select('*')
        .eq('verified', true);

      if (!recsError) {
        setRecruiters(recs || []);
        setStats(prev => ({
          ...prev,
          verifiedRecruiters: recs?.length || 0
        }));
      }

      setStats(prev => ({
        ...prev,
        activeDepartments: depts?.length || 0
      }));

    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const placementRate = stats.totalStudents > 0 
    ? ((stats.placedStudents / stats.totalStudents) * 100).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">PragatiPath</span>
          </Link>
          
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">{collegeData?.name}</h1>
          <p className="text-muted-foreground mb-2">
            {collegeData?.district}, {collegeData?.state} • {collegeData?.code}
          </p>
          <Badge variant={collegeData?.approved ? 'default' : 'secondary'}>
            {collegeData?.approved ? 'Approved' : 'Pending Approval'}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{placementRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.placedStudents} of {stats.totalStudents} placed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDepartments}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recruiters</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verifiedRecruiters}</div>
              <p className="text-xs text-muted-foreground">Verified companies</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="departments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="recruiters">Recruiters</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-4">
            {departments.map((dept) => (
              <Card key={dept.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{dept.name}</CardTitle>
                      <CardDescription>Code: {dept.code}</CardDescription>
                    </div>
                    <Badge variant="outline">
                      {students.filter(s => s.department_id === dept.id).length} Students
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Placed Students:</span>
                      <span className="font-medium">
                        {students.filter(s => s.department_id === dept.id && s.placed).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Employability Score:</span>
                      <span className="font-medium">
                        {students.filter(s => s.department_id === dept.id).length > 0
                          ? Math.round(
                              students
                                .filter(s => s.department_id === dept.id)
                                .reduce((acc, s) => acc + (s.employability_score || 0), 0) /
                                students.filter(s => s.department_id === dept.id).length
                            )
                          : 0}
                        /100
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            {students.slice(0, 20).map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{student.full_name}</CardTitle>
                      <CardDescription>
                        {student.abc_id} • {student.departments?.name}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{student.employability_score}</div>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge variant={student.profile_completed ? 'default' : 'secondary'}>
                      {student.profile_completed ? 'Profile Complete' : 'Profile Incomplete'}
                    </Badge>
                    {student.placed && <Badge className="bg-green-500">Placed</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Recruiters Tab */}
          <TabsContent value="recruiters" className="space-y-4">
            {recruiters.map((recruiter) => (
              <Card key={recruiter.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{recruiter.company_name}</CardTitle>
                      <CardDescription>
                        {recruiter.industry} • {recruiter.contact_person}
                      </CardDescription>
                    </div>
                    <Badge variant={recruiter.verified ? 'default' : 'secondary'}>
                      {recruiter.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Email: {recruiter.email}</p>
                    {recruiter.phone && (
                      <p className="text-muted-foreground">Phone: {recruiter.phone}</p>
                    )}
                    {recruiter.company_website && (
                      <a 
                        href={recruiter.company_website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {recruiter.company_website}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Placement Analytics</CardTitle>
                <CardDescription>Overview of placement statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Students:</span>
                    <span className="font-medium">{stats.totalStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Placed Students:</span>
                    <span className="font-medium text-green-600">{stats.placedStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unplaced Students:</span>
                    <span className="font-medium text-orange-600">
                      {stats.totalStudents - stats.placedStudents}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Placement Rate:</span>
                    <span className="font-medium">{placementRate}%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Department-wise Breakdown</h4>
                  {departments.map((dept) => {
                    const deptStudents = students.filter(s => s.department_id === dept.id);
                    const deptPlaced = deptStudents.filter(s => s.placed).length;
                    const deptRate = deptStudents.length > 0 
                      ? ((deptPlaced / deptStudents.length) * 100).toFixed(1)
                      : '0';
                    
                    return (
                      <div key={dept.id} className="flex justify-between text-sm py-2">
                        <span className="text-muted-foreground">{dept.name}:</span>
                        <span className="font-medium">
                          {deptPlaced}/{deptStudents.length} ({deptRate}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employability Insights</CardTitle>
                <CardDescription>Student skill and readiness metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Average Employability Score:</span>
                    <span className="font-medium">
                      {students.length > 0
                        ? Math.round(
                            students.reduce((acc, s) => acc + (s.employability_score || 0), 0) /
                              students.length
                          )
                        : 0}
                      /100
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Complete Profiles:</span>
                    <span className="font-medium">
                      {students.filter(s => s.profile_completed).length}/{stats.totalStudents}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Students with Resume:</span>
                    <span className="font-medium">
                      {students.filter(s => s.resume_url).length}/{stats.totalStudents}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CollegeDashboard;
