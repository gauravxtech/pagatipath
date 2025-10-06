import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCollegeInfo } from "@/hooks/useCollegeInfo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Power } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";

export default function CollegeTPODepartments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { collegeName, collegeId: fetchedCollegeId } = useCollegeInfo();
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  useEffect(() => {
    if (fetchedCollegeId) {
      setCollegeId(fetchedCollegeId);
    }
  }, [fetchedCollegeId]);

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
        setCollegeId(tpoData.college_id);
        await fetchDepartments(tpoData.college_id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async (cId: string) => {
    const { data, error } = await supabase
      .from("departments")
      .select(`
        *,
        department_coordinators (
          coordinator_name,
          email
        )
      `)
      .eq("college_id", cId)
      .order("name");

    if (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    } else {
      setDepartments(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!collegeId) {
      toast.error("College not found");
      return;
    }

    try {
      if (editingDept) {
        const { error } = await supabase
          .from("departments")
          .update({
            name: formData.name,
            code: formData.code,
          })
          .eq("id", editingDept.id);

        if (error) throw error;
        toast.success("Department updated successfully");
      } else {
        const { error } = await supabase
          .from("departments")
          .insert({
            college_id: collegeId,
            name: formData.name,
            code: formData.code,
            approved: true,
          });

        if (error) throw error;
        toast.success("Department created successfully");
      }

      setDialogOpen(false);
      resetForm();
      fetchDepartments(collegeId);
    } catch (error: any) {
      console.error("Error saving department:", error);
      toast.error(error.message || "Failed to save department");
    }
  };

  const handleEdit = (dept: any) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
    });
    setDialogOpen(true);
  };

  const toggleDepartmentStatus = async (deptId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("departments")
      .update({ approved: !currentStatus })
      .eq("id", deptId);

    if (error) {
      toast.error("Failed to update department status");
    } else {
      toast.success(`Department ${!currentStatus ? "enabled" : "disabled"} successfully`);
      if (collegeId) fetchDepartments(collegeId);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", code: "" });
    setEditingDept(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout title="Departments" subtitle={collegeName} sidebar={<CollegeTPOSidebar />}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Department Management</h1>
            <p className="text-muted-foreground">Manage departments in your college</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDept ? "Edit Department" : "Add New Department"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Department Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Department Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingDept ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{dept.name}</h3>
                    <Badge variant="outline">{dept.code}</Badge>
                    <Badge variant={dept.approved ? "default" : "secondary"}>
                      {dept.approved ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {dept.department_coordinators?.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <p>Coordinator: {dept.department_coordinators[0].coordinator_name}</p>
                      <p>Email: {dept.department_coordinators[0].email}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(dept)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={dept.approved ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleDepartmentStatus(dept.id, dept.approved)}
                  >
                    <Power className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
