import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/shared/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Edit, Trash } from 'lucide-react';

export default function RecruiterOpportunities() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'job',
    description: '',
    location: '',
    department: '',
    stipend_min: '',
    stipend_max: '',
    duration_months: '',
    positions_available: '1',
    deadline: '',
    skills_required: '',
  });

  useEffect(() => {
    fetchOpportunities();
  }, [user]);

  const fetchOpportunities = async () => {
    try {
      const { data: recruiterData } = await supabase
        .from('recruiters')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!recruiterData) return;

      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('recruiter_id', recruiterData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: recruiterData } = await supabase
        .from('recruiters')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (!recruiterData) throw new Error('Recruiter profile not found');

      const payload = {
        title: formData.title,
        type: formData.type as any,
        description: formData.description,
        location: formData.location,
        department: formData.department,
        deadline: formData.deadline,
        recruiter_id: recruiterData.id,
        created_by: user?.id,
        stipend_min: formData.stipend_min ? parseInt(formData.stipend_min) : null,
        stipend_max: formData.stipend_max ? parseInt(formData.stipend_max) : null,
        duration_months: formData.duration_months ? parseInt(formData.duration_months) : null,
        positions_available: parseInt(formData.positions_available),
        skills_required: formData.skills_required.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingId) {
        const { error } = await supabase
          .from('opportunities')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Opportunity updated successfully');
      } else {
        const { error } = await supabase
          .from('opportunities')
          .insert(payload);

        if (error) throw error;
        toast.success('Opportunity created successfully');
      }

      setDialogOpen(false);
      resetForm();
      fetchOpportunities();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save opportunity');
    }
  };

  const handleEdit = (opportunity: any) => {
    setEditingId(opportunity.id);
    setFormData({
      title: opportunity.title,
      type: opportunity.type,
      description: opportunity.description || '',
      location: opportunity.location || '',
      department: opportunity.department || '',
      stipend_min: opportunity.stipend_min?.toString() || '',
      stipend_max: opportunity.stipend_max?.toString() || '',
      duration_months: opportunity.duration_months?.toString() || '',
      positions_available: opportunity.positions_available?.toString() || '1',
      deadline: opportunity.deadline || '',
      skills_required: Array.isArray(opportunity.skills_required) 
        ? opportunity.skills_required.join(', ') 
        : '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ active: false })
        .eq('id', id);

      if (error) throw error;
      toast.success('Opportunity deactivated');
      fetchOpportunities();
    } catch (error) {
      toast.error('Failed to delete opportunity');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      type: 'job',
      description: '',
      location: '',
      department: '',
      stipend_min: '',
      stipend_max: '',
      duration_months: '',
      positions_available: '1',
      deadline: '',
      skills_required: '',
    });
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (row: any) => row.title,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row: any) => (
        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary capitalize">
          {row.type}
        </span>
      ),
    },
    {
      key: 'positions',
      label: 'Positions',
      render: (row: any) => row.positions_available,
    },
    {
      key: 'applications',
      label: 'Applications',
      render: (row: any) => row.applications_count || 0,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(row.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Manage Opportunities" sidebar={<div />}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">Post and manage job opportunities</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Post Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit' : 'Post New'} Opportunity</DialogTitle>
                <DialogDescription>
                  Fill in the details to {editingId ? 'update' : 'create'} an opportunity
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stipend_min">Min Stipend/Salary (₹)</Label>
                    <Input
                      id="stipend_min"
                      type="number"
                      value={formData.stipend_min}
                      onChange={(e) => setFormData({ ...formData, stipend_min: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stipend_max">Max Stipend/Salary (₹)</Label>
                    <Input
                      id="stipend_max"
                      type="number"
                      value={formData.stipend_max}
                      onChange={(e) => setFormData({ ...formData, stipend_max: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration_months">Duration (months)</Label>
                    <Input
                      id="duration_months"
                      type="number"
                      value={formData.duration_months}
                      onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="positions_available">Positions *</Label>
                    <Input
                      id="positions_available"
                      type="number"
                      value={formData.positions_available}
                      onChange={(e) => setFormData({ ...formData, positions_available: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="skills_required">Skills Required (comma-separated)</Label>
                  <Input
                    id="skills_required"
                    value={formData.skills_required}
                    onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                    placeholder="React, Node.js, Python"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingId ? 'Update' : 'Create'} Opportunity
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Opportunities</CardTitle>
            <CardDescription>Manage all posted opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={opportunities}
              searchable
              searchPlaceholder="Search opportunities..."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}