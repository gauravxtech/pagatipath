import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { NTOSidebar } from "@/components/nto/NTOSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Users, Building2, TrendingUp, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function NTOReports() {
  const [generating, setGenerating] = useState<string | null>(null);

  const generateReport = async (reportType: string) => {
    setGenerating(reportType);
    try {
      let data: any = null;
      let filename = "";

      switch (reportType) {
        case "students":
          const { data: students } = await supabase.from('students').select('*, colleges(name, state, district)');
          data = students;
          filename = "national-student-enrollment-report";
          break;
        case "stos":
          const { data: stos } = await supabase.from('sto_officers').select('*');
          data = stos;
          filename = "state-training-officers-report";
          break;
        case "dtos":
          const { data: dtos } = await supabase.from('dto_officers').select('*');
          data = dtos;
          filename = "district-training-officers-report";
          break;
        case "colleges":
          const { data: colleges } = await supabase.from('colleges').select('*');
          data = colleges;
          filename = "college-performance-report";
          break;
        case "states":
          const { data: stateData } = await supabase.from('colleges').select('state, approved');
          data = stateData;
          filename = "state-wise-analysis-report";
          break;
      }

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
      title: "State-wise Student Enrollment",
      description: "Complete breakdown of student enrollment by state",
      icon: MapPin,
      type: "states"
    },
    {
      title: "National Student Report",
      description: "Comprehensive student data across all colleges",
      icon: Users,
      type: "students"
    },
    {
      title: "STO Performance Report",
      description: "State Training Officers activity and metrics",
      icon: FileText,
      type: "stos"
    },
    {
      title: "DTO Performance Report",
      description: "District Training Officers activity and metrics",
      icon: FileText,
      type: "dtos"
    },
    {
      title: "College Performance Summary",
      description: "National college rankings and statistics",
      icon: Building2,
      type: "colleges"
    },
    {
      title: "Annual Growth Trends",
      description: "Year-over-year growth analysis",
      icon: TrendingUp,
      type: "growth"
    },
  ];

  return (
    <DashboardLayout sidebar={<NTOSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">National Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate comprehensive national-level reports</p>
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
                <Button 
                  className="w-full" 
                  onClick={() => generateReport(report.type)}
                  disabled={generating === report.type}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {generating === report.type ? "Generating..." : "Generate Report"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
