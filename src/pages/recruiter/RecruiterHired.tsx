import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRecruiterInfo } from "@/hooks/useRecruiterInfo";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/DataTable";

export default function RecruiterHired() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companyName } = useRecruiterInfo();
  const [loading, setLoading] = useState(true);
  const [hiredCandidates, setHiredCandidates] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchHiredCandidates();
  }, [user, navigate]);

  const fetchHiredCandidates = async () => {
    try {
      const { data: recruiterData } = await supabase
        .from("recruiters")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (recruiterData) {
        const { data, error } = await supabase
          .from("applications")
          .select(`
            *,
            students (
              full_name,
              email,
              mobile_number,
              colleges (
                name
              )
            ),
            opportunities (
              title,
              type
            )
          `)
          .in("opportunity_id", [recruiterData.id])
          .eq("status", "accepted")
          .order("updated_at", { ascending: false });

        if (error) throw error;
        setHiredCandidates(data || []);
      }
    } catch (error) {
      console.error("Error fetching hired candidates:", error);
      toast.error("Failed to load hired candidates");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'students.full_name',
      label: 'Candidate Name',
      render: (row: any) => row.students?.full_name || 'N/A',
    },
    {
      key: 'opportunities.title',
      label: 'Position',
      render: (row: any) => (
        <div>
          <div className="font-medium">{row.opportunities?.title}</div>
          <Badge variant="outline" className="mt-1">{row.opportunities?.type}</Badge>
        </div>
      ),
    },
    {
      key: 'students.email',
      label: 'Email',
      render: (row: any) => row.students?.email || 'N/A',
    },
    {
      key: 'students.colleges',
      label: 'College',
      render: (row: any) => row.students?.colleges?.name || 'N/A',
    },
    {
      key: 'updated_at',
      label: 'Hired On',
      render: (row: any) => new Date(row.updated_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <Button variant="outline" size="sm" asChild>
          <a href={`mailto:${row.students?.email}`}>
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </a>
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout sidebar={<RecruiterSidebar />} title="Hired Candidates" subtitle={companyName}>
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
    <DashboardLayout sidebar={<RecruiterSidebar />} title="Hired Candidates" subtitle={companyName}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Successfully hired candidates</p>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
        </div>

        <Card className="p-6">
          <DataTable data={hiredCandidates} columns={columns} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
