import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Users, Building2, TrendingUp } from "lucide-react";

export default function AdminReports() {
  const reports = [
    {
      title: "Student Enrollment Report",
      description: "Complete student data by college, state, and district",
      icon: Users,
      action: "Generate Report"
    },
    {
      title: "Training Officer Report",
      description: "NTO, STO, and DTO activity and performance",
      icon: FileText,
      action: "Generate Report"
    },
    {
      title: "College Report",
      description: "Active vs inactive colleges with statistics",
      icon: Building2,
      action: "Generate Report"
    },
    {
      title: "Growth Trends Report",
      description: "Registration and activity trends over time",
      icon: TrendingUp,
      action: "Generate Report"
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
                  <Button className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    {report.action}
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Preview
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
