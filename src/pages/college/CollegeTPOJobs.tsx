import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";

export default function CollegeTPOJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOpportunities();
  }, [user, navigate]);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          recruiters (
            company_name,
            industry
          ),
          applications (count)
        `)
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      toast.error("Failed to load job postings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CollegeTPOSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Recruiter Job Postings</h1>

          <div className="grid gap-4">
            {opportunities.map((job) => (
              <Card key={job.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <Badge variant="outline">{job.type}</Badge>
                      {job.deadline && new Date(job.deadline) < new Date() && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">
                      {job.recruiters?.company_name} • {job.recruiters?.industry}
                    </p>
                    <p className="text-sm mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {job.location && <span>📍 {job.location}</span>}
                      {job.stipend_min && (
                        <span>💰 ₹{job.stipend_min} - ₹{job.stipend_max}</span>
                      )}
                      {job.duration_months && <span>⏱️ {job.duration_months} months</span>}
                      <span>👥 {job.positions_available} positions</span>
                      {job.deadline && (
                        <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                      )}
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
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
