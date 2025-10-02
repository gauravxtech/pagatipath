import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Mail, Lock, User, IdCard, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";

const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  abcId: z.string().optional(),
  collegeId: z.string().optional(),
  role: z.string().min(1, "Please select a role"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // ABC ID is required only for students
  if (data.role === 'student' && !data.abcId) {
    return false;
  }
  return true;
}, {
  message: "ABC ID is required for students",
  path: ["abcId"],
}).refine((data) => {
  // College selection is required only for students
  if (data.role === 'student' && !data.collegeId) {
    return false;
  }
  return true;
}, {
  message: "Please select your college",
  path: ["collegeId"],
});

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    abcId: "",
    collegeId: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Load colleges when student role is selected
  useEffect(() => {
    if (formData.role === 'student') {
      loadColleges();
    }
  }, [formData.role]);

  const loadColleges = async () => {
    try {
      setLoadingColleges(true);
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, district, state')
        .eq('approved', true)
        .order('name');

      if (error) throw error;
      setColleges(data || []);
    } catch (error: any) {
      toast.error('Failed to load colleges');
      console.error(error);
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = registerSchema.parse(formData);
      setLoading(true);
      
      const metadata: any = {
        role: validated.role,
      };

      // Only add ABC ID and college for students
      if (validated.role === 'student') {
        metadata.abc_id = validated.abcId;
        metadata.college_id = validated.collegeId;
      }

      await signUp(
        validated.email,
        validated.password,
        validated.fullName,
        metadata
      );
      
      toast.success('Registration successful! Please wait for approval from your administrator.');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">PragatiPath</span>
          </Link>
          <p className="text-muted-foreground">Start your journey to success</p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>Join the national placement platform</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* ABC ID - Only for Students */}
              {formData.role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="abcId">ABC ID</Label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="abcId"
                      placeholder="Your unique ABC ID"
                      value={formData.abcId}
                      onChange={(e) => setFormData({ ...formData, abcId: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="role">I am a...</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value, collegeId: "", abcId: "" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="dept_coordinator">Department Coordinator (HOD/TPC)</SelectItem>
                    <SelectItem value="college_placement">College Placement Cell</SelectItem>
                    <SelectItem value="recruiter">Recruiter / Company</SelectItem>
                    <SelectItem value="dto">District Training Officer (DTO)</SelectItem>
                    <SelectItem value="sto">State Training Officer (STO)</SelectItem>
                    <SelectItem value="nto">National Training Officer (NTO)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {formData.role === '' && 'Choose your role in the PragatiPath ecosystem'}
                  {formData.role === 'student' && 'Your registration will be approved by your department coordinator'}
                  {formData.role === 'dept_coordinator' && 'Your registration will be approved by college placement cell'}
                  {formData.role === 'college_placement' && 'Your registration will be approved by DTO'}
                  {formData.role === 'recruiter' && 'Your registration will be verified by admin'}
                  {formData.role === 'dto' && 'Your registration will be approved by STO'}
                  {formData.role === 'sto' && 'Your registration will be approved by NTO'}
                  {formData.role === 'nto' && 'Your registration will be approved by Admin'}
                </p>
              </div>

              {/* College Selection - Only for Students */}
              {formData.role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="collegeId">College</Label>
                  <Select 
                    value={formData.collegeId} 
                    onValueChange={(value) => setFormData({ ...formData, collegeId: value })}
                    disabled={loadingColleges}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingColleges ? "Loading colleges..." : "Select your college"} />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college.id} value={college.id}>
                          {college.name} - {college.district}, {college.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select the college you are enrolled in
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-gradient-hero" size="lg" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
