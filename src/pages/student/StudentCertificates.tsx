import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Award, Download, Loader2 } from 'lucide-react';

export default function StudentCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    if (!user) return;

    try {
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!student) return;

      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', student.id)
        .order('issued_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, title: string) => {
    window.open(url, '_blank');
    toast.success(`Downloading ${title}`);
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<StudentSidebar />} title="Certificates">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<StudentSidebar />} title="Certificates">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            My Certificates
          </CardTitle>
          <CardDescription>
            View and download your earned certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
              <p className="text-muted-foreground">
                Complete internships and training programs to earn certificates
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {certificates.map((cert) => (
                <Card key={cert.id} className="overflow-hidden">
                  <div className="bg-gradient-hero p-4">
                    <Award className="h-8 w-8 text-primary-foreground mb-2" />
                    <h3 className="text-lg font-semibold text-primary-foreground">
                      {cert.title}
                    </h3>
                  </div>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <Badge>{cert.type}</Badge>
                      </div>
                      {cert.description && (
                        <p className="text-sm text-muted-foreground">
                          {cert.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Issued: {new Date(cert.issued_at).toLocaleDateString()}
                        </span>
                      </div>
                      {cert.certificate_url && (
                        <Button
                          className="w-full"
                          onClick={() => handleDownload(cert.certificate_url, cert.title)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Certificate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
