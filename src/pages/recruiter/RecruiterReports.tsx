import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function RecruiterReports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>({
    jobWiseApplications: [],
    collegeWiseSelections: [],
    conversionFunnel: [],
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      const { data: recruiterData } = await supabase
        .from("recruiters")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (recruiterData) {
        // Job-wise applications
        const { data: opportunities } = await supabase
          .from("opportunities")
          .select(`
            title,
            applications (count)
          `)
          .eq("recruiter_id", recruiterData.id);

        const jobWiseApplications = opportunities?.map(opp => ({
          name: opp.title,
          applications: opp.applications[0]?.count || 0,
        })) || [];

        // College-wise selections
        const { data: hiredApps } = await supabase
          .from("applications")
          .select(`
            students (
              colleges (
                name
              )
            )
          `)
          .eq("opportunities.recruiter_id", recruiterData.id)
          .eq("status", "accepted");

        const collegeCount: any = {};
        hiredApps?.forEach(app => {
          const collegeName = app.students?.colleges?.name || "Unknown";
          collegeCount[collegeName] = (collegeCount[collegeName] || 0) + 1;
        });

        const collegeWiseSelections = Object.entries(collegeCount).map(([name, value]) => ({
          name,
          value,
        }));

        // Conversion funnel
        const { data: allApps } = await supabase
          .from("applications")
          .select("status")
          .eq("opportunities.recruiter_id", recruiterData.id);

        const statusCount = {
          applied: 0,
          under_review: 0,
          interview_scheduled: 0,
          accepted: 0,
        };

        allApps?.forEach(app => {
          if (app.status in statusCount) {
            statusCount[app.status as keyof typeof statusCount]++;
          }
        });

        const conversionFunnel = [
          { stage: "Applied", count: statusCount.applied },
          { stage: "Under Review", count: statusCount.under_review },
          { stage: "Interview", count: statusCount.interview_scheduled },
          { stage: "Accepted", count: statusCount.accepted },
        ];

        setAnalytics({
          jobWiseApplications,
          collegeWiseSelections,
          conversionFunnel,
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (reportType: string) => {
    let data: any[] = [];
    let filename = "";

    switch (reportType) {
      case "jobs":
        data = analytics.jobWiseApplications;
        filename = "job_wise_applications.csv";
        break;
      case "colleges":
        data = analytics.collegeWiseSelections;
        filename = "college_wise_selections.csv";
        break;
      case "funnel":
        data = analytics.conversionFunnel;
        filename = "conversion_funnel.csv";
        break;
    }

    const headers = Object.keys(data[0] || {}).join(",");
    const rows = data.map(row => Object.values(row).join(","));
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    
    toast.success("Report exported successfully");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <RecruiterSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

          <div className="grid gap-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Job-wise Application Count</h2>
                <Button variant="outline" size="sm" onClick={() => exportReport("jobs")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.jobWiseApplications}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">College-wise Selections</h2>
                <Button variant="outline" size="sm" onClick={() => exportReport("colleges")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.collegeWiseSelections}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.collegeWiseSelections.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Conversion Funnel</h2>
                <Button variant="outline" size="sm" onClick={() => exportReport("funnel")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.conversionFunnel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
