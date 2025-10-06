import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCollegeInfo } from "@/hooks/useCollegeInfo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";
import { DataTable } from "@/components/shared/DataTable";

export default function CollegeTPOApplications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { collegeName } = useCollegeInfo();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    department: "",
    status: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const { data: tpoData } = await supabase
        .from("college_tpo")
        .select("college_id")
        .eq("user_id", user?.id)
        .single();

      if (tpoData?.college_id) {
        // Fetch departments
        const { data: depts } = await supabase
          .from("departments")
          .select("id, name")
          .eq("college_id", tpoData.college_id);

        setDepartments(depts || []);

        // Fetch applications from college students
        const { data: students } = await supabase
          .from("students")
          .select("id")
          .eq("college_id", tpoData.college_id);

        const studentIds = students?.map(s => s.id) || [];

        if (studentIds.length > 0) {
          const { data: apps, error } = await supabase
            .from("applications")
            .select(`
              *,
              students (
                full_name,
                email,
                departments (name)
              ),
              opportunities (
                title,
                recruiters (company_name)
              )
            `)
            .in("student_id", studentIds)
            .order("applied_at", { ascending: false });

          if (error) throw error;
          setApplications(apps || []);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "secondary";
      case "under_review": return "default";
      case "interview_scheduled": return "default";
      case "accepted": return "default";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filters.department && app.students.departments?.name !== filters.department) return false;
    if (filters.status && app.status !== filters.status) return false;
    return true;
  });

  const columns = [
    {
      key: "students.full_name",
      label: "Student Name",
      render: (row: any) => row.students.full_name,
      sortable: true,
    },
    {
      key: "students.departments.name",
      label: "Department",
      render: (row: any) => row.students.departments?.name || "N/A",
    },
    {
      key: "opportunities.title",
      label: "Job Role",
      render: (row: any) => row.opportunities.title,
    },
    {
      key: "opportunities.recruiters.company_name",
      label: "Company",
      render: (row: any) => row.opportunities.recruiters?.company_name || "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <Badge variant={getStatusColor(row.status)}>
          {row.status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      key: "applied_at",
      label: "Applied Date",
      render: (row: any) => new Date(row.applied_at).toLocaleDateString(),
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout title="Student Applications" subtitle={collegeName} sidebar={<CollegeTPOSidebar />}>
      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="w-48">
            <Label htmlFor="department">Department</Label>
            <Select
              value={filters.department}
              onValueChange={(value) => setFilters({ ...filters, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          data={filteredApplications}
          columns={columns}
          searchable
          searchPlaceholder="Search applications..."
        />
      </Card>
    </DashboardLayout>
  );
}
