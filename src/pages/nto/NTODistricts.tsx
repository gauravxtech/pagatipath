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

export default function NTODistricts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [dtoOfficers, setDtoOfficers] = useState([]);
  const [filterState, setFilterState] = useState("all");

  useEffect(() => {
    fetchDTOs();
  }, []);

  const fetchDTOs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dto_officers')
        .select('*')
        .order('state');

      if (error) throw error;
      setDtoOfficers(data || []);
    } catch (error) {
      toast.error("Failed to fetch DTOs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      // Update both the dto_officers table and user_roles table
      const [officerUpdate, roleUpdate] = await Promise.all([
        (supabase as any)
          .from('dto_officers')
          .update({ approved: true })
          .eq('user_id', userId),
        supabase
          .from('user_roles')
          .update({ approved: true })
          .eq('user_id', userId)
      ]);
      
      if (officerUpdate.error) throw officerUpdate.error;
      if (roleUpdate.error) throw roleUpdate.error;
      
      toast.success("DTO approved successfully");
      fetchDTOs();
    } catch (error) {
      toast.error("Failed to approve DTO");
      console.error(error);
    }
  };

  const handleDisable = async (userId: string) => {
    try {
      // Update both the dto_officers table and user_roles table
      const [officerUpdate, roleUpdate] = await Promise.all([
        (supabase as any)
          .from('dto_officers')
          .update({ approved: false })
          .eq('user_id', userId),
        supabase
          .from('user_roles')
          .update({ approved: false })
          .eq('user_id', userId)
      ]);
      
      if (officerUpdate.error) throw officerUpdate.error;
      if (roleUpdate.error) throw roleUpdate.error;
      
      toast.success("DTO disabled successfully");
      fetchDTOs();
    } catch (error) {
      toast.error("Failed to disable DTO");
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
      key: 'district_officer_id',
      label: 'Officer ID',
      render: (item: any) => item.district_officer_id
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
            <h1 className="text-3xl font-bold">District Training Officers</h1>
            <p className="text-muted-foreground">Manage DTOs across all districts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchDTOs} disabled={loading}>
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
              placeholder="Search by name, district, or state..."
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
            <CardTitle>DTO List</CardTitle>
            <CardDescription>View and manage District Training Officers grouped by state</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={dtoOfficers} columns={columns} searchable searchPlaceholder="Search..." />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
