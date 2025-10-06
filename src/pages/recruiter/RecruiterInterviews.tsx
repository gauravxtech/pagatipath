import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRecruiterInfo } from "@/hooks/useRecruiterInfo";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function RecruiterInterviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companyName } = useRecruiterInfo();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    application_id: "",
    scheduled_at: "",
    duration_minutes: "60",
    meeting_link: "",
    location: "",
    interviewer_name: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const { data: recruiterData } = await supabase
        .from("recruiters")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (recruiterData) {
        const { data: interviewsData } = await supabase
          .from("interviews")
          .select(`
            *,
            applications (
              *,
              students (full_name, email),
              opportunities (title)
            )
          `)
          .order("scheduled_at", { ascending: true });

        const { data: applicationsData } = await supabase
          .from("applications")
          .select(`
            *,
            students (full_name, email),
            opportunities (title)
          `)
          .eq("status", "interview_scheduled");

        setInterviews(interviewsData || []);
        setApplications(applicationsData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from("interviews").insert({
        application_id: formData.application_id,
        scheduled_at: formData.scheduled_at,
        duration_minutes: parseInt(formData.duration_minutes),
        meeting_link: formData.meeting_link,
        location: formData.location,
        interviewer_name: formData.interviewer_name,
        status: "scheduled",
      });

      if (error) throw error;

      await supabase
        .from("applications")
        .update({ status: "interview_scheduled", interview_scheduled_at: formData.scheduled_at })
        .eq("id", formData.application_id);

      toast.success("Interview scheduled successfully");
      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Error scheduling interview:", error);
      toast.error(error.message || "Failed to schedule interview");
    }
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<RecruiterSidebar />} title="Interviews" subtitle={companyName}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<RecruiterSidebar />} title="Interviews" subtitle={companyName}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Schedule and manage candidate interviews</p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Interview
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Interview</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="application">Select Application</Label>
                  <Select value={formData.application_id} onValueChange={(value) => setFormData({ ...formData, application_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select application" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.students?.full_name} - {app.opportunities?.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduled_at">Date & Time</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="meeting_link">Meeting Link</Label>
                  <Input
                    id="meeting_link"
                    type="url"
                    value={formData.meeting_link}
                    onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                    placeholder="https://meet.google.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (if in-person)</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="interviewer">Interviewer Name</Label>
                  <Input
                    id="interviewer"
                    value={formData.interviewer_name}
                    onChange={(e) => setFormData({ ...formData, interviewer_name: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Schedule Interview</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {interviews.map((interview) => (
            <Card key={interview.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {interview.applications?.students?.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Position: {interview.applications?.opportunities?.title}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(interview.scheduled_at), 'PPP')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(interview.scheduled_at), 'p')} ({interview.duration_minutes} min)
                    </div>
                  </div>
                  {interview.meeting_link && (
                    <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                      Join Meeting
                    </a>
                  )}
                  {interview.location && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Location: {interview.location}
                    </p>
                  )}
                </div>
                <Badge>{interview.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
