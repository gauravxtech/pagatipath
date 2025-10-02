import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { NTOSidebar } from "@/components/nto/NTOSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Download, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NTOColleges() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [filterState, setFilterState] = useState("all");

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      // Fetch colleges with TPO information and student counts
      const { data: collegesData, error } = await supabase
        .from('colleges')
        .select(`
          *,
          college_tpo(tpo_full_name, email, mobile_number)
        `)
        .order('state');

      if (error) throw error;

      // Fetch student counts for each college
      const collegesWithCounts = await Promise.all(
        (collegesData || []).map(async (college) => {
          const { count: studentCount } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })
            .eq('college_id', college.id);

          const { count: deptCount } = await supabase
            .from('departments')
            .select('*', { count: 'exact', head: true })
            .eq('college_id', college.id);

          return {
            ...college,
            student_count: studentCount || 0,
            department_count: deptCount || 0
          };
        })
      );

      setColleges(collegesWithCounts);
    } catch (error) {
      toast.error("Failed to fetch colleges");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(colleges, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `colleges-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success("Data exported successfully");
  };

  const columns: any[] = [
    {
      key: 'name',
      label: 'College Name',
      render: (item: any) => (
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.code}</p>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (item: any) => (
        <div>
          <p className="font-medium">{item.state}</p>
          <p className="text-sm text-muted-foreground">{item.district}</p>
        </div>
      )
    },
    {
      key: 'tpo',
      label: 'College TPO',
      render: (item: any) => {
        const tpo = item.college_tpo?.[0];
        return tpo ? (
          <div>
            <p className="font-medium">{tpo.tpo_full_name}</p>
            <p className="text-sm text-muted-foreground">{tpo.email}</p>
          </div>
        ) : (
          <span className="text-muted-foreground">Not Assigned</span>
        );
      }
    },
    {
      key: 'stats',
      label: 'Stats',
      render: (item: any) => (
        <div className="space-y-1">
          <p className="text-sm">{item.student_count || 0} Students</p>
          <p className="text-sm text-muted-foreground">{item.department_count || 0} Departments</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: any) => item.approved ? <Badge>Approved</Badge> : <Badge variant="secondary">Pending</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout sidebar={<NTOSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">College Oversight</h1>
            <p className="text-muted-foreground">Manage colleges across all states and districts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchColleges} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by college name, code, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterState} onValueChange={setFilterState}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="approved">Approved Only</SelectItem>
              <SelectItem value="pending">Pending Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>College Directory</CardTitle>
            <CardDescription>State → District → College hierarchy view</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={colleges} columns={columns} searchable searchPlaceholder="Search..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
