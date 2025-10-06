import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCollegeInfo } from "@/hooks/useCollegeInfo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";
import { format } from "date-fns";

export default function CollegeTPOInterviews() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { collegeName } = useCollegeInfo();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchInterviews();
  }, [user, navigate]);

  const fetchInterviews = async () => {
    try {
      const { data: tpoData } = await supabase
        .from("college_tpo")
        .select("college_id")
        .eq("user_id", user?.id)
        .single();

      if (tpoData?.college_id) {
        // Get students from this college
        const { data: students } = await supabase
          .from("students")
          .select("id")
          .eq("college_id", tpoData.college_id);

        const studentIds = students?.map(s => s.id) || [];

        if (studentIds.length > 0) {
          // Get applications for these students
          const { data: applications } = await supabase
            .from("applications")
            .select("id")
            .in("student_id", studentIds);

          const applicationIds = applications?.map(a => a.id) || [];

          if (applicationIds.length > 0) {
            const { data, error } = await supabase
              .from("interviews")
              .select(`
                *,
                applications (
                  students (
                    full_name,
                    email,
                    mobile_number
                  ),
                  opportunities (
                    title,
                    recruiters (company_name)
                  )
                )
              `)
              .in("application_id", applicationIds)
              .order("scheduled_at", { ascending: true });

            if (error) throw error;
            setInterviews(data || []);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
    }
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
    <DashboardLayout title="Interview Schedule" subtitle={collegeName} sidebar={<CollegeTPOSidebar />}>
      <div className="grid gap-4">
        {interviews.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No interviews scheduled yet.</p>
          </Card>
        ) : (
          interviews.map((interview) => (
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
                    {interview.applications?.opportunities?.title} at{" "}
                    {interview.applications?.opportunities?.recruiters?.company_name}
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
                      <a
                        href={interview.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                      >
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
              </div>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
