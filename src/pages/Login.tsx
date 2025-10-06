import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { Marquee } from "@/components/landing/Marquee";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, signIn } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse({ email, password });
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <TopBar />
      <Marquee />
      <Navbar />
      
      <div className="flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-icon rounded-2xl flex items-center justify-center shadow-md">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-base">
                Sign in to your PragatiPath account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-secondary/30 border-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline font-medium"
                    onClick={() => toast({ title: "Password Reset", description: "Please contact your administrator for password reset assistance." })}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-secondary/30 border-0"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-hero text-white text-lg font-semibold shadow-glow hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Link to="/register">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 border-2 border-primary text-primary hover:bg-primary hover:text-white text-lg font-semibold transition-all"
                >
                  Create New Account
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
