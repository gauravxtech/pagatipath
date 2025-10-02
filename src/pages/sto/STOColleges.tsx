import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { STOSidebar } from '@/components/sto/STOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Download, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function STOColleges() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState<any[]>([]);
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [stoState, setStoState] = useState('');
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    fetchSTOProfile();
  }, []);

  useEffect(() => {
    if (stoState) {
      fetchColleges();
    }
  }, [stoState]);

  const fetchSTOProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('sto_officers')
        .select('state')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setStoState(data.state);
    } catch (error) {
      toast.error('Failed to fetch profile');
      console.error(error);
    }
  };

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('state', stoState)
        .order('name');

      if (error) throw error;
      
      setColleges(data || []);
      
      // Extract unique districts
      const uniqueDistricts = [...new Set(data?.map(c => c.district).filter(Boolean))] as string[];
      setDistricts(uniqueDistricts);
    } catch (error) {
      toast.error('Failed to fetch colleges');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = colleges.filter(college => {
    const matchesSearch = 
      college.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.district?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterDistrict === 'all' || college.district === filterDistrict;
    
    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      key: 'name',
      label: 'College Name',
      render: (item: any) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground">{item.code}</div>
        </div>
      )
    },
    {
      key: 'district',
      label: 'District',
      render: (item: any) => <Badge variant="outline">{item.district}</Badge>
    },
    {
      key: 'email',
      label: 'Email',
      render: (item: any) => item.email || 'N/A'
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (item: any) => item.phone || 'N/A'
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: any) => item.approved ? 
        <Badge className="bg-green-500">Approved</Badge> : 
        <Badge variant="secondary">Pending</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => (
        <Button size="sm" variant="outline">
          View Details
        </Button>
      )
    }
  ];

  return (
    <DashboardLayout title="Colleges" sidebar={<STOSidebar />}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Colleges in {stoState}</h1>
            <p className="text-muted-foreground">Manage colleges across all districts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchColleges} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{colleges.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {colleges.filter(c => c.approved).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {colleges.filter(c => !c.approved).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Districts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{districts.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, code, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterDistrict} onValueChange={setFilterDistrict}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map(district => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>College Directory</CardTitle>
            <CardDescription>
              {filteredData.length} colleges found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              data={filteredData} 
              columns={columns} 
              searchable={false}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
