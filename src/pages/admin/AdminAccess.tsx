import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminAccess() {
  const [permissions, setPermissions] = useState({
    nto: { viewAll: true, approve: true, reports: true },
    sto: { viewDistrict: true, approve: true, reports: true },
    dto: { approveTPO: true, viewCollege: true, reports: true },
    tpo: { approveCoord: true, manageStudents: true, reports: true }
  });

  const handleSavePermissions = () => {
    toast.success("Permissions updated successfully");
  };
  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Access Control</h1>
          <p className="text-muted-foreground">Manage roles and permissions</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>NTO Permissions</CardTitle>
              <CardDescription>National Training Officer access rights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>View All STO Data</Label>
                <Switch 
                  checked={permissions.nto.viewAll}
                  onCheckedChange={(checked) => setPermissions({...permissions, nto: {...permissions.nto, viewAll: checked}})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Approve STO Accounts</Label>
                <Switch 
                  checked={permissions.nto.approve}
                  onCheckedChange={(checked) => setPermissions({...permissions, nto: {...permissions.nto, approve: checked}})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Generate Reports</Label>
                <Switch 
                  checked={permissions.nto.reports}
                  onCheckedChange={(checked) => setPermissions({...permissions, nto: {...permissions.nto, reports: checked}})}
                />
              </div>
              <Button className="w-full" onClick={handleSavePermissions}>
                <Save className="mr-2 h-4 w-4" />Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>STO Permissions</CardTitle>
              <CardDescription>State Training Officer access rights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>View District Data</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Approve DTO Accounts</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Generate State Reports</Label>
                <Switch defaultChecked />
              </div>
              <Button className="w-full"><Save className="mr-2 h-4 w-4" />Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DTO Permissions</CardTitle>
              <CardDescription>District Training Officer access rights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Approve College TPOs</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>View College Data</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Generate District Reports</Label>
                <Switch defaultChecked />
              </div>
              <Button className="w-full"><Save className="mr-2 h-4 w-4" />Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>College TPO Permissions</CardTitle>
              <CardDescription>College placement officer access rights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Approve Department Coordinators</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Manage Student Data</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Generate College Reports</Label>
                <Switch defaultChecked />
              </div>
              <Button className="w-full"><Save className="mr-2 h-4 w-4" />Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
