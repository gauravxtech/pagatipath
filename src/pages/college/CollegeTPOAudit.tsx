import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCollegeInfo } from "@/hooks/useCollegeInfo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";
import { DataTable } from "@/components/shared/DataTable";

export default function CollegeTPOAudit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { collegeName } = useCollegeInfo();
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchAuditLogs();
  }, [user, navigate]);

  const fetchAuditLogs = async () => {
    try {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (filters.startDate) {
        query = query.gte("created_at", filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte("created_at", filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const headers = ["Action", "Entity Type", "Details", "IP Address", "Timestamp"];
    const rows = auditLogs.map(log => [
      log.action,
      log.entity_type,
      JSON.stringify(log.details),
      log.ip_address || "N/A",
      new Date(log.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    
    toast.success("Logs exported successfully");
  };

  const columns = [
    {
      key: "action",
      label: "Action",
      sortable: true,
    },
    {
      key: "entity_type",
      label: "Entity Type",
      sortable: true,
    },
    {
      key: "details",
      label: "Details",
      render: (row: any) => JSON.stringify(row.details).substring(0, 50) + "...",
    },
    {
      key: "ip_address",
      label: "IP Address",
      render: (row: any) => row.ip_address || "N/A",
    },
    {
      key: "created_at",
      label: "Timestamp",
      render: (row: any) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout title="Audit Logs" subtitle={collegeName} sidebar={<CollegeTPOSidebar />}>
      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={fetchAuditLogs}>Apply Filters</Button>
            <Button variant="outline" onClick={exportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <DataTable
          data={auditLogs}
          columns={columns}
          searchable
          searchPlaceholder="Search logs..."
        />
      </Card>
    </DashboardLayout>
  );
}
