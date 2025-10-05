import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { RecruiterSidebar } from '@/components/recruiter/RecruiterSidebar';
import { StatsCard } from '@/components/analytics/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Briefcase,
  Plus,
  Users,
  TrendingUp,
  Calendar,
  Search,
  Building2,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
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

  // Calculate analytics data
  const applicationStatusData = [
    { name: 'Applied', value: applications.filter(a => a.status === 'applied').length, color: '#3b82f6' },
    { name: 'Under Review', value: applications.filter(a => a.status === 'under_review').length, color: '#f59e0b' },
    { name: 'Interview', value: applications.filter(a => a.status === 'interview_scheduled').length, color: '#8b5cf6' },
    { name: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, color: '#10b981' },
    { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const opportunityTypeData = opportunities.reduce((acc: any[], opp) => {
    const existing = acc.find(item => item.name === opp.type);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: opp.type, value: 1 });
    }
    return acc;
  }, []);

  const monthlyApplications = applications.reduce((acc: any, app) => {
    const month = new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[month]) acc[month] = 0;
    acc[month]++;
    return acc;
  }, {});

  const applicationTrendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    .map(month => ({
      month,
      applications: monthlyApplications[month] || 0
    }))
    .filter(item => item.applications > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout sidebar={<RecruiterSidebar />}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{recruiterData?.company_name}</h1>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Opportunities"
            value={opportunities.filter(o => o.active).length}
            description="Currently posted"
            icon={Briefcase}
            loading={loading}
          />
          <StatsCard
            title="Total Applications"
            value={applications.length}
            description="All time received"
            icon={Users}
            loading={loading}
          />
          <StatsCard
            title="Under Review"
            value={applications.filter(a => ['under_review', 'interview_scheduled'].includes(a.status)).length}
            description="Pending action"
            icon={Clock}
            loading={loading}
          />
          <StatsCard
            title="Successful Hires"
            value={applications.filter(a => a.status === 'accepted').length}
            description="Completed placements"
            icon={CheckCircle}
            loading={loading}
          />
        </div>

        {/* Analytics Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Application Status Distribution</CardTitle>
              <CardDescription>Current status of all applications</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {applicationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opportunity Types</CardTitle>
              <CardDescription>Distribution of posted opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={opportunityTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {applicationTrendData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Application Trend</CardTitle>
              <CardDescription>Monthly application volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={applicationTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest candidate applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No applications yet.</p>
                <p className="text-sm text-muted-foreground">Post opportunities to start receiving applications.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center text-white font-semibold">
                        {app.students.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{app.students.full_name}</p>
                        <p className="text-sm text-muted-foreground">Applied for {app.opportunities.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        app.status === 'accepted' ? 'default' :
                          app.status === 'rejected' ? 'destructive' :
                            'secondary'
                      }>
                        {app.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {applications.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm">
                      View All Applications
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Active Opportunities</CardTitle>
            <CardDescription>Your currently posted opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            {opportunities.filter(o => o.active).length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active opportunities.</p>
                <p className="text-sm text-muted-foreground mb-4">Create your first opportunity to start hiring.</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post Opportunity
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunities.filter(o => o.active).slice(0, 3).map((opp) => (
                  <div key={opp.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{opp.title}</h3>
                        <p className="text-sm text-muted-foreground">{opp.department} • {opp.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{opp.type}</Badge>
                        <Badge>{applications.filter(a => a.opportunity_id === opp.id).length} applications</Badge>
                      </div>
                    </div>
                    <p className="text-sm mb-3 line-clamp-2">{opp.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        {opp.stipend_min && opp.stipend_max && (
                          <span>₹{opp.stipend_min} - ₹{opp.stipend_max}</span>
                        )}
                        {opp.duration_months && <span>{opp.duration_months} months</span>}
                        <span>{opp.positions_available} positions</span>
                      </div>
                      {opp.deadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {opportunities.filter(o => o.active).length > 3 && (
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm">
                      View All Opportunities
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
