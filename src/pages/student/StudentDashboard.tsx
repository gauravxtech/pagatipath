import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Briefcase,
  Award,
  TrendingUp,
  Calendar,
  MapPin,
  Download,
  ExternalLink,
  Sparkles,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { StudentSidebar } from '@/components/student/StudentSidebar';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);

      // Fetch student profile
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*, colleges(name), departments(name)')
        .eq('user_id', user?.id)
        .single();

      if (studentError) throw studentError;
      setStudentData(student);

      // Fetch applications
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('*, opportunities(title, type, location, recruiters(company_name))')
        .eq('student_id', student.id)
        .order('applied_at', { ascending: false });

      if (!appsError) setApplications(apps || []);

      // Fetch available opportunities
      const { data: opps, error: oppsError } = await supabase
        .from('opportunities')
        .select('*, recruiters(company_name, company_website)')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!oppsError) setOpportunities(opps || []);

      // Fetch certificates
      const { data: certs, error: certsError } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', student.id)
        .order('issued_at', { ascending: false });

      if (!certsError) setCertificates(certs || []);

    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyToOpportunity = async (opportunityId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          student_id: studentData.id,
          status: 'applied'
        });

      if (error) throw error;
      toast.success('Application submitted successfully!');
      fetchStudentData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to apply');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: 'bg-primary',
      under_review: 'bg-accent',
      interview_scheduled: 'bg-accent',
      interviewed: 'bg-accent',
      offered: 'bg-accent',
      accepted: 'bg-accent',
      rejected: 'bg-destructive',
      withdrawn: 'bg-muted-foreground'
    };
    return colors[status] || 'bg-muted';
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<StudentSidebar />} title="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<StudentSidebar />} title="Student Dashboard">
      {/* Header Profile Card */}
      <Card className="mb-6 overflow-hidden border-0 shadow-soft">
        <div className="bg-gradient-hero p-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white/20 shadow-glow">
              <AvatarFallback className="bg-gradient-accent text-white text-2xl font-bold">
                {getInitials(studentData?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{studentData?.full_name}</h2>
              <p className="text-white/80 mb-3">{studentData?.email}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">{studentData?.abc_id}</Badge>
                {studentData?.colleges && (
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">{studentData.colleges.name}</Badge>
                )}
                {studentData?.departments && (
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">{studentData.departments.name}</Badge>
                )}
                {studentData?.placed && (
                  <Badge className="bg-accent hover:bg-accent/90 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Placed
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-2 font-medium">
                <Target className="w-4 h-4" />
                Employability Score
              </div>
              <div className="text-5xl font-bold text-white mb-2">{studentData?.employability_score}</div>
              <Progress value={studentData?.employability_score || 0} className="w-32 h-2" />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-0 shadow-card hover:shadow-soft transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            <div className="p-2.5 bg-gradient-accent rounded-lg shadow-glow">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{applications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Applications submitted</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card hover:shadow-soft transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Reviews</CardTitle>
            <div className="p-2.5 bg-gradient-accent rounded-lg shadow-glow">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {applications.filter(a => ['under_review', 'interview_scheduled', 'interviewed'].includes(a.status)).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card hover:shadow-soft transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certificates</CardTitle>
            <div className="p-2.5 bg-gradient-accent rounded-lg shadow-glow">
              <Award className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{certificates.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Earned certificates</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card hover:shadow-soft transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile Status</CardTitle>
            <div className="p-2.5 bg-gradient-accent rounded-lg shadow-glow">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {studentData?.profile_completed ? '100%' : '60%'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {studentData?.profile_completed ? 'Complete' : 'Incomplete'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="bg-card shadow-card border">
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <Card className="border-0 shadow-card">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="p-4 bg-gradient-accent rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Briefcase className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground mb-4">Start applying to opportunities to track your progress here!</p>
                <Button>Browse Opportunities</Button>
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="border-0 shadow-card hover:shadow-soft transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{app.opportunities.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <span className="font-medium">{app.opportunities.recruiters.company_name}</span>
                        {app.opportunities.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {app.opportunities.location}
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(app.status)} text-white capitalize`}>
                      {app.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                      </div>
                      <Badge variant="secondary">{app.opportunities.type}</Badge>
                    </div>
                    {app.interview_scheduled_at && (
                      <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20">
                        <Calendar className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium">
                          Interview: {new Date(app.interview_scheduled_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {app.recruiter_feedback && (
                      <div className="mt-4 p-4 bg-muted rounded-lg border">
                        <p className="text-sm font-semibold mb-2 text-foreground">Recruiter Feedback:</p>
                        <p className="text-sm text-muted-foreground">{app.recruiter_feedback}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          {opportunities.map((opp) => {
            const alreadyApplied = applications.some(a => a.opportunity_id === opp.id);

            return (
              <Card key={opp.id} className="border-0 shadow-card hover:shadow-soft transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{opp.title}</CardTitle>
                        <Badge variant={opp.type === 'job' ? 'default' : 'secondary'} className="capitalize">
                          {opp.type}
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-medium">
                        {opp.recruiters.company_name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {opp.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{opp.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm">
                      {opp.location && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{opp.location}</span>
                        </div>
                      )}
                      {opp.stipend_min && opp.stipend_max && (
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          ₹{opp.stipend_min.toLocaleString()} - ₹{opp.stipend_max.toLocaleString()}
                        </div>
                      )}
                      {opp.duration_months && (
                        <div className="text-muted-foreground">
                          {opp.duration_months} months
                        </div>
                      )}
                      {opp.deadline && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {opp.skills_required && opp.skills_required.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {opp.skills_required.map((skill: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => applyToOpportunity(opp.id)}
                        disabled={alreadyApplied || !studentData?.profile_completed}
                        className="bg-gradient-accent hover:opacity-90"
                      >
                        {alreadyApplied ? 'Already Applied' : 'Apply Now'}
                      </Button>
                      {opp.recruiters.company_website && (
                        <Button variant="outline" asChild>
                          <a href={opp.recruiters.company_website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-4">
            {certificates.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No certificates yet.</p>
                </CardContent>
              </Card>
            ) : (
              certificates.map((cert) => (
                <Card key={cert.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{cert.title}</CardTitle>
                        <CardDescription>{cert.type}</CardDescription>
                      </div>
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{cert.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Issued: {new Date(cert.issued_at).toLocaleDateString()}
                      </span>
                      {cert.certificate_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={cert.certificate_url} download>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal and academic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">{studentData?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">ABC ID</p>
                    <p className="text-sm text-muted-foreground">{studentData?.abc_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{studentData?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{studentData?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-sm text-muted-foreground">{studentData?.gender || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">
                      {studentData?.dob ? new Date(studentData.dob).toLocaleDateString() : 'Not provided'}
                    </p>
                  </div>
                </div>

                {studentData?.skills && studentData.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {studentData.skills.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {studentData?.domains_interested && studentData.domains_interested.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Domains of Interest</p>
                    <div className="flex flex-wrap gap-2">
                      {studentData.domains_interested.map((domain: string, idx: number) => (
                        <Badge key={idx} variant="outline">{domain}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {studentData?.resume_url && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold mb-3">Resume</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={studentData.resume_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" />
                        View Resume
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardLayout>
  );
};

export default StudentDashboard;
