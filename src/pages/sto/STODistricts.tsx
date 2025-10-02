import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { STOSidebar } from '@/components/sto/STOSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Download, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function STODistricts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dtoOfficers, setDtoOfficers] = useState<any[]>([]);
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [stoState, setStoState] = useState('');

  useEffect(() => {
    fetchSTOProfile();
  }, []);

  useEffect(() => {
    if (stoState) {
      fetchDTOs();
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

  const fetchDTOs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('dto_officers')
        .select('*')
        .eq('state', stoState)
        .order('district');

      const { data, error } = await query;

      if (error) throw error;
      setDtoOfficers(data || []);
    } catch (error) {
      toast.error('Failed to fetch DTOs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error: officerError } = await supabase
        .from('dto_officers')
        .update({ approved: !currentStatus })
        .eq('user_id', userId);
      
      if (officerError) throw officerError;
      
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ approved: !currentStatus })
        .eq('user_id', userId);
      
      if (roleError) throw roleError;
      
      toast.success(`DTO ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      fetchDTOs();
    } catch (error) {
      toast.error('Failed to update DTO status');
      console.error(error);
    }
  };

  const filteredData = dtoOfficers.filter(dto => {
    const matchesSearch = 
      dto.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dto.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dto.district?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterDistrict === 'all' ||
      (filterDistrict === 'active' && dto.approved) ||
      (filterDistrict === 'inactive' && !dto.approved);
    
    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      key: 'full_name',
      label: 'Name',
      render: (item: any) => item.full_name
    },
    {
      key: 'email',
      label: 'Email',
      render: (item: any) => item.email
    },
    {
      key: 'mobile_number',
      label: 'Mobile',
      render: (item: any) => item.mobile_number
    },
    {
      key: 'district',
      label: 'District',
      render: (item: any) => <Badge variant="outline">{item.district}</Badge>
    },
    {
      key: 'district_officer_id',
      label: 'Officer ID',
      render: (item: any) => item.district_officer_id
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: any) => item.approved ? 
        <Badge className="bg-green-500">Active</Badge> : 
        <Badge variant="secondary">Inactive</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={item.approved ? "outline" : "default"}
            onClick={() => handleToggleStatus(item.user_id, item.approved)}
          >
            {item.approved ? 'Disable' : 'Enable'}
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title="District Officers" sidebar={<STOSidebar />}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">District Training Officers</h1>
            <p className="text-muted-foreground">Manage DTOs in {stoState}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchDTOs} disabled={loading}>
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
              placeholder="Search by name, email, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterDistrict} onValueChange={setFilterDistrict}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All DTOs</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>DTO List - {stoState}</CardTitle>
            <CardDescription>
              {filteredData.length} DTOs found
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
