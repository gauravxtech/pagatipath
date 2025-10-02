import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/DataTable";
import { Search, Plus, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name');

      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      toast.error("Failed to fetch colleges");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    { key: 'district', label: 'District', sortable: true },
    { 
      key: 'approved', 
      label: 'Status', 
      render: (college: any) => (
        <Badge variant={college.approved ? 'default' : 'secondary'}>
          {college.approved ? 'Approved' : 'Pending'}
        </Badge>
      )
    },
  ];

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">College Management</h1>
            <p className="text-muted-foreground">Manage registered colleges and institutions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add College
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search colleges by name, code, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Colleges ({colleges.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={colleges} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
