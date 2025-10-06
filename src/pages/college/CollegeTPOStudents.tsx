import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCollegeInfo } from "@/hooks/useCollegeInfo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Power } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";

export default function CollegeTPOStudents() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { collegeName } = useCollegeInfo();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    department: "all",
    year: "",
    search: "",
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

        // Fetch students
        const { data: studs, error } = await supabase
          .from("students")
          .select(`
            *,
            departments (name)
          `)
          .eq("college_id", tpoData.college_id)
          .order("full_name");

        if (error) throw error;
        setStudents(studs || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentStatus = async (studentId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("students")
      .update({ approved: !currentStatus })
      .eq("id", studentId);

    if (error) {
      toast.error("Failed to update student status");
    } else {
      toast.success(`Student ${!currentStatus ? "enabled" : "disabled"} successfully`);
      fetchData();
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Roll Number", "ABC ID", "Email", "Department", "Status"];
    const rows = filteredStudents.map(student => [
      student.full_name,
      student.enrollment_number || "N/A",
      student.abc_id,
      student.email,
      student.departments?.name || "N/A",
      student.approved ? "Active" : "Inactive",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    toast.success("Student list exported successfully");
  };

  const filteredStudents = students.filter(student => {
    if (filters.department && filters.department !== "all" && student.department_id !== filters.department) return false;
    if (filters.year && student.year_semester !== filters.year) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        student.full_name.toLowerCase().includes(search) ||
        student.abc_id.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.enrollment_number?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const columns = [
    {
      key: "full_name",
      label: "Name",
      sortable: true,
    },
    {
      key: "enrollment_number",
      label: "Roll Number",
      render: (row: any) => row.enrollment_number || "N/A",
    },
    {
      key: "abc_id",
      label: "ABC ID",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "departments.name",
      label: "Department",
      render: (row: any) => row.departments?.name || "N/A",
    },
    {
      key: "year_semester",
      label: "Year/Sem",
      render: (row: any) => row.year_semester || "N/A",
    },
    {
      key: "approved",
      label: "Status",
      render: (row: any) => (
        <Badge variant={row.approved ? "default" : "secondary"}>
          {row.approved ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleStudentStatus(row.id, row.approved)}
        >
          <Power className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout title="Students" subtitle={collegeName} sidebar={<CollegeTPOSidebar />}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Student Management</h1>
            <p className="text-muted-foreground">View and manage students in your college</p>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name, ABC ID, email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
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
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable
            data={filteredStudents}
            columns={columns}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
