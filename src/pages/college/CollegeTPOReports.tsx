import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function CollegeTPOReports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>({
    deptWisePlacement: [],
    companyWiseHiring: [],
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
      const { data: tpoData } = await supabase
        .from("college_tpo")
        .select("college_id")
        .eq("user_id", user?.id)
        .single();

      if (tpoData?.college_id) {
        // Department-wise placement
        const { data: students } = await supabase
          .from("students")
          .select("id, department_id, departments(name)")
          .eq("college_id", tpoData.college_id);

        const studentIds = students?.map(s => s.id) || [];

        if (studentIds.length > 0) {
          const { data: acceptedApps } = await supabase
            .from("applications")
            .select(`
              student_id,
              students (
                department_id,
                departments (name)
              ),
              opportunities (
                recruiters (company_name)
              )
            `)
            .in("student_id", studentIds)
            .eq("status", "accepted");

          // Group by department
          const deptCount: any = {};
          acceptedApps?.forEach(app => {
            const deptName = app.students?.departments?.name || "Unknown";
            deptCount[deptName] = (deptCount[deptName] || 0) + 1;
          });

          const deptWisePlacement = Object.entries(deptCount).map(([name, value]) => ({
            name,
            placements: value,
          }));

          // Group by company
          const companyCount: any = {};
          acceptedApps?.forEach(app => {
            const companyName = app.opportunities?.recruiters?.company_name || "Unknown";
            companyCount[companyName] = (companyCount[companyName] || 0) + 1;
          });

          const companyWiseHiring = Object.entries(companyCount).map(([name, value]) => ({
            name,
            value,
          }));

          setAnalytics({
            deptWisePlacement,
            companyWiseHiring,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (reportType: string) => {
    let data: any[] = [];
    let filename = "";

    switch (reportType) {
      case "dept":
        data = analytics.deptWisePlacement;
        filename = "department_wise_placement.csv";
        break;
      case "company":
        data = analytics.companyWiseHiring;
        filename = "company_wise_hiring.csv";
        break;
    }

    if (data.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const headers = Object.keys(data[0]).join(",");
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
        <CollegeTPOSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">College Placement Reports</h1>

          <div className="grid gap-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Department-wise Placement Summary</h2>
                <Button variant="outline" size="sm" onClick={() => exportReport("dept")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              {analytics.deptWisePlacement.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.deptWisePlacement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="placements" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground">No placement data available</p>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Company-wise Hiring Count</h2>
                <Button variant="outline" size="sm" onClick={() => exportReport("company")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              {analytics.companyWiseHiring.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.companyWiseHiring}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.companyWiseHiring.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted-foreground">No hiring data available</p>
              )}
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
