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
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";

export default function RecruiterJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companyName, recruiterId: recId } = useRecruiterInfo();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "internship" as "internship" | "job" | "project" | "training",
    description: "",
    location: "",
    stipend_min: "",
    stipend_max: "",
    duration_months: "",
    positions_available: "1",
    skills_required: "",
    deadline: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchRecruiterData();
  }, [user, navigate]);

  const fetchRecruiterData = async () => {
    try {
      if (recId) {
        await fetchOpportunities(recId);
      }
    } catch (error) {
      console.error("Error fetching recruiter data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpportunities = async (recId: string) => {
    const { data, error } = await supabase
      .from("opportunities")
      .select(`
        *,
        applications (count)
      `)
      .eq("recruiter_id", recId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching opportunities:", error);
      toast.error("Failed to load job postings");
    } else {
      setOpportunities(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recId) {
      toast.error("Recruiter profile not found");
      return;
    }

    const jobData = {
      title: formData.title,
      type: formData.type,
      description: formData.description,
      location: formData.location,
      stipend_min: parseInt(formData.stipend_min) || null,
      stipend_max: parseInt(formData.stipend_max) || null,
      duration_months: parseInt(formData.duration_months) || null,
      positions_available: parseInt(formData.positions_available) || 1,
      skills_required: formData.skills_required.split(",").map(s => s.trim()),
      deadline: formData.deadline || null,
      recruiter_id: recId,
      created_by: user?.id,
      active: true,
    };

    try {
      if (editingJob) {
        const { error } = await supabase
          .from("opportunities")
          .update(jobData)
          .eq("id", editingJob.id);

        if (error) throw error;
        toast.success("Job posting updated successfully");
      } else {
        const { error } = await supabase
          .from("opportunities")
          .insert(jobData);

        if (error) throw error;
        toast.success("Job posting created successfully");
      }

      setDialogOpen(false);
      resetForm();
      if (recId) fetchOpportunities(recId);
    } catch (error: any) {
      console.error("Error saving job:", error);
      toast.error(error.message || "Failed to save job posting");
    }
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      type: job.type,
      description: job.description || "",
      location: job.location || "",
      stipend_min: job.stipend_min?.toString() || "",
      stipend_max: job.stipend_max?.toString() || "",
      duration_months: job.duration_months?.toString() || "",
      positions_available: job.positions_available?.toString() || "1",
      skills_required: job.skills_required?.join(", ") || "",
      deadline: job.deadline || "",
    });
    setDialogOpen(true);
  };

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("opportunities")
      .update({ active: !currentStatus })
      .eq("id", jobId);

    if (error) {
      toast.error("Failed to update job status");
    } else {
      toast.success(`Job ${!currentStatus ? "activated" : "deactivated"} successfully`);
      if (recId) fetchOpportunities(recId);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "internship",
      description: "",
      location: "",
      stipend_min: "",
      stipend_max: "",
      duration_months: "",
      positions_available: "1",
      skills_required: "",
      deadline: "",
    });
    setEditingJob(null);
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<RecruiterSidebar />} title="Job Postings" subtitle={companyName}>
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
    <DashboardLayout sidebar={<RecruiterSidebar />} title="Job Postings" subtitle={companyName}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Manage your job postings and track applications</p>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingJob ? "Edit Job Posting" : "Create New Job Posting"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="job">Job</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="positions">Positions Available</Label>
                      <Input
                        id="positions"
                        type="number"
                        value={formData.positions_available}
                        onChange={(e) => setFormData({ ...formData, positions_available: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stipend_min">Minimum Stipend/Salary</Label>
                      <Input
                        id="stipend_min"
                        type="number"
                        value={formData.stipend_min}
                        onChange={(e) => setFormData({ ...formData, stipend_min: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stipend_max">Maximum Stipend/Salary</Label>
                      <Input
                        id="stipend_max"
                        type="number"
                        value={formData.stipend_max}
                        onChange={(e) => setFormData({ ...formData, stipend_max: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Duration (months)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration_months}
                        onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Application Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills Required (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={formData.skills_required}
                      onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                      placeholder="React, Node.js, TypeScript"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingJob ? "Update Job" : "Create Job"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
        </div>

        <div className="grid gap-4">
            {opportunities.map((job) => (
              <Card key={job.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <Badge variant={job.active ? "default" : "secondary"}>
                        {job.active ? "Active" : "Closed"}
                      </Badge>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {job.location && <span>📍 {job.location}</span>}
                      {job.stipend_min && (
                        <span>💰 ₹{job.stipend_min} - ₹{job.stipend_max}</span>
                      )}
                      {job.duration_months && <span>⏱️ {job.duration_months} months</span>}
                      <span>👥 {job.positions_available} positions</span>
                      <span>📝 {job.applications?.[0]?.count || 0} applications</span>
                    </div>
                    {job.skills_required?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills_required.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={job.active ? "destructive" : "default"} 
                      size="sm"
                      onClick={() => toggleJobStatus(job.id, job.active)}
                    >
                      {job.active ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
