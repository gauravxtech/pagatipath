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
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('state');

      if (error) throw error;
      setColleges(data || []);
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
      key: 'state',
      label: 'State',
      render: (item: any) => item.state
    },
    {
      key: 'district',
      label: 'District',
      render: (item: any) => item.district
    },
    {
      key: 'email',
      label: 'Email',
      render: (item: any) => item.email || 'N/A'
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (item: any) => item.phone || 'N/A'
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
        <Button size="sm" variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
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
