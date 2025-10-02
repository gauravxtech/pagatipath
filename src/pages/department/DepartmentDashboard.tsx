import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  LogOut, 
  Users,
  TrendingUp,
  Award,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const DepartmentDashboard = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [departmentData, setDepartmentData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    avgScore: 0,
    completedProfiles: 0
  });

  useEffect(() => {
    fetchDepartmentData();
  }, [user]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      
      // Fetch department - simplified, you might need to adjust based on your auth setup
      const { data: dept, error: deptError } = await supabase
        .from('departments')
        .select('*, colleges(name)')
        .limit(1)
        .single();

      if (deptError) throw deptError;
      setDepartmentData(dept);

      // Fetch students in department
      const { data: studs, error: studsError } = await supabase
        .from('students')
        .select('*')
        .eq('department_id', dept.id)
        .order('employability_score', { ascending: false });

      if (!studsError) {
        setStudents(studs || []);
        const avgScore = studs && studs.length > 0
          ? Math.round(studs.reduce((acc, s) => acc + (s.employability_score || 0), 0) / studs.length)
          : 0;
        
        setStats({
          totalStudents: studs?.length || 0,
          placedStudents: studs?.filter(s => s.placed).length || 0,
          avgScore,
          completedProfiles: studs?.filter(s => s.profile_completed).length || 0
        });
      }

      // Fetch applications from department students
      if (studs && studs.length > 0) {
        const studentIds = studs.map(s => s.id);
        const { data: apps, error: appsError } = await supabase
          .from('applications')
          .select('*, opportunities(title, type), students(full_name)')
          .in('student_id', studentIds);

        if (!appsError) setApplications(apps || []);
      }

      // Fetch relevant opportunities
      const { data: opps, error: oppsError } = await supabase
        .from('opportunities')
        .select('*, recruiters(company_name)')
        .eq('active', true)
        .eq('department', dept.name)
        .order('created_at', { ascending: false });

      if (!oppsError) setOpportunities(opps || []);

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
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
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
          <h1 className="text-3xl font-bold mb-1">{departmentData?.name}</h1>
          <p className="text-muted-foreground mb-2">
            {departmentData?.colleges?.name} • Code: {departmentData?.code}
          </p>
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
              <p className="text-xs text-muted-foreground">In department</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{placementRate}%</div>
              <Progress value={parseFloat(placementRate)} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore}/100</div>
              <p className="text-xs text-muted-foreground">Employability score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">Total submitted</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            {students.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{student.full_name}</CardTitle>
                      <CardDescription>{student.abc_id} • {student.email}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{student.employability_score}</div>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={student.profile_completed ? 'default' : 'secondary'}>
                      {student.profile_completed ? 'Profile Complete' : 'Profile Incomplete'}
                    </Badge>
                    {student.placed && <Badge className="bg-green-500">Placed</Badge>}
                    {student.skills && student.skills.length > 0 && (
                      <Badge variant="outline">{student.skills.length} Skills</Badge>
                    )}
                  </div>
                  {student.skills && student.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {student.skills.slice(0, 5).map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{skill}</Badge>
                        ))}
                        {student.skills.length > 5 && (
                          <Badge variant="outline">+{student.skills.length - 5} more</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No applications yet from department students.</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{app.students.full_name}</CardTitle>
                        <CardDescription>Applied for: {app.opportunities.title}</CardDescription>
                      </div>
                      <Badge>{app.status.replace('_', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="mt-2">{app.opportunities.type}</Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-4">
            {opportunities.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No opportunities available for this department yet.</p>
                </CardContent>
              </Card>
            ) : (
              opportunities.map((opp) => (
                <Card key={opp.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{opp.title}</CardTitle>
                        <CardDescription>{opp.recruiters.company_name}</CardDescription>
                      </div>
                      <Badge variant={opp.type === 'job' ? 'default' : 'secondary'}>
                        {opp.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{opp.description}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {opp.location && <span>📍 {opp.location}</span>}
                      {opp.stipend_min && opp.stipend_max && (
                        <span>💰 ₹{opp.stipend_min} - ₹{opp.stipend_max}</span>
                      )}
                      {opp.positions_available && (
                        <span>👥 {opp.positions_available} positions</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Analytics</CardTitle>
                <CardDescription>Performance and placement statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Students:</span>
                    <span className="font-medium">{stats.totalStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Placed:</span>
                    <span className="font-medium text-green-600">{stats.placedStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unplaced:</span>
                    <span className="font-medium text-orange-600">
                      {stats.totalStudents - stats.placedStudents}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Placement Rate:</span>
                    <span className="font-medium">{placementRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Employability Score:</span>
                    <span className="font-medium">{stats.avgScore}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Complete Profiles:</span>
                    <span className="font-medium">
                      {stats.completedProfiles}/{stats.totalStudents}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
                <CardDescription>Student application activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Applications:</span>
                    <span className="font-medium">{applications.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Applications:</span>
                    <span className="font-medium">
                      {applications.filter(a => ['under_review', 'interview_scheduled', 'interviewed'].includes(a.status)).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Offers Received:</span>
                    <span className="font-medium text-green-600">
                      {applications.filter(a => a.status === 'offered').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accepted Offers:</span>
                    <span className="font-medium text-green-600">
                      {applications.filter(a => a.status === 'accepted').length}
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

export default DepartmentDashboard;
