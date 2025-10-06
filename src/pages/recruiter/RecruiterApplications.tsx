import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { RecruiterSidebar } from '@/components/recruiter/RecruiterSidebar';
import { useRecruiterInfo } from '@/hooks/useRecruiterInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable } from '@/components/shared/DataTable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Eye, FileText } from 'lucide-react';

export default function RecruiterApplications() {
  const { user } = useAuth();
  const { companyName } = useRecruiterInfo();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data: recruiterData } = await supabase
        .from('recruiters')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!recruiterData) return;

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          students (
            full_name,
            abc_id,
            email,
            phone,
            employability_score,
            resume_url,
            skills
          ),
          opportunities (
            title,
            type
          )
        `)
        .eq('opportunities.recruiter_id', recruiterData.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (app: any) => {
    setSelectedApp(app);
    setFeedback(app.recruiter_feedback || '');
    setNewStatus(app.status);
    setDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;

    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: newStatus as any,
          recruiter_feedback: feedback,
        })
        .eq('id', selectedApp.id);

      if (error) throw error;

      toast.success('Application updated successfully');
      setDialogOpen(false);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      applied: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      interview_scheduled: 'bg-purple-100 text-purple-800',
      interviewed: 'bg-indigo-100 text-indigo-800',
      offered: 'bg-green-100 text-green-800',
      accepted: 'bg-green-200 text-green-900',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (row: any) => (
        <div>
          <div className="font-medium">{row.students?.full_name}</div>
          <div className="text-sm text-muted-foreground">{row.students?.abc_id}</div>
        </div>
      ),
    },
    {
      key: 'opportunity',
      label: 'Opportunity',
      render: (row: any) => (
        <div>
          <div className="font-medium">{row.opportunities?.title}</div>
          <div className="text-sm text-muted-foreground capitalize">{row.opportunities?.type}</div>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (row: any) => (
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {row.students?.employability_score || 0}
          </div>
          <div className="text-xs text-muted-foreground">out of 100</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>
          {row.status.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'applied_at',
      label: 'Applied',
      render: (row: any) => new Date(row.applied_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleViewApplication(row)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {row.students?.resume_url && (
            <Button size="sm" variant="ghost" asChild>
              <a href={row.students.resume_url} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Applications" subtitle={companyName} sidebar={<RecruiterSidebar />}>
      <div className="space-y-6">
        <p className="text-muted-foreground">Review and manage candidate applications</p>

        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>Review applications from candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={applications}
              searchable
              searchPlaceholder="Search by student name or ABC ID..."
            />
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review and update application status
              </DialogDescription>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Student Name</div>
                    <div className="text-lg font-semibold">{selectedApp.students?.full_name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">ABC ID</div>
                    <div className="text-lg">{selectedApp.students?.abc_id}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div>{selectedApp.students?.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Phone</div>
                    <div>{selectedApp.students?.phone || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Employability Score</div>
                    <div className="text-2xl font-bold text-primary">
                      {selectedApp.students?.employability_score || 0}/100
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Applied Date</div>
                    <div>{new Date(selectedApp.applied_at).toLocaleDateString()}</div>
                  </div>
                </div>

                {selectedApp.students?.skills && selectedApp.students.skills.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.students.skills.map((skill: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApp.cover_letter && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Cover Letter</div>
                    <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                      {selectedApp.cover_letter}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Update Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
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

                <div>
                  <label className="text-sm font-medium">Feedback</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback to the candidate..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateStatus}>
                    Update Application
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}