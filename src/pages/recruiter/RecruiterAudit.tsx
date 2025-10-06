import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRecruiterInfo } from "@/hooks/useRecruiterInfo";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/DataTable";

export default function RecruiterAudit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companyName } = useRecruiterInfo();
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
    const csv = [
      ["Action", "Entity Type", "Entity ID", "Timestamp", "IP Address"],
      ...auditLogs.map(log => [
        log.action,
        log.entity_type,
        log.entity_id,
        new Date(log.created_at).toLocaleString(),
        log.ip_address
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  const columns = [
    {
      key: 'action',
      label: 'Action',
    },
    {
      key: 'entity_type',
      label: 'Entity Type',
    },
    {
      key: 'created_at',
      label: 'Timestamp',
      render: (row: any) => new Date(row.created_at).toLocaleString(),
    },
    {
      key: 'ip_address',
      label: 'IP Address',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout sidebar={<RecruiterSidebar />} title="Audit Logs" subtitle={companyName}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<RecruiterSidebar />} title="Audit Logs" subtitle={companyName}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">View your activity history</p>
          <Button onClick={exportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={fetchAuditLogs} className="mb-4">
            Apply Filters
          </Button>

          <DataTable data={auditLogs} columns={columns} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
