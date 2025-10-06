import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/shared/DataTable";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { indianStates, stateDistricts } from "@/data/indianStates";

export default function AdminColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: "",
    code: "",
    state: "",
    district: "",
    address: "",
    phone: "",
    email: "",
    website: ""
  });
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name');

      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      toast.error("Failed to fetch colleges");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCollege = async () => {
    try {
      if (!newCollege.name || !newCollege.code || !newCollege.state || !newCollege.district) {
        toast.error("Please fill in all required fields");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('colleges')
        .insert([{
          ...newCollege,
          approved: true,
          created_by: user?.id
        }]);

      if (error) throw error;

      toast.success("College added successfully");
      setIsAddDialogOpen(false);
      setNewCollege({
        name: "",
        code: "",
        state: "",
        district: "",
        address: "",
        phone: "",
        email: "",
        website: ""
      });
      fetchColleges();
    } catch (error) {
      toast.error("Failed to add college");
      console.error(error);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    { key: 'district', label: 'District', sortable: true },
    { 
      key: 'approved', 
      label: 'Status', 
      render: (college: any) => (
        <Badge variant={college.approved ? 'default' : 'secondary'}>
          {college.approved ? 'Approved' : 'Pending'}
        </Badge>
      )
    },
  ];

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">College Management</h1>
            <p className="text-muted-foreground">Manage registered colleges and institutions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add College
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search colleges by name, code, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Colleges ({colleges.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={colleges} columns={columns} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New College</DialogTitle>
            <DialogDescription>
              Enter the details of the new college or institution
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">College Name *</Label>
                <Input
                  id="name"
                  value={newCollege.name}
                  onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                  placeholder="e.g., ISBM College of Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">College Code *</Label>
                <Input
                  id="code"
                  value={newCollege.code}
                  onChange={(e) => setNewCollege({ ...newCollege, code: e.target.value })}
                  placeholder="e.g., ISBMCOE"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select
                  value={newCollege.state}
                  onValueChange={(value) => {
                    setNewCollege({ ...newCollege, state: value, district: "" });
                    setDistricts(stateDistricts[value] || []);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Select
                  value={newCollege.district}
                  onValueChange={(value) => setNewCollege({ ...newCollege, district: value })}
                  disabled={!newCollege.state}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={newCollege.address}
                onChange={(e) => setNewCollege({ ...newCollege, address: e.target.value })}
                placeholder="Complete address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCollege.phone}
                  onChange={(e) => setNewCollege({ ...newCollege, phone: e.target.value })}
                  placeholder="Contact number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCollege.email}
                  onChange={(e) => setNewCollege({ ...newCollege, email: e.target.value })}
                  placeholder="college@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={newCollege.website}
                onChange={(e) => setNewCollege({ ...newCollege, website: e.target.value })}
                placeholder="https://college.edu"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCollege}>Add College</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
