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
  GraduationCap,
  LogOut,
  FileText,
  Briefcase,
  Award,
  TrendingUp,
  Calendar,
  MapPin,
  Download,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
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
      applied: 'bg-blue-500',
      under_review: 'bg-yellow-500',
      interview_scheduled: 'bg-purple-500',
      interviewed: 'bg-indigo-500',
      offered: 'bg-green-500',
      accepted: 'bg-emerald-500',
      rejected: 'bg-red-500',
      withdrawn: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
      <nav className="border-b bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/90 sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-accent to-orange-500 rounded-xl shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-white">PragatiPath</span>
              <p className="text-xs text-white/80 hidden sm:block">National Training & Placement Portal</p>
            </div>
          </Link>

          <Button variant="outline" onClick={signOut} className="border-white/30 text-white hover:bg-white/10">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 mb-8">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-gradient-to-r from-accent to-orange-500 text-white text-2xl font-semibold">
                {getInitials(studentData?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1 text-gray-800">{studentData?.full_name}</h1>
              <p className="text-gray-600 mb-3">{studentData?.email}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">{studentData?.abc_id}</Badge>
                {studentData?.colleges && (
                  <Badge variant="outline" className="border-gray-200">{studentData.colleges.name}</Badge>
                )}
                {studentData?.departments && (
                  <Badge variant="outline" className="border-gray-200">{studentData.departments.name}</Badge>
                )}
                {studentData?.placed && <Badge className="bg-green-500 hover:bg-green-600">Placed</Badge>}
              </div>
            </div>
            <div className="text-right bg-gradient-subtle p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1 font-medium">Employability Score</div>
              <div className="text-4xl font-bold text-primary">{studentData?.employability_score}/100</div>
              <Progress value={studentData?.employability_score || 0} className="w-32 mt-2" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="bg-white shadow-soft border border-gray-100 hover:shadow-card transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Applications</CardTitle>
              <div className="p-2 bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{applications.length}</div>
              <p className="text-sm text-gray-600 font-medium">Total submitted</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-soft border border-gray-100 hover:shadow-card transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">In Review</CardTitle>
              <div className="p-2 bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {applications.filter(a => ['under_review', 'interview_scheduled', 'interviewed'].includes(a.status)).length}
              </div>
              <p className="text-sm text-gray-600 font-medium">Active applications</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-soft border border-gray-100 hover:shadow-card transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Certificates</CardTitle>
              <div className="p-2 bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-lg">
                <Award className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{certificates.length}</div>
              <p className="text-sm text-gray-600 font-medium">Earned certificates</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-soft border border-gray-100 hover:shadow-card transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Profile</CardTitle>
              <div className="p-2 bg-gradient-to-r from-accent/10 to-orange-500/10 rounded-lg">
                <FileText className="h-5 w-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {studentData?.profile_completed ? 'Complete' : 'Incomplete'}
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {studentData?.profile_completed ? 'Ready to apply' : 'Complete your profile'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="opportunities">Available Opportunities</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No applications yet. Start applying to opportunities!</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{app.opportunities.title}</CardTitle>
                        <CardDescription>
                          {app.opportunities.recruiters.company_name} • {app.opportunities.location}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                      </div>
                      <Badge variant="outline">{app.opportunities.type}</Badge>
                      {app.interview_scheduled_at && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Calendar className="h-4 w-4" />
                          Interview: {new Date(app.interview_scheduled_at).toLocaleString()}
                        </div>
                      )}
                      {app.recruiter_feedback && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-2">Recruiter Feedback:</p>
                          <p className="text-sm">{app.recruiter_feedback}</p>
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
                    <div className="space-y-4">
                      <p className="text-sm">{opp.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {opp.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {opp.location}
                          </div>
                        )}
                        {opp.stipend_min && opp.stipend_max && (
                          <div>₹{opp.stipend_min} - ₹{opp.stipend_max}</div>
                        )}
                        {opp.duration_months && (
                          <div>{opp.duration_months} months</div>
                        )}
                        {opp.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Deadline: {new Date(opp.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {opp.skills_required && opp.skills_required.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {opp.skills_required.map((skill: string, idx: number) => (
                            <Badge key={idx} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => applyToOpportunity(opp.id)}
                          disabled={alreadyApplied || !studentData?.profile_completed}
                        >
                          {alreadyApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                        {opp.recruiters.company_website && (
                          <Button variant="outline" asChild>
                            <a href={opp.recruiters.company_website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Company Website
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
                  <div>
                    <p className="text-sm font-medium mb-2">Resume</p>
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
      </main>
    </div>
  );
};

export default StudentDashboard;
