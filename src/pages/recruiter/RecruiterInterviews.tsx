import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
import { SidebarProvider } from "@/components/ui/sidebar";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";
import { format } from "date-fns";

export default function RecruiterInterviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
        await fetchInterviews(recruiterData.id);
        await fetchApplications(recruiterData.id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviews = async (recruiterId: string) => {
    const { data, error } = await supabase
      .from("interviews")
      .select(`
        *,
        applications (
          id,
          students (
            full_name,
            email,
            mobile_number
          ),
          opportunities (
            title
          )
        )
      `)
      .eq("applications.opportunities.recruiter_id", recruiterId)
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching interviews:", error);
      toast.error("Failed to load interviews");
    } else {
      setInterviews(data || []);
    }
  };

  const fetchApplications = async (recruiterId: string) => {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        students (
          full_name,
          email
        ),
        opportunities!inner (
          id,
          title,
          recruiter_id
        )
      `)
      .eq("opportunities.recruiter_id", recruiterId)
      .eq("status", "under_review");

    if (error) {
      console.error("Error fetching applications:", error);
    } else {
      setApplications(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const interviewData = {
      application_id: formData.application_id,
      scheduled_at: formData.scheduled_at,
      duration_minutes: parseInt(formData.duration_minutes) || 60,
      meeting_link: formData.meeting_link || null,
      location: formData.location || null,
      interviewer_name: formData.interviewer_name || null,
      status: "scheduled",
    };

    try {
      const { error } = await supabase.from("interviews").insert(interviewData);

      if (error) throw error;

      toast.success("Interview scheduled successfully");
      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error("Error scheduling interview:", error);
      toast.error(error.message || "Failed to schedule interview");
    }
  };

  const updateInterviewStatus = async (interviewId: string, status: string) => {
    const { error } = await supabase
      .from("interviews")
      .update({ status })
      .eq("id", interviewId);

    if (error) {
      toast.error("Failed to update interview status");
    } else {
      toast.success("Interview status updated");
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      application_id: "",
      scheduled_at: "",
      duration_minutes: "60",
      meeting_link: "",
      location: "",
      interviewer_name: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "default";
      case "completed": return "secondary";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RecruiterSidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Interview Management</h1>
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
                    <Label htmlFor="application">Candidate *</Label>
                    <Select
                      value={formData.application_id}
                      onValueChange={(value) => setFormData({ ...formData, application_id: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        {applications.map((app: any) => (
                          <SelectItem key={app.id} value={app.id}>
                            {app.students.full_name} - {app.opportunities.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scheduled_at">Date & Time *</Label>
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="meeting_link">Meeting Link (for online)</Label>
                    <Input
                      id="meeting_link"
                      value={formData.meeting_link}
                      onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location (for offline)</Label>
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
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {interview.applications?.students?.full_name}
                      </h3>
                      <Badge variant={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {interview.applications?.opportunities?.title}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(interview.scheduled_at), "PPP")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(interview.scheduled_at), "p")} ({interview.duration_minutes} min)
                      </span>
                    </div>
                    {interview.meeting_link && (
                      <p className="text-sm mt-2">
                        <strong>Link:</strong>{" "}
                        <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer" className="text-primary">
                          {interview.meeting_link}
                        </a>
                      </p>
                    )}
                    {interview.location && (
                      <p className="text-sm mt-1">
                        <strong>Location:</strong> {interview.location}
                      </p>
                    )}
                    {interview.interviewer_name && (
                      <p className="text-sm mt-1">
                        <strong>Interviewer:</strong> {interview.interviewer_name}
                      </p>
                    )}
                  </div>
                  {interview.status === "scheduled" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateInterviewStatus(interview.id, "completed")}
                      >
                        Mark Completed
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateInterviewStatus(interview.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
