import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { DTOSidebar } from "@/components/dto/DTOSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, Briefcase, Users } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DTORecruiters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: recruiters, isLoading } = useQuery({
    queryKey: ["dto-recruiters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recruiters")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: opportunities } = useQuery({
    queryKey: ["dto-recruiter-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("recruiter_id, active");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: applications } = useQuery({
    queryKey: ["dto-recruiter-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("opportunity_id, status");
      
      if (error) throw error;
      return data;
    },
  });

  const filteredRecruiters = recruiters?.filter((recruiter) => {
    const matchesSearch = 
      recruiter.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && recruiter.verified) ||
      (statusFilter === "inactive" && !recruiter.verified);

    return matchesSearch && matchesStatus;
  });

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
          {item.verified ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "jobs",
      label: "Jobs Posted",
      render: (item: any) => {
        const jobCount = opportunities?.filter((o) => o.recruiter_id === item.id)?.length || 0;
        return <span>{jobCount}</span>;
      },
    },
    {
      key: "applications",
      label: "Applications",
      render: (item: any) => {
        const recruiterJobs = opportunities?.filter((o) => o.recruiter_id === item.id).map((o) => o.recruiter_id);
        const appCount = applications?.filter((a) => 
          opportunities?.find((o) => o.recruiter_id === item.id)
        )?.length || 0;
        return <span>{appCount}</span>;
      },
    },
    {
      key: "hires",
      label: "Hires Made",
      render: (item: any) => {
        const hires = applications?.filter((a) => 
          a.status === "accepted" && 
          opportunities?.find((o) => o.recruiter_id === item.id)
        )?.length || 0;
        return <span>{hires}</span>;
      },
    },
  ];

  return (
    <DashboardLayout sidebar={<DTOSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">District Recruiter Oversight</h1>
          <p className="text-muted-foreground">Monitor recruiters connected to district colleges</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recruiters</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recruiters?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Recruiters</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recruiters?.filter((r) => r.verified)?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {opportunities?.filter((o) => o.active)?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>District Recruiter Directory</CardTitle>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
