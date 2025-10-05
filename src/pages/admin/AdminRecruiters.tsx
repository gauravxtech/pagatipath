import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, TrendingUp, Briefcase, Users } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { useToast } from "@/hooks/use-toast";

export default function AdminRecruiters() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: recruiters, isLoading, refetch } = useQuery({
    queryKey: ["admin-recruiters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recruiters")
        .select("*, user_id")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-recruiter-stats"],
    queryFn: async () => {
      const { data: recruitersData } = await supabase
        .from("recruiters")
        .select("id, verified");

      const { data: jobsData } = await supabase
        .from("opportunities")
        .select("recruiter_id");

      const { data: hiresData } = await supabase
        .from("applications")
        .select("id")
        .eq("status", "accepted");

      return {
        totalRecruiters: recruitersData?.length || 0,
        activeRecruiters: recruitersData?.filter((r) => r.verified)?.length || 0,
        totalJobs: jobsData?.length || 0,
        totalHires: hiresData?.length || 0,
      };
    },
  });

  const handleToggleVerification = async (recruiterId: string, userId: string, currentStatus: boolean) => {
    try {
      const currentUser = await supabase.auth.getUser();

      // Update recruiter verified status - the database trigger will sync user_roles automatically
      const { error: recruiterError } = await supabase
        .from("recruiters")
        .update({
          verified: !currentStatus,
          approved_by: !currentStatus ? currentUser.data.user?.id : null
        })
        .eq("id", recruiterId);

      if (recruiterError) throw recruiterError;

      toast({
        title: "Success",
        description: `Recruiter ${!currentStatus ? "approved and verified" : "disabled"} successfully`,
      });
      refetch();
    } catch (error) {
      console.error("Toggle verification error:", error);
      toast({
        title: "Error",
        description: "Failed to update recruiter status",
        variant: "destructive",
      });
    }
  };

  const filteredRecruiters = recruiters?.filter((recruiter) =>
    recruiter.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "company_name", label: "Company Name" },
    { key: "contact_person", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "industry", label: "Industry" },
    {
      key: "verified",
      label: "Status",
      render: (item: any) => (
        <Badge variant={item.verified ? "default" : "secondary"}>
          {item.verified ? "Verified" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (item: any) => (
        <Button
          size="sm"
          variant={item.verified ? "destructive" : "default"}
          onClick={() => handleToggleVerification(item.id, item.user_id, item.verified)}
        >
          {item.verified ? "Disable" : "Approve"}
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Recruiter Management</h1>
          <p className="text-muted-foreground">Manage all recruiters and companies</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recruiters</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalRecruiters || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Recruiters</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeRecruiters || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Job Postings</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hires</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalHires || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recruiter Directory</CardTitle>
            <div className="flex items-center gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by company name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={filteredRecruiters || []}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
