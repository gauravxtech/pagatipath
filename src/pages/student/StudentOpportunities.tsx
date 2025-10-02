import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { DataTable } from '@/components/shared/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Briefcase, MapPin, DollarSign, Clock, Loader2 } from 'lucide-react';

export default function StudentOpportunities() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    loadOpportunities();
    loadStudent();
  }, []);

  const loadStudent = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', user.id)
      .single();
    setStudent(data);
  };

  const loadOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*, recruiters(company_name)')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedOpp || !student) return;

    setApplying(true);
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          student_id: student.id,
          opportunity_id: selectedOpp.id,
          cover_letter: coverLetter,
          status: 'applied'
        });

      if (error) throw error;
      toast.success('Application submitted successfully!');
      setSelectedOpp(null);
      setCoverLetter('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setApplying(false);
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Position',
      sortable: true,
      render: (opp: any) => (
        <div>
          <p className="font-medium">{opp.title}</p>
          <p className="text-sm text-muted-foreground">{opp.recruiters?.company_name}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (opp: any) => (
        <Badge variant={opp.type === 'internship' ? 'secondary' : 'default'}>
          {opp.type}
        </Badge>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (opp: any) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{opp.location || 'Not specified'}</span>
        </div>
      ),
    },
    {
      key: 'stipend',
      label: 'Stipend',
      render: (opp: any) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>
            {opp.stipend_min && opp.stipend_max
              ? `₹${opp.stipend_min} - ₹${opp.stipend_max}`
              : 'Not disclosed'}
          </span>
        </div>
      ),
    },
    {
      key: 'deadline',
      label: 'Deadline',
      render: (opp: any) => (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Open'}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (opp: any) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setSelectedOpp(opp)}>
              Apply
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{opp.title}</DialogTitle>
              <DialogDescription>{opp.recruiters?.company_name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{opp.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {opp.skills_required?.map((skill: string, i: number) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover_letter">Cover Letter (Optional)</Label>
                <Textarea
                  id="cover_letter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're a great fit for this position..."
                  rows={5}
                />
              </div>
              <Button
                onClick={handleApply}
                disabled={applying}
                className="w-full"
              >
                {applying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  return (
    <DashboardLayout sidebar={<StudentSidebar />} title="Opportunities">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Available Opportunities
            </CardTitle>
            <CardDescription>
              Browse and apply to internships and jobs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                data={opportunities}
                columns={columns}
                searchable
                searchPlaceholder="Search opportunities..."
                pageSize={10}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
