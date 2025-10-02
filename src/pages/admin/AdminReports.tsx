import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Users, Building2, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminReports() {
  const [generating, setGenerating] = useState<string | null>(null);

  const generateReport = async (reportType: string) => {
    setGenerating(reportType);
    try {
      let data: any = null;
      let filename = "";

      switch (reportType) {
        case "students":
          const { data: students } = await supabase.from('students').select('*');
          data = students;
          filename = "student-enrollment-report";
          break;
        case "officers":
          const [nto, sto, dto] = await Promise.all([
            supabase.from('nto_officers').select('*'),
            supabase.from('sto_officers').select('*'),
            supabase.from('dto_officers').select('*')
          ]);
          data = { nto: nto.data, sto: sto.data, dto: dto.data };
          filename = "training-officers-report";
          break;
        case "colleges":
          const { data: colleges } = await supabase.from('colleges').select('*');
          data = colleges;
          filename = "colleges-report";
          break;
        case "growth":
          const { data: analytics } = await supabase.from('analytics_events').select('*').order('created_at', { ascending: false });
          data = analytics;
          filename = "growth-trends-report";
          break;
      }

      // Convert to CSV or JSON
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      toast.success("Report generated successfully");
    } catch (error) {
      toast.error("Failed to generate report");
      console.error(error);
    } finally {
      setGenerating(null);
    }
  };
  const reports = [
    {
      title: "Student Enrollment Report",
      description: "Complete student data by college, state, and district",
      icon: Users,
      action: "Generate Report",
      type: "students"
    },
    {
      title: "Training Officer Report",
      description: "NTO, STO, and DTO activity and performance",
      icon: FileText,
      action: "Generate Report",
      type: "officers"
    },
    {
      title: "College Report",
      description: "Active vs inactive colleges with statistics",
      icon: Building2,
      action: "Generate Report",
      type: "colleges"
    },
    {
      title: "Growth Trends Report",
      description: "Registration and activity trends over time",
      icon: TrendingUp,
      action: "Generate Report",
      type: "growth"
    },
  ];

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download comprehensive reports</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <report.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => generateReport(report.type)}
                    disabled={generating === report.type}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {generating === report.type ? "Generating..." : report.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
