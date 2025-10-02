import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentProfileSetup from "./pages/student/StudentProfileSetup";
import StudentOpportunities from "./pages/student/StudentOpportunities";
import StudentApplications from "./pages/student/StudentApplications";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentSupport from "./pages/student/StudentSupport";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterOpportunities from "./pages/recruiter/RecruiterOpportunities";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import CollegeDashboard from "./pages/college/CollegeDashboard";
import DepartmentDashboard from "./pages/department/DepartmentDashboard";
import DTODashboard from "./pages/dto/DTODashboard";
import STODashboard from "./pages/sto/STODashboard";
import NTODashboard from "./pages/nto/NTODashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/profile-setup" element={<StudentProfileSetup />} />
            <Route path="/student/opportunities" element={<StudentOpportunities />} />
            <Route path="/student/applications" element={<StudentApplications />} />
            <Route path="/student/certificates" element={<StudentCertificates />} />
            <Route path="/student/support" element={<StudentSupport />} />
            
            {/* Recruiter Routes */}
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/opportunities" element={<RecruiterOpportunities />} />
            <Route path="/recruiter/applications" element={<RecruiterApplications />} />
            
            {/* College Routes */}
            <Route path="/college/dashboard" element={<CollegeDashboard />} />
            
            {/* Department Routes */}
            <Route path="/department/dashboard" element={<DepartmentDashboard />} />
            
            {/* DTO Routes */}
            <Route path="/dto/dashboard" element={<DTODashboard />} />
            
            {/* STO Routes */}
            <Route path="/sto/dashboard" element={<STODashboard />} />
            
            {/* NTO Routes */}
            <Route path="/nto/dashboard" element={<NTODashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
