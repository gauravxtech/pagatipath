import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  TrendingUp,
  Award,
  Briefcase,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { DepartmentSidebar } from '@/components/department/DepartmentSidebar';
import { StatsCard } from '@/components/analytics/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  // Chart data
  const skillsDistribution = [
    { name: 'Programming', value: 45, color: 'hsl(20 95% 55%)' },
    { name: 'Communication', value: 30, color: 'hsl(25 95% 60%)' },
    { name: 'Design', value: 15, color: 'hsl(220 45% 15%)' },
    { name: 'Other', value: 10, color: 'hsl(240 5% 65%)' },
  ];

  const applicationTrend = [
    { month: 'Jan', applications: 12 },
    { month: 'Feb', applications: 19 },
    { month: 'Mar', applications: 25 },
    { month: 'Apr', applications: 32 },
    { month: 'May', applications: 41 },
    { month: 'Jun', applications: applications.length },
  ];

  return (
    <DashboardLayout
      sidebar={<DepartmentSidebar />}
      title={departmentData?.name || "Department Dashboard"}
      subtitle={`${departmentData?.colleges?.name || ""} • Code: ${departmentData?.code || ""}`}
    >
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            description="In department"
            icon={Users}
            trend={{ value: 18, label: "from last month" }}
            loading={loading}
          />
          <StatsCard
            title="Placement Rate"
            value={`${placementRate}%`}
            description="Students placed"
            icon={TrendingUp}
            trend={{ value: 5, label: "from last month" }}
            loading={loading}
          />
          <StatsCard
            title="Avg Score"
            value={`${stats.avgScore}/100`}
            description="Employability score"
            icon={Award}
            trend={{ value: 3, label: "from last month" }}
            loading={loading}
          />
          <StatsCard
            title="Applications"
            value={applications.length}
            description="Total submitted"
            icon={Briefcase}
            trend={{ value: 12, label: "from last month" }}
            loading={loading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Application Trends</CardTitle>
              <CardDescription>Monthly application submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="applications" fill="hsl(20 95% 55%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Skills Distribution</CardTitle>
              <CardDescription>Student skills breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillsDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {skillsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-muted p-1 rounded-lg">
            <TabsTrigger value="students" className="data-[state=active]:bg-white dark:data-[state=active]:bg-card">Students</TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-white dark:data-[state=active]:bg-card">Applications</TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-white dark:data-[state=active]:bg-card">Opportunities</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-card">Analytics</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            {students.length === 0 ? (
              <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
                <CardContent className="pt-12 pb-12 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No students enrolled yet</p>
                </CardContent>
              </Card>
            ) : (
              students.map((student) => (
                <Card key={student.id} className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">{student.full_name}</CardTitle>
                          <CardDescription className="text-sm">{student.abc_id} • {student.email}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{student.employability_score}</div>
                        <p className="text-xs text-muted-foreground font-medium">Score</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant={student.profile_completed ? 'default' : 'secondary'} className="font-medium">
                        {student.profile_completed ? '✓ Profile Complete' : 'Profile Incomplete'}
                      </Badge>
                      {student.placed && (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white font-medium">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Placed
                        </Badge>
                      )}
                      {student.skills && student.skills.length > 0 && (
                        <Badge variant="outline" className="font-medium">{student.skills.length} Skills</Badge>
                      )}
                    </div>
                    {student.skills && student.skills.length > 0 && (
                      <div className="pt-3 border-t border-gray-100 dark:border-border">
                        <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-foreground">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {student.skills.slice(0, 5).map((skill: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="font-medium">{skill}</Badge>
                          ))}
                          {student.skills.length > 5 && (
                            <Badge variant="outline" className="font-medium">+{student.skills.length - 5} more</Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
                <CardContent className="pt-12 pb-12 text-center">
                  <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No applications yet from department students</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id} className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">{app.students.full_name}</CardTitle>
                          <CardDescription className="text-sm">Applied for: {app.opportunities.title}</CardDescription>
                        </div>
                      </div>
                      <Badge className="font-medium">{app.status.replace('_', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="font-medium">{app.opportunities.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-4">
            {opportunities.length === 0 ? (
              <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
                <CardContent className="pt-12 pb-12 text-center">
                  <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No opportunities available for this department yet</p>
                </CardContent>
              </Card>
            ) : (
              opportunities.map((opp) => (
                <Card key={opp.id} className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold">{opp.title}</CardTitle>
                          <CardDescription className="text-sm">{opp.recruiters.company_name}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={opp.type === 'job' ? 'default' : 'secondary'} className="font-medium">
                        {opp.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4 text-gray-600 dark:text-muted-foreground line-clamp-2">{opp.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {opp.location && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          📍 {opp.location}
                        </span>
                      )}
                      {opp.stipend_min && opp.stipend_max && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          💰 ₹{opp.stipend_min} - ₹{opp.stipend_max}
                        </span>
                      )}
                      {opp.positions_available && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          👥 {opp.positions_available} positions
                        </span>
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
              <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Department Analytics</CardTitle>
                  <CardDescription>Performance and placement statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex justify-between items-center text-sm py-3 border-b border-gray-100 dark:border-border">
                    <span className="text-muted-foreground font-medium">Total Students:</span>
                    <span className="font-bold text-gray-800 dark:text-foreground">{stats.totalStudents}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-3 border-b border-gray-100 dark:border-border">
                    <span className="text-muted-foreground font-medium">Placed:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{stats.placedStudents}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-3 border-b border-gray-100 dark:border-border">
                    <span className="text-muted-foreground font-medium">Unplaced:</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      {stats.totalStudents - stats.placedStudents}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-3 border-b border-gray-100 dark:border-border">
                    <span className="text-muted-foreground font-medium">Placement Rate:</span>
                    <span className="font-bold text-gray-800 dark:text-foreground">{placementRate}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-3 border-b border-gray-100 dark:border-border">
                    <span className="text-muted-foreground font-medium">Avg Employability Score:</span>
                    <span className="font-bold text-gray-800 dark:text-foreground">{stats.avgScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-3">
                    <span className="text-muted-foreground font-medium">Complete Profiles:</span>
                    <span className="font-bold text-gray-800 dark:text-foreground">
                      {stats.completedProfiles}/{stats.totalStudents}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold">Application Activity</CardTitle>
                  <CardDescription>Student application breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex justify-between items-center text-sm py-3 border-b border-gray-100 dark:border-border">
                    <span className="text-muted-foreground font-medium">Total Applications:</span>
                    <span className="font-bold text-gray-800 dark:text-foreground">{applications.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-3 border-b border-gray-100 dark:border-border">
                    <span className="text-muted-foreground font-medium">Active Applications:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {applications.filter(a => ['under_review', 'interview_scheduled', 'interviewed'].includes(a.status)).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-3 border-b border-gray-100 dark:border-border">
                    <span className="text-muted-foreground font-medium">Offers Received:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {applications.filter(a => a.status === 'offered').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-3">
                    <span className="text-muted-foreground font-medium">Accepted Offers:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {applications.filter(a => a.status === 'accepted').length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white dark:bg-card shadow-soft border border-gray-100 dark:border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                <CardDescription>Latest department updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 3).map((app, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-gray-100 dark:border-border pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-foreground">
                          {app.students.full_name} applied for {app.opportunities.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-muted-foreground font-medium">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {applications.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DepartmentDashboard;
