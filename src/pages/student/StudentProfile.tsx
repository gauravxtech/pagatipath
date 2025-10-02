import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/DashboardLayout';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUploader } from '@/components/shared/FileUploader';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    loadStudentData();
  }, [user]);

  const loadStudentData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setStudent(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: string, data: any) => {
    if (!student) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('students')
        .update(data)
        .eq('id', student.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
      loadStudentData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    const education = student?.education || [];
    setStudent({
      ...student,
      education: [...education, { degree: '', institution: '', year: '', percentage: '' }]
    });
  };

  const removeEducation = (index: number) => {
    const education = [...(student?.education || [])];
    education.splice(index, 1);
    setStudent({ ...student, education });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const education = [...(student?.education || [])];
    education[index] = { ...education[index], [field]: value };
    setStudent({ ...student, education });
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<StudentSidebar />} title="My Profile">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<StudentSidebar />} title="My Profile">
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={student?.full_name || ''}
                    onChange={(e) => setStudent({ ...student, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abc_id">ABC ID</Label>
                  <Input
                    id="abc_id"
                    value={student?.abc_id || ''}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={student?.email || ''}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={student?.phone || ''}
                    onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={student?.dob || ''}
                    onChange={(e) => setStudent({ ...student, dob: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={student?.gender || ''}
                    onValueChange={(value) => setStudent({ ...student, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={student?.state || ''}
                    onChange={(e) => setStudent({ ...student, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={student?.district || ''}
                    onChange={(e) => setStudent({ ...student, district: e.target.value })}
                  />
                </div>
              </div>

              <Button
                onClick={() => handleSave('personal', {
                  full_name: student?.full_name,
                  phone: student?.phone,
                  dob: student?.dob,
                  gender: student?.gender,
                  state: student?.state,
                  district: student?.district,
                })}
                disabled={saving}
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education Details</CardTitle>
              <CardDescription>Add your educational qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(student?.education || []).map((edu: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Education #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Degree/Qualification</Label>
                      <Input
                        value={edu.degree || ''}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="B.Tech Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution || ''}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        placeholder="University Name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        value={edu.year || ''}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        placeholder="2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Percentage/CGPA</Label>
                      <Input
                        value={edu.percentage || ''}
                        onChange={(e) => updateEducation(index, 'percentage', e.target.value)}
                        placeholder="85%"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addEducation}>
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>

              <Button
                onClick={() => handleSave('education', { education: student?.education })}
                disabled={saving}
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Education
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Add your technical and soft skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Textarea
                    id="skills"
                    value={student?.skills?.join(', ') || ''}
                    onChange={(e) => setStudent({ ...student, skills: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="JavaScript, React, Node.js, Python"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domains">Domains of Interest (comma separated)</Label>
                  <Textarea
                    id="domains"
                    value={student?.domains_interested?.join(', ') || ''}
                    onChange={(e) => setStudent({ ...student, domains_interested: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="Web Development, AI/ML, Data Science"
                  />
                </div>

                <Button
                  onClick={() => handleSave('skills', {
                    skills: student?.skills,
                    domains_interested: student?.domains_interested
                  })}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Skills
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>Upload your resume (PDF, max 5MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader
                bucket="resumes"
                path={user?.id || ''}
                accept=".pdf,.doc,.docx"
                maxSize={5}
                currentFile={student?.resume_url}
                onUploadComplete={(url) => handleSave('resume', { resume_url: url })}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
