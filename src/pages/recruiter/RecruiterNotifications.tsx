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
import { Send } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";

export default function RecruiterNotifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recruiterId, setRecruiterId] = useState<string | null>(null);
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
    fetchRecruiterData();
  }, [user, navigate]);

  const fetchRecruiterData = async () => {
    try {
      const { data: recruiterData } = await supabase
        .from("recruiters")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (recruiterData) {
        setRecruiterId(recruiterData.id);
        
        const { data: oppsData } = await supabase
          .from("opportunities")
          .select("id, title")
          .eq("recruiter_id", recruiterData.id)
          .eq("active", true);

        setOpportunities(oppsData || []);
      }
    } catch (error) {
      console.error("Error fetching recruiter data:", error);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch target recipients based on selection
      let targetUserIds: string[] = [];

      if (formData.recipient_type === "under_review" && formData.opportunity_id) {
        const { data: apps } = await supabase
          .from("applications")
          .select(`
            students (
              user_id
            )
          `)
          .eq("opportunity_id", formData.opportunity_id)
          .eq("status", "under_review");

        targetUserIds = apps?.map((app: any) => app.students.user_id) || [];
      } else if (formData.recipient_type === "all_applicants" && formData.opportunity_id) {
        const { data: apps } = await supabase
          .from("applications")
          .select(`
            students (
              user_id
            )
          `)
          .eq("opportunity_id", formData.opportunity_id);

        targetUserIds = apps?.map((app: any) => app.students.user_id) || [];
      } else if (formData.recipient_type === "accepted") {
        const { data: apps } = await supabase
          .from("applications")
          .select(`
            students (
              user_id
            )
          `)
          .eq("opportunities.recruiter_id", recruiterId)
          .eq("status", "accepted");

        targetUserIds = apps?.map((app: any) => app.students.user_id) || [];
      }

      // Create notifications for all target users
      const notifications = targetUserIds.map(userId => ({
        user_id: userId,
        title: formData.title,
        message: formData.message,
        type: "info",
      }));

      if (notifications.length === 0) {
        toast.error("No recipients found for the selected criteria");
        return;
      }

      const { error } = await supabase
        .from("notifications")
        .insert(notifications);

      if (error) throw error;

      toast.success(`Notification sent to ${notifications.length} recipients`);
      setFormData({
        recipient_type: "under_review",
        opportunity_id: "",
        title: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast.error(error.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RecruiterSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Send Notifications</h1>

          <Card className="p-6 max-w-2xl">
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <Label htmlFor="recipient_type">Recipient Type *</Label>
                <Select
                  value={formData.recipient_type}
                  onValueChange={(value) => setFormData({ ...formData, recipient_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_review">Under Review Candidates</SelectItem>
                    <SelectItem value="all_applicants">All Applicants of a Job</SelectItem>
                    <SelectItem value="accepted">All Accepted Candidates</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.recipient_type === "under_review" || formData.recipient_type === "all_applicants") && (
                <div>
                  <Label htmlFor="opportunity">Select Job *</Label>
                  <Select
                    value={formData.opportunity_id}
                    onValueChange={(value) => setFormData({ ...formData, opportunity_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
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
              )}

              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Important Update"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message here..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                <Send className="mr-2 h-4 w-4" />
                {loading ? "Sending..." : "Send Notification"}
              </Button>
            </form>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
}
