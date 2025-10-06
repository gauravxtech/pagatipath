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
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function RecruiterNotifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companyName, recruiterId } = useRecruiterInfo();
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    recipient_type: "under_review",
    opportunity_id: "",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOpportunities();
  }, [user, navigate]);

  const fetchOpportunities = async () => {
    try {
      if (recruiterId) {
        const { data } = await supabase
          .from("opportunities")
          .select("id, title")
          .eq("recruiter_id", recruiterId);
        
        setOpportunities(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.opportunity_id) {
        toast.error("Please select an opportunity");
        return;
      }

      const { data: applicationsData } = await supabase
        .from("applications")
        .select("student_id, students(user_id)")
        .eq("opportunity_id", formData.opportunity_id)
        .in("status", [formData.recipient_type as any]);

      if (!applicationsData || applicationsData.length === 0) {
        toast.error("No applications found with the selected criteria");
        return;
      }

      const notifications = applicationsData.map(app => ({
        user_id: (app.students as any)?.user_id,
        title: formData.title,
        message: formData.message,
        type: "info",
      }));

      const { error } = await supabase
        .from("notifications")
        .insert(notifications);

      if (error) throw error;

      toast.success(`Notification sent to ${notifications.length} candidates`);
      setFormData({ ...formData, title: "", message: "" });
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast.error(error.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout sidebar={<RecruiterSidebar />} title="Notifications" subtitle={companyName}>
      <div className="space-y-6">
        <p className="text-muted-foreground">Send notifications to candidates</p>

        <Card className="p-6">
          <form onSubmit={handleSendNotification} className="space-y-6">
            <div>
              <Label htmlFor="opportunity">Select Opportunity</Label>
              <Select
                value={formData.opportunity_id}
                onValueChange={(value) => setFormData({ ...formData, opportunity_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an opportunity" />
                </SelectTrigger>
                <SelectContent>
                  {opportunities.map((opp) => (
                    <SelectItem key={opp.id} value={opp.id}>
                      {opp.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="recipient_type">Recipient Type</Label>
              <Select
                value={formData.recipient_type}
                onValueChange={(value) => setFormData({ ...formData, recipient_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">All Applicants</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notification title"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Notification message"
                rows={5}
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
