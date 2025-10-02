import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { FileUploader } from '@/components/shared/FileUploader';

const personalSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
});

const educationSchema = z.object({
  degree: z.string().min(2, 'Degree is required'),
  institution: z.string().min(2, 'Institution is required'),
  year_of_passing: z.string().min(4, 'Year is required'),
  percentage: z.string().min(1, 'Percentage is required'),
});

const skillsSchema = z.object({
  skills: z.string().min(5, 'Add at least one skill'),
  domains_interested: z.string().min(3, 'Add at least one domain'),
});

type Step = 'personal' | 'education' | 'skills' | 'resume';

export function ProfileWizard() {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [education, setEducation] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const personalForm = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      full_name: '',
      dob: '',
      gender: 'Male' as const,
      phone: '',
      state: '',
      district: '',
    },
  });

  const educationForm = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: '',
      institution: '',
      year_of_passing: '',
      percentage: '',
    },
  });

  const skillsForm = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: '',
      domains_interested: '',
    },
  });

  const onPersonalSubmit = async (data: z.infer<typeof personalSchema>) => {
    setLoading(true);
    try {
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (student) {
        setStudentId(student.id);
        await supabase
          .from('students')
          .update({
            full_name: data.full_name,
            dob: data.dob,
            gender: data.gender,
            phone: data.phone,
            state: data.state,
            district: data.district,
          })
          .eq('id', student.id);

        toast.success('Personal information saved');
        setCurrentStep('education');
      }
    } catch (error: any) {
      toast.error('Failed to save: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onEducationSubmit = async (data: z.infer<typeof educationSchema>) => {
    const newEducation = [...education, data];
    setEducation(newEducation);
    educationForm.reset();
    toast.success('Education entry added');
  };

  const saveEducationAndContinue = async () => {
    if (education.length === 0) {
      toast.error('Add at least one education entry');
      return;
    }

    setLoading(true);
    try {
      await supabase
        .from('students')
        .update({ education })
        .eq('user_id', user?.id);

      toast.success('Education saved');
      setCurrentStep('skills');
    } catch (error: any) {
      toast.error('Failed to save: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSkillsSubmit = async (data: z.infer<typeof skillsSchema>) => {
    setLoading(true);
    try {
      const skills = data.skills.split(',').map(s => s.trim());
      const domains = data.domains_interested.split(',').map(d => d.trim());

      await supabase
        .from('students')
        .update({
          skills,
          domains_interested: domains,
        })
        .eq('user_id', user?.id);

      toast.success('Skills saved');
      setCurrentStep('resume');
    } catch (error: any) {
      toast.error('Failed to save: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async () => {
    if (!resumeUrl) {
      toast.error('Please upload your resume');
      return;
    }

    setLoading(true);
    try {
      await supabase
        .from('students')
        .update({
          resume_url: resumeUrl,
          profile_completed: true,
        })
        .eq('user_id', user?.id);

      // Calculate employability score
      if (studentId) {
        await supabase.rpc('calculate_employability_score', { student_id_param: studentId });
      }

      toast.success('Profile completed! 🎉');
      navigate('/student/dashboard');
    } catch (error: any) {
      toast.error('Failed to complete: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'personal', title: 'Personal Info', completed: currentStep !== 'personal' },
    { id: 'education', title: 'Education', completed: ['skills', 'resume'].includes(currentStep) },
    { id: 'skills', title: 'Skills', completed: currentStep === 'resume' },
    { id: 'resume', title: 'Resume', completed: false },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-muted-foreground">Let's get your profile ready for opportunities</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed
                    ? 'bg-primary text-primary-foreground'
                    : currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.completed ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
              </div>
              <span className="text-sm mt-2">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 flex-1 ${step.completed ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Personal Information */}
      {currentStep === 'personal' && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Tell us about yourself</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...personalForm}>
              <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-4">
                <FormField
                  control={personalForm.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={personalForm.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={personalForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="10-digit mobile number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={personalForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalForm.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {currentStep === 'education' && (
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
            <CardDescription>Add your educational qualifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {education.length > 0 && (
              <div className="space-y-2">
                {education.map((edu, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <p className="font-semibold">{edu.degree}</p>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <p className="text-sm">{edu.year_of_passing} • {edu.percentage}%</p>
                  </div>
                ))}
              </div>
            )}
            <Form {...educationForm}>
              <form onSubmit={educationForm.handleSubmit(onEducationSubmit)} className="space-y-4">
                <FormField
                  control={educationForm.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., B.Tech in Computer Science" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={educationForm.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={educationForm.control}
                    name="year_of_passing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year of Passing</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="2024" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={educationForm.control}
                    name="percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentage/CGPA</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="85" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" variant="outline" className="w-full">
                  Add Education
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button onClick={saveEducationAndContinue} className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Skills */}
      {currentStep === 'skills' && (
        <Card>
          <CardHeader>
            <CardTitle>Skills & Interests</CardTitle>
            <CardDescription>What are you good at?</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...skillsForm}>
              <form onSubmit={skillsForm.handleSubmit(onSkillsSubmit)} className="space-y-4">
                <FormField
                  control={skillsForm.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter skills separated by commas (e.g., React, Python, SQL)"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={skillsForm.control}
                  name="domains_interested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domains of Interest</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter domains separated by commas (e.g., Web Development, Data Science, AI)"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Resume Upload */}
      {currentStep === 'resume' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>Upload your latest resume (PDF format)</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader
              bucket="resumes"
              path={`resumes/${user?.id}`}
              accept=".pdf"
              onUploadComplete={(url) => {
                setResumeUrl(url);
                toast.success('Resume uploaded successfully');
              }}
            />
            {resumeUrl && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Resume uploaded successfully!</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={completeProfile} className="w-full" disabled={loading || !resumeUrl}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Profile
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
