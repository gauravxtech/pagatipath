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
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";

export default function CollegeTPONotifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    recipient_type: "all_students",
    department_id: "",
    title: "",
    message: "",
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
      const { data: tpoData } = await supabase
        .from("college_tpo")
        .select("college_id")
        .eq("user_id", user?.id)
        .single();

      if (tpoData?.college_id) {
        setCollegeId(tpoData.college_id);

        const { data: depts } = await supabase
          .from("departments")
          .select("id, name")
          .eq("college_id", tpoData.college_id);

        setDepartments(depts || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let targetUserIds: string[] = [];

      if (formData.recipient_type === "all_students") {
        const { data: students } = await supabase
          .from("students")
          .select("user_id")
          .eq("college_id", collegeId);

        targetUserIds = students?.map(s => s.user_id) || [];
      } else if (formData.recipient_type === "department" && formData.department_id) {
        const { data: students } = await supabase
          .from("students")
          .select("user_id")
          .eq("college_id", collegeId)
          .eq("department_id", formData.department_id);

        targetUserIds = students?.map(s => s.user_id) || [];
      }

      if (targetUserIds.length === 0) {
        toast.error("No recipients found");
        return;
      }

      const notifications = targetUserIds.map(userId => ({
        user_id: userId,
        title: formData.title,
        message: formData.message,
        type: "info",
      }));

      const { error } = await supabase
        .from("notifications")
        .insert(notifications);

      if (error) throw error;

      toast.success(`Notification sent to ${notifications.length} recipients`);
      setFormData({
        recipient_type: "all_students",
        department_id: "",
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
        <CollegeTPOSidebar />
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
                    <SelectItem value="all_students">All Students (College-wide)</SelectItem>
                    <SelectItem value="department">Specific Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.recipient_type === "department" && (
                <div>
                  <Label htmlFor="department">Select Department *</Label>
                  <Select
                    value={formData.department_id}
                    onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
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
