import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRecruiterInfo } from "@/hooks/useRecruiterInfo";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function RecruiterReports() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companyName, recruiterId } = useRecruiterInfo();
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
      if (recruiterId) {
        // Job-wise applications
        const { data: opportunities } = await supabase
          .from("opportunities")
          .select(`
            title,
            applications (count)
          `)
          .eq("recruiter_id", recruiterId);

        const jobWiseApplications = (opportunities || []).map((opp: any) => ({
          name: opp.title,
          applications: opp.applications?.[0]?.count || 0,
        }));

        // College-wise selections
        const { data: selections } = await supabase
          .from("applications")
          .select(`
            status,
            students (
              colleges (name)
            )
          `)
          .eq("status", "accepted");

        const collegeMap = new Map();
        selections?.forEach((sel: any) => {
          const collegeName = sel.students?.colleges?.name || "Unknown";
          collegeMap.set(collegeName, (collegeMap.get(collegeName) || 0) + 1);
        });

        const collegeWiseSelections = Array.from(collegeMap, ([name, value]) => ({
          name,
          value,
        }));

        setAnalytics({
          jobWiseApplications,
          collegeWiseSelections,
          conversionFunnel: [],
        });
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast.success("Report export feature coming soon!");
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<RecruiterSidebar />} title="Reports & Analytics" subtitle={companyName}>
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
    <DashboardLayout sidebar={<RecruiterSidebar />} title="Reports & Analytics" subtitle={companyName}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Analyze your recruitment performance</p>
          <Button onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Job-wise Applications</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.jobWiseApplications}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">College-wise Selections</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.collegeWiseSelections}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
