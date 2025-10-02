import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Search, Download, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ntoOfficers, setNtoOfficers] = useState([]);
  const [stoOfficers, setStoOfficers] = useState([]);
  const [dtoOfficers, setDtoOfficers] = useState([]);
  const [collegeTpos, setCollegeTpos] = useState([]);
  const [deptCoordinators, setDeptCoordinators] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const [nto, sto, dto, tpo, dept, studs] = await Promise.all([
        supabase.from('nto_officers').select('*'),
        supabase.from('sto_officers').select('*'),
        supabase.from('dto_officers').select('*'),
        supabase.from('college_tpo').select('*'),
        supabase.from('department_coordinators').select('*'),
        supabase.from('students').select('*')
      ]);

      setNtoOfficers(nto.data || []);
      setStoOfficers(sto.data || []);
      setDtoOfficers(dto.data || []);
      setCollegeTpos(tpo.data || []);
      setDeptCoordinators(dept.data || []);
      setStudents(studs.data || []);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserTable = (data: any[], columnKeys: string[]) => {
    const columns = columnKeys.map(key => ({
      key: key.toLowerCase().replace(/\s+/g, '_'),
      label: key,
      render: (item: any) => item[key.toLowerCase().replace(/\s+/g, '_')] || 'N/A'
    }));
    
    return <DataTable data={data} columns={columns} searchable searchPlaceholder="Search..." />;
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage all users across the platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAllUsers} disabled={loading}>
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
              placeholder="Search by name, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="nto" className="space-y-4">
          <TabsList>
            <TabsTrigger value="nto">NTO ({ntoOfficers.length})</TabsTrigger>
            <TabsTrigger value="sto">STO ({stoOfficers.length})</TabsTrigger>
            <TabsTrigger value="dto">DTO ({dtoOfficers.length})</TabsTrigger>
            <TabsTrigger value="tpo">College TPO ({collegeTpos.length})</TabsTrigger>
            <TabsTrigger value="dept">Dept Coordinators ({deptCoordinators.length})</TabsTrigger>
            <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="nto">
            <Card>
              <CardHeader>
                <CardTitle>National Training Officers</CardTitle>
                <CardDescription>Manage NTO accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                {renderUserTable(ntoOfficers, ['Full Name', 'Email', 'National Officer ID', 'Status'])}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sto">
            <Card>
              <CardHeader>
                <CardTitle>State Training Officers</CardTitle>
                <CardDescription>Manage STO accounts by state</CardDescription>
              </CardHeader>
              <CardContent>
                {renderUserTable(stoOfficers, ['Full Name', 'Email', 'State', 'State Officer ID', 'Status'])}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dto">
            <Card>
              <CardHeader>
                <CardTitle>District Training Officers</CardTitle>
                <CardDescription>Manage DTO accounts by district</CardDescription>
              </CardHeader>
              <CardContent>
                {renderUserTable(dtoOfficers, ['Full Name', 'Email', 'State', 'District', 'District Officer ID'])}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tpo">
            <Card>
              <CardHeader>
                <CardTitle>College Training & Placement Officers</CardTitle>
                <CardDescription>Manage college TPO accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {renderUserTable(collegeTpos, ['TPO Full Name', 'Email', 'College Registration Number', 'Status'])}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dept">
            <Card>
              <CardHeader>
                <CardTitle>Department Coordinators</CardTitle>
                <CardDescription>Manage department-level coordinators</CardDescription>
              </CardHeader>
              <CardContent>
                {renderUserTable(deptCoordinators, ['Coordinator Name', 'Email', 'Department Name', 'Status'])}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>Manage student accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {renderUserTable(students, ['Full Name', 'Email', 'ABC ID', 'Enrollment Number', 'Status'])}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
