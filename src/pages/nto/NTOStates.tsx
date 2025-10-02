import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { NTOSidebar } from "@/components/nto/NTOSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NTOStates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [stoOfficers, setStoOfficers] = useState([]);
  const [filterState, setFilterState] = useState("all");

  useEffect(() => {
    fetchSTOs();
  }, []);

  const fetchSTOs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sto_officers')
        .select('*')
        .order('state');

      if (error) throw error;
      setStoOfficers(data || []);
    } catch (error) {
      toast.error("Failed to fetch STOs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      // Update both the sto_officers table and user_roles table
      const [officerUpdate, roleUpdate] = await Promise.all([
        (supabase as any)
          .from('sto_officers')
          .update({ approved: true })
          .eq('user_id', userId),
        supabase
          .from('user_roles')
          .update({ approved: true })
          .eq('user_id', userId)
      ]);
      
      if (officerUpdate.error) throw officerUpdate.error;
      if (roleUpdate.error) throw roleUpdate.error;
      
      toast.success("STO approved successfully");
      fetchSTOs();
    } catch (error) {
      toast.error("Failed to approve STO");
      console.error(error);
    }
  };

  const handleDisable = async (userId: string) => {
    try {
      // Update both the sto_officers table and user_roles table
      const [officerUpdate, roleUpdate] = await Promise.all([
        (supabase as any)
          .from('sto_officers')
          .update({ approved: false })
          .eq('user_id', userId),
        supabase
          .from('user_roles')
          .update({ approved: false })
          .eq('user_id', userId)
      ]);
      
      if (officerUpdate.error) throw officerUpdate.error;
      if (roleUpdate.error) throw roleUpdate.error;
      
      toast.success("STO disabled successfully");
      fetchSTOs();
    } catch (error) {
      toast.error("Failed to disable STO");
      console.error(error);
    }
  };

  const columns: any[] = [
    {
      key: 'full_name',
      label: 'Name',
      render: (item: any) => item.full_name
    },
    {
      key: 'email',
      label: 'Email',
      render: (item: any) => item.email
    },
    {
      key: 'mobile_number',
      label: 'Mobile',
      render: (item: any) => item.mobile_number
    },
    {
      key: 'state',
      label: 'State',
      render: (item: any) => item.state
    },
    {
      key: 'state_officer_id',
      label: 'Officer ID',
      render: (item: any) => item.state_officer_id
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: any) => item.approved ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => (
        <div className="flex gap-2">
          {!item.approved && (
            <Button size="sm" onClick={() => handleApprove(item.user_id)}>
              Approve
            </Button>
          )}
          {item.approved && (
            <Button size="sm" variant="outline" onClick={() => handleDisable(item.user_id)}>
              Disable
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <DashboardLayout sidebar={<NTOSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">State Training Officers</h1>
            <p className="text-muted-foreground">Manage STOs across all states</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchSTOs} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or state..."
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
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>STO List</CardTitle>
            <CardDescription>View and manage State Training Officers</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={stoOfficers} columns={columns} searchable searchPlaceholder="Search..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
