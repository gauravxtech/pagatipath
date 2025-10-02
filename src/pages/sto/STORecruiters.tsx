import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { STOSidebar } from "@/components/sto/STOSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, Briefcase } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function STORecruiters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: recruiters, isLoading } = useQuery({
    queryKey: ["sto-recruiters"],
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
    queryKey: ["sto-recruiter-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("recruiter_id, active");
      
      if (error) throw error;
      return data;
    },
  });

  const filteredRecruiters = recruiters?.filter((recruiter) => {
    const matchesSearch = 
      recruiter.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruiter.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = 
      industryFilter === "all" || recruiter.industry === industryFilter;
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && recruiter.verified) ||
      (statusFilter === "inactive" && !recruiter.verified);

    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const industries = [...new Set(recruiters?.map((r) => r.industry).filter(Boolean))];

  const columns = [
    { key: "company_name", label: "Company Name" },
    { key: "contact_person", label: "HR Name" },
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
      key: "id",
      label: "Active Jobs",
      render: (item: any) => {
        const activeJobCount = opportunities?.filter(
          (o) => o.recruiter_id === item.id && o.active
        )?.length || 0;
        return <span>{activeJobCount}</span>;
      },
    },
  ];

  return (
    <DashboardLayout sidebar={<STOSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">State Recruiter Oversight</h1>
          <p className="text-muted-foreground">Monitor recruiters in your state</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recruiters?.filter((r) => r.verified)?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {opportunities?.filter((o) => o.active)?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>State Recruiter Directory</CardTitle>
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
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
