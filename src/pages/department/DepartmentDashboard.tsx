import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users,
  TrendingUp,
  Award,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { DepartmentSidebar } from '@/components/department/DepartmentSidebar';
import { StatsCard } from '@/components/analytics/StatsCard';

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

  return (
    <DashboardLayout
      sidebar={<DepartmentSidebar />}
      title={departmentData?.name || "Department Dashboard"}
      subtitle={`${departmentData?.colleges?.name || ""} • Code: ${departmentData?.code || ""}`}
    >
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          description="In department"
          icon={Users}
          loading={loading}
        />
        <StatsCard
          title="Placement Rate"
          value={`${placementRate}%`}
          description="Students placed"
          icon={TrendingUp}
          loading={loading}
        />
        <StatsCard
          title="Avg Score"
          value={`${stats.avgScore}/100`}
          description="Employability score"
          icon={Award}
          loading={loading}
        />
        <StatsCard
          title="Applications"
          value={applications.length}
          description="Total submitted"
          icon={Briefcase}
          loading={loading}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.full_name}</CardTitle>
                    <CardDescription>{student.abc_id} • {student.email}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{student.employability_score}</div>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={student.profile_completed ? 'default' : 'secondary'}>
                    {student.profile_completed ? 'Profile Complete' : 'Profile Incomplete'}
                  </Badge>
                  {student.placed && <Badge className="bg-green-600 hover:bg-green-700">Placed</Badge>}
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
              <CardContent className="pt-6 pb-6 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No applications yet from department students.</p>
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{app.students.full_name}</CardTitle>
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
              <CardContent className="pt-6 pb-6 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No opportunities available for this department yet.</p>
              </CardContent>
            </Card>
          ) : (
            opportunities.map((opp) => (
              <Card key={opp.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{opp.title}</CardTitle>
                      <CardDescription>{opp.recruiters.company_name}</CardDescription>
                    </div>
                    <Badge variant={opp.type === 'job' ? 'default' : 'secondary'}>
                      {opp.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3 text-muted-foreground">{opp.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Analytics</CardTitle>
                <CardDescription>Performance and placement statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="text-muted-foreground">Total Students:</span>
                    <span className="font-semibold">{stats.totalStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="text-muted-foreground">Placed:</span>
                    <span className="font-semibold text-green-600">{stats.placedStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="text-muted-foreground">Unplaced:</span>
                    <span className="font-semibold text-orange-600">
                      {stats.totalStudents - stats.placedStudents}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="text-muted-foreground">Placement Rate:</span>
                    <span className="font-semibold">{placementRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="text-muted-foreground">Avg Employability Score:</span>
                    <span className="font-semibold">{stats.avgScore}/100</span>
                  </div>
                  <div className="flex justify-between text-sm py-2">
                    <span className="text-muted-foreground">Complete Profiles:</span>
                    <span className="font-semibold">
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
                <div className="space-y-3">
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="text-muted-foreground">Total Applications:</span>
                    <span className="font-semibold">{applications.length}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="text-muted-foreground">Active Applications:</span>
                    <span className="font-semibold">
                      {applications.filter(a => ['under_review', 'interview_scheduled', 'interviewed'].includes(a.status)).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="text-muted-foreground">Offers Received:</span>
                    <span className="font-semibold text-green-600">
                      {applications.filter(a => a.status === 'offered').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-2">
                    <span className="text-muted-foreground">Accepted Offers:</span>
                    <span className="font-semibold text-green-600">
                      {applications.filter(a => a.status === 'accepted').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default DepartmentDashboard;
