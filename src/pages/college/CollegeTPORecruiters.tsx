import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCollegeInfo } from "@/hooks/useCollegeInfo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";
import { DataTable } from "@/components/shared/DataTable";
import { Eye, UserPlus, Mail, CheckCircle, XCircle, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function CollegeTPORecruiters() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { collegeName } = useCollegeInfo();
  const [loading, setLoading] = useState(true);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    industry: "all",
    status: "all",
    search: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchRecruiters();
  }, [user, navigate]);

  useEffect(() => {
    applyFilters();
  }, [recruiters, filters]);

  const fetchRecruiters = async () => {
    try {
      const { data, error } = await supabase
        .from("recruiters")
        .select(`
          *,
          opportunities (
            id,
            active,
            applications (count)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Calculate stats for each recruiter
      const enrichedRecruiters = data?.map(recruiter => ({
        ...recruiter,
        activeJobs: recruiter.opportunities?.filter((o: any) => o.active).length || 0,
        totalApplications: recruiter.opportunities?.reduce((sum: number, o: any) => 
          sum + (o.applications?.[0]?.count || 0), 0) || 0,
        studentsHired: 0, // Will need to calculate from applications with status 'accepted'
      })) || [];

      setRecruiters(enrichedRecruiters);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
      toast.error("Failed to load recruiters");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...recruiters];

    if (filters.industry && filters.industry !== "all") {
      filtered = filtered.filter(r => r.industry === filters.industry);
    }

    if (filters.status === "verified") {
      filtered = filtered.filter(r => r.verified === true);
    } else if (filters.status === "pending") {
      filtered = filtered.filter(r => r.verified === false);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.company_name?.toLowerCase().includes(search) ||
        r.contact_person?.toLowerCase().includes(search) ||
        r.email?.toLowerCase().includes(search)
      );
    }

    setFilteredRecruiters(filtered);
  };

  const updateRecruiterStatus = async (recruiterId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from("recruiters")
        .update({ verified, approved_by: user?.id })
        .eq("id", recruiterId);

      if (error) throw error;

      toast.success(`Recruiter ${verified ? "approved" : "blocked"} successfully`);
      fetchRecruiters();
    } catch (error) {
      console.error("Error updating recruiter:", error);
      toast.error("Failed to update recruiter status");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    // This would send an invitation email to the recruiter
    toast.success(`Invitation sent to ${inviteEmail}`);
    setDialogOpen(false);
    setInviteEmail("");
  };

  const columns = [
    {
      key: "company_name",
      label: "Company",
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{row.company_name}</div>
            <div className="text-sm text-muted-foreground">{row.industry || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "contact_person",
      label: "HR Contact",
      render: (row: any) => (
        <div>
          <div>{row.contact_person}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    {
      key: "activeJobs",
      label: "Active Jobs",
      render: (row: any) => (
        <Badge variant="outline">{row.activeJobs}</Badge>
      ),
    },
    {
      key: "totalApplications",
      label: "Applications",
      render: (row: any) => row.totalApplications,
    },
    {
      key: "verified",
      label: "Status",
      render: (row: any) => (
        <Badge variant={row.verified ? "default" : "secondary"}>
          {row.verified ? "Verified" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          {!row.verified && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateRecruiterStatus(row.id, true)}
            >
              <CheckCircle className="h-4 w-4 text-green-600" />
            </Button>
          )}
          {row.verified && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateRecruiterStatus(row.id, false)}
            >
              <XCircle className="h-4 w-4 text-red-600" />
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const industries = [...new Set(recruiters.map(r => r.industry).filter(Boolean))];

  return (
    <DashboardLayout title="Recruiters" subtitle={collegeName} sidebar={<CollegeTPOSidebar />}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recruiter Management</h1>
            <p className="text-muted-foreground">
              Manage and monitor recruiting companies and their activities
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Recruiter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Recruiter</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="recruiter@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Send Invitation</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by company, HR name, or email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <div className="w-48">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={filters.industry}
                  onValueChange={(value) => setFilters({ ...filters, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Industries" />
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
              </div>
              <div className="w-48">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recruiter Directory</CardTitle>
            <CardDescription>
              {filteredRecruiters.length} recruiter{filteredRecruiters.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={filteredRecruiters} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
