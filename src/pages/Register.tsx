import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { Marquee } from "@/components/landing/Marquee";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import { indianStates, stateDistricts } from "@/data/indianStates";

// Define base fields
const baseFields = {
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  role: z.enum(["student", "recruiter", "nto", "sto", "dto", "college_placement", "dept_coordinator"]),
};

const registerSchema = z.discriminatedUnion("role", [
  z.object({ ...baseFields, role: z.literal("student"), abcId: z.string().min(1, "ABC ID is required"), enrollmentNumber: z.string().min(1, "Enrollment number is required"), collegeId: z.string().min(1, "College is required"), departmentId: z.string().optional(), yearSemester: z.string().min(1, "Year/Semester is required") }),
  z.object({ ...baseFields, role: z.literal("recruiter"), companyName: z.string().min(1, "Company name is required"), companyWebsite: z.string().optional(), industry: z.string().optional() }),
  z.object({ ...baseFields, role: z.literal("nto"), nationalOfficerId: z.string().min(1, "National Officer ID is required") }),
  z.object({ ...baseFields, role: z.literal("sto"), state: z.string().min(1, "State is required"), stateOfficerId: z.string().min(1, "State Officer ID is required") }),
  z.object({ ...baseFields, role: z.literal("dto"), state: z.string().min(1, "State is required"), district: z.string().min(1, "District is required"), districtOfficerId: z.string().min(1, "District Officer ID is required") }),
  z.object({ ...baseFields, role: z.literal("college_placement"), collegeRegistrationNumber: z.string().min(1, "College Registration Number is required"), collegeName: z.string().min(1, "College Name is required"), state: z.string().min(1, "State is required"), district: z.string().min(1, "District is required") }),
  z.object({ ...baseFields, role: z.literal("dept_coordinator"), collegeId: z.string().min(1, "College is required"), departmentName: z.string().min(1, "Department name is required") }),
]).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const [formData, setFormData] = useState<Record<string, string>>({ fullName: "", email: "", password: "", confirmPassword: "", mobileNumber: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [colleges, setColleges] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);
  useEffect(() => { fetchColleges(); }, []);
  useEffect(() => { setDistricts(selectedState && stateDistricts[selectedState] ? stateDistricts[selectedState] : []); }, [selectedState]);
  useEffect(() => { if (formData.collegeId) fetchDepartments(formData.collegeId); }, [formData.collegeId]);

  const fetchColleges = async () => {
    const { data } = await supabase
      .from('colleges')
      .select('*')
      .eq('approved', true)
      .order('name');
    setColleges(data || []);
  };

  const fetchDepartments = async (collegeId: string) => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('college_id', collegeId)
      .order('name');
    
    if (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    }
    setDepartments(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = registerSchema.parse(formData);
      setLoading(true);
      
      const metadata: Record<string, any> = { role: validated.role, mobile_number: validated.mobileNumber };
      
      if (validated.role === 'student') {
        Object.assign(metadata, { abc_id: validated.abcId, enrollment_number: validated.enrollmentNumber, year_semester: validated.yearSemester });
      } else if (validated.role === 'recruiter') {
        Object.assign(metadata, { company_name: validated.companyName, company_website: validated.companyWebsite, industry: validated.industry });
      } else if (validated.role === 'nto') {
        metadata.national_officer_id = validated.nationalOfficerId;
      } else if (validated.role === 'sto') {
        Object.assign(metadata, { state: validated.state, state_officer_id: validated.stateOfficerId });
      } else if (validated.role === 'dto') {
        Object.assign(metadata, { state: validated.state, district: validated.district, district_officer_id: validated.districtOfficerId });
      } else if (validated.role === 'college_placement') {
        Object.assign(metadata, { college_registration_number: validated.collegeRegistrationNumber, college_name: validated.collegeName, state: validated.state, district: validated.district });
      } else if (validated.role === 'dept_coordinator') {
        Object.assign(metadata, { college_id: validated.collegeId, department_name: validated.departmentName });
      }
      
      await signUp(validated.email, validated.password, validated.fullName, metadata);
      
      const messages: Record<string, string> = {
        student: "Your registration is pending approval from your Department Coordinator",
        dept_coordinator: "Your registration is pending approval from your College TPO",
        college_placement: "Your registration is pending approval from your DTO",
        dto: "Your registration is pending approval from your STO",
        sto: "Your registration is pending approval from your NTO",
        nto: "Your registration is pending approval from the Admin",
        recruiter: "Your registration is pending verification"
      };
      toast.success(`Registration successful! ${messages[validated.role]}`);
      navigate('/login');
    } catch (error: any) {
      toast.error(error instanceof z.ZodError ? error.errors[0].message : error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <TopBar />
      <Marquee />
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-hero rounded-lg"><GraduationCap className="h-8 w-8 text-primary-foreground" /></div>
              <span className="font-bold text-2xl">PragatiPath</span>
            </Link>
            <p className="text-muted-foreground">Join the National Training Platform</p>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>Register with your role-specific details</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label>Select Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ fullName: formData.fullName, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword, mobileNumber: formData.mobileNumber, role: value })}>
                    <SelectTrigger><SelectValue placeholder="Choose your role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="recruiter">Recruiter</SelectItem>
                      <SelectItem value="nto">National Training Officer (NTO)</SelectItem>
                      <SelectItem value="sto">State Training Officer (STO)</SelectItem>
                      <SelectItem value="dto">District Training Officer (DTO)</SelectItem>
                      <SelectItem value="college_placement">College TPO</SelectItem>
                      <SelectItem value="dept_coordinator">Department TPO / HOD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.role && (<>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Full Name</Label><Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
                  </div>
                  <div className="space-y-2"><Label>Mobile Number</Label><Input type="tel" value={formData.mobileNumber} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} required /></div>

                  {formData.role === 'nto' && <div className="space-y-2"><Label>National Officer ID</Label><Input value={formData.nationalOfficerId || ''} onChange={(e) => setFormData({ ...formData, nationalOfficerId: e.target.value })} required /></div>}

                  {formData.role === 'sto' && (<>
                    <div className="space-y-2"><Label>State</Label><Select value={formData.state} onValueChange={(v) => { setFormData({ ...formData, state: v }); setSelectedState(v); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-2"><Label>State Officer ID</Label><Input value={formData.stateOfficerId || ''} onChange={(e) => setFormData({ ...formData, stateOfficerId: e.target.value })} required /></div>
                  </>)}

                  {formData.role === 'dto' && (<>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>State</Label><Select value={formData.state} onValueChange={(v) => { setFormData({ ...formData, state: v, district: '' }); setSelectedState(v); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>District</Label><Select value={formData.district} onValueChange={(v) => setFormData({ ...formData, district: v })} disabled={!formData.state}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                    </div>
                    <div className="space-y-2"><Label>District Officer ID</Label><Input value={formData.districtOfficerId || ''} onChange={(e) => setFormData({ ...formData, districtOfficerId: e.target.value })} required /></div>
                  </>)}

                  {formData.role === 'college_placement' && (<>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>College Reg. Number</Label><Input value={formData.collegeRegistrationNumber || ''} onChange={(e) => setFormData({ ...formData, collegeRegistrationNumber: e.target.value })} required /></div>
                      <div className="space-y-2"><Label>College Name</Label><Input value={formData.collegeName || ''} onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })} required /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>State</Label><Select value={formData.state} onValueChange={(v) => { setFormData({ ...formData, state: v, district: '' }); setSelectedState(v); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>District</Label><Select value={formData.district} onValueChange={(v) => setFormData({ ...formData, district: v })} disabled={!formData.state}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                    </div>
                  </>)}

                  {formData.role === 'dept_coordinator' && (<>
                    <div className="space-y-2"><Label>College</Label><Select value={formData.collegeId} onValueChange={(v) => setFormData({ ...formData, collegeId: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{colleges.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-2"><Label>Department Name</Label><Input value={formData.departmentName || ''} onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })} required /></div>
                  </>)}

                  {formData.role === 'student' && (<>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>ABC ID</Label><Input value={formData.abcId || ''} onChange={(e) => setFormData({ ...formData, abcId: e.target.value })} required /></div>
                      <div className="space-y-2"><Label>Enrollment Number</Label><Input value={formData.enrollmentNumber || ''} onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })} required /></div>
                    </div>
                    <div className="space-y-2"><Label>College</Label><Select value={formData.collegeId} onValueChange={(v) => setFormData({ ...formData, collegeId: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{colleges.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                    {formData.collegeId && <div className="space-y-2"><Label>Department (Optional)</Label><Select value={formData.departmentId} onValueChange={(v) => setFormData({ ...formData, departmentId: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent></Select></div>}
                    <div className="space-y-2"><Label>Year / Semester</Label><Select value={formData.yearSemester} onValueChange={(v) => setFormData({ ...formData, yearSemester: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['1st Year / Sem 1', '1st Year / Sem 2', '2nd Year / Sem 3', '2nd Year / Sem 4', '3rd Year / Sem 5', '3rd Year / Sem 6', '4th Year / Sem 7', '4th Year / Sem 8'].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent></Select></div>
                  </>)}

                  {formData.role === 'recruiter' && (<>
                    <div className="space-y-2"><Label>Company Name</Label><Input value={formData.companyName || ''} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Company Website (Optional)</Label><Input type="url" value={formData.companyWebsite || ''} onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })} /></div>
                      <div className="space-y-2"><Label>Industry (Optional)</Label><Input value={formData.industry || ''} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} /></div>
                    </div>
                  </>)}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Password</Label><div className="relative"><Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                    <div className="space-y-2"><Label>Confirm Password</Label><div className="relative"><Input type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-muted-foreground">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                  </div>
                </>)}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full bg-gradient-hero" size="lg" disabled={loading || !formData.role}>{loading ? "Creating Account..." : "Create Account"}</Button>
                <p className="text-sm text-center text-muted-foreground">Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link></p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
