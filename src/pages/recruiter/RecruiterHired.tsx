import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";
import { DataTable } from "@/components/shared/DataTable";

export default function RecruiterHired() {
  const navigate = useNavigate();
  const { user } = useAuth();
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
          .eq("opportunities.recruiter_id", recruiterData.id)
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

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Mobile", "College", "Position", "Hired Date"];
    const rows = hiredCandidates.map(candidate => [
      candidate.students.full_name,
      candidate.students.email,
      candidate.students.mobile_number || "N/A",
      candidate.students.colleges?.name || "N/A",
      candidate.opportunities.title,
      new Date(candidate.updated_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hired_candidates_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    toast.success("Report exported successfully");
  };

  const columns = [
    {
      key: "students.full_name",
      label: "Candidate Name",
      render: (row: any) => row.students.full_name,
    },
    {
      key: "students.email",
      label: "Email",
      render: (row: any) => row.students.email,
    },
    {
      key: "students.mobile_number",
      label: "Mobile",
      render: (row: any) => row.students.mobile_number || "N/A",
    },
    {
      key: "students.colleges.name",
      label: "College",
      render: (row: any) => row.students.colleges?.name || "N/A",
    },
    {
      key: "opportunities.title",
      label: "Position",
      render: (row: any) => row.opportunities.title,
    },
    {
      key: "opportunities.type",
      label: "Type",
      render: (row: any) => (
        <Badge variant="outline">{row.opportunities.type}</Badge>
      ),
    },
    {
      key: "updated_at",
      label: "Hired Date",
      render: (row: any) => new Date(row.updated_at).toLocaleDateString(),
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RecruiterSidebar />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Hired Candidates</h1>
            <Button onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
          </div>

          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">
                Total Hired: {hiredCandidates.length}
              </h2>
            </div>
            <DataTable
              data={hiredCandidates}
              columns={columns}
              searchable
              searchPlaceholder="Search by name or email..."
            />
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
}
