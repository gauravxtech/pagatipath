import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider } from '@/components/ui/sidebar';
import { RecruiterSidebar } from '@/components/recruiter/RecruiterSidebar';
import { 
  Briefcase, 
  Plus,
  Users,
  TrendingUp,
  Calendar,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

const RecruiterDashboard = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recruiterData, setRecruiterData] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchRecruiterData();
  }, [user]);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      
      // Fetch recruiter profile
      const { data: recruiter, error: recruiterError } = await supabase
        .from('recruiters')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (recruiterError) throw recruiterError;
      setRecruiterData(recruiter);

      // Fetch opportunities created by this recruiter
      const { data: opps, error: oppsError } = await supabase
        .from('opportunities')
        .select('*')
        .eq('recruiter_id', recruiter.id)
        .order('created_at', { ascending: false });

      if (!oppsError) setOpportunities(opps || []);

      // Fetch applications for recruiter's opportunities
      const oppIds = opps?.map(o => o.id) || [];
      if (oppIds.length > 0) {
        const { data: apps, error: appsError } = await supabase
          .from('applications')
          .select('*, students(full_name, email, abc_id, skills, employability_score), opportunities(title)')
          .in('opportunity_id', oppIds)
          .order('applied_at', { ascending: false });

        if (!appsError) setApplications(apps || []);
      }

      // Fetch students (limited view)
      const { data: studs, error: studsError } = await supabase
        .from('students')
        .select('id, full_name, abc_id, email, skills, domains_interested, employability_score, placed, colleges(name), departments(name)')
        .eq('profile_completed', true)
        .order('employability_score', { ascending: false })
        .limit(50);

      if (!studsError) setStudents(studs || []);

    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOpportunity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      // First, ensure we have recruiter data
      if (!recruiterData?.id) {
        toast.error('Recruiter profile not found');
        return;
      }

      const { error } = await supabase
        .from('opportunities')
        .insert([{
          recruiter_id: recruiterData.id,
          created_by: user?.id,
          title: formData.get('title') as string,
          type: formData.get('type') as any,
          description: formData.get('description') as string,
          location: formData.get('location') as string,
          department: formData.get('department') as string,
          stipend_min: parseInt(formData.get('stipend_min') as string) || null,
          stipend_max: parseInt(formData.get('stipend_max') as string) || null,
          duration_months: parseInt(formData.get('duration_months') as string) || null,
          positions_available: parseInt(formData.get('positions_available') as string) || 1,
          deadline: formData.get('deadline') as string || null,
          skills_required: (formData.get('skills_required') as string).split(',').map(s => s.trim()).filter(Boolean),
          active: true
        }]);

      if (error) throw error;
      toast.success('Opportunity created successfully!');
      setIsCreateDialogOpen(false);
      fetchRecruiterData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create opportunity');
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string, feedback?: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: status as any,
          recruiter_feedback: feedback || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;
      toast.success('Application status updated');
      fetchRecruiterData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.abc_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RecruiterSidebar />
        <main className="flex-1 p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">{recruiterData?.company_name}</h1>
            <p className="text-muted-foreground mb-2">{recruiterData?.industry}</p>
            <div className="flex gap-2">
              <Badge variant={recruiterData?.verified ? 'default' : 'secondary'}>
                {recruiterData?.verified ? 'Verified' : 'Pending Verification'}
              </Badge>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Post Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Opportunity</DialogTitle>
                <DialogDescription>Post a new job, internship, or training opportunity</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOpportunity} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" name="title" required />
                </div>
                
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={4} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" name="department" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="stipend_min">Min Stipend (₹)</Label>
                    <Input id="stipend_min" name="stipend_min" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="stipend_max">Max Stipend (₹)</Label>
                    <Input id="stipend_max" name="stipend_max" type="number" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="duration_months">Duration (months)</Label>
                    <Input id="duration_months" name="duration_months" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="positions_available">Positions</Label>
                    <Input id="positions_available" name="positions_available" type="number" defaultValue="1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input id="deadline" name="deadline" type="date" />
                </div>

                <div>
                  <Label htmlFor="skills_required">Required Skills (comma-separated)</Label>
                  <Input id="skills_required" name="skills_required" placeholder="React, Node.js, Python" />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Opportunity</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{opportunities.filter(o => o.active).length}</div>
              <p className="text-xs text-muted-foreground">Currently posted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">Total received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter(a => ['under_review', 'interview_scheduled'].includes(a.status)).length}
              </div>
              <p className="text-xs text-muted-foreground">Pending action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hired</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {applications.filter(a => a.status === 'accepted').length}
              </div>
              <p className="text-xs text-muted-foreground">Successful placements</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList>
            <TabsTrigger value="opportunities">My Opportunities</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="candidates">Find Candidates</TabsTrigger>
          </TabsList>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-4">
            {opportunities.map((opp) => (
              <Card key={opp.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{opp.title}</CardTitle>
                      <CardDescription>{opp.department} • {opp.location}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={opp.active ? 'default' : 'secondary'}>
                        {opp.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{opp.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{opp.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {opp.stipend_min && opp.stipend_max && (
                      <div>₹{opp.stipend_min} - ₹{opp.stipend_max}</div>
                    )}
                    {opp.duration_months && <div>{opp.duration_months} months</div>}
                    <div>{opp.positions_available} positions</div>
                    {opp.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Applications: {applications.filter(a => a.opportunity_id === opp.id).length}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No applications yet.</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{app.students.full_name}</CardTitle>
                        <CardDescription>
                          {app.students.abc_id} • {app.students.email}
                        </CardDescription>
                      </div>
                      <Badge>{app.status.replace('_', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Applied for: {app.opportunities.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Employability Score: {app.students.employability_score}/100
                      </p>
                    </div>

                    {app.students.skills && app.students.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {app.students.skills.map((skill: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {app.cover_letter && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Cover Letter:</p>
                        <p className="text-sm">{app.cover_letter}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Select 
                        defaultValue={app.status}
                        onValueChange={(value) => updateApplicationStatus(app.id, value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                          <SelectItem value="interviewed">Interviewed</SelectItem>
                          <SelectItem value="offered">Offered</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, ABC ID, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {filteredStudents.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{student.full_name}</CardTitle>
                      <CardDescription>
                        {student.abc_id} • {student.colleges?.name} • {student.departments?.name}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{student.employability_score}</div>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.skills && student.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {student.skills.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.domains_interested && student.domains_interested.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Interested In:</p>
                      <div className="flex flex-wrap gap-2">
                        {student.domains_interested.map((domain: string, idx: number) => (
                          <Badge key={idx} variant="outline">{domain}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {student.placed && (
                    <Badge className="bg-green-500">Already Placed</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
      </div>
    </SidebarProvider>
  );
};

export default RecruiterDashboard;
