import React from "react";
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
import PendingApproval from "./pages/PendingApproval";
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
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import RecruiterInterviews from "./pages/recruiter/RecruiterInterviews";
import RecruiterHired from "./pages/recruiter/RecruiterHired";
import RecruiterReports from "./pages/recruiter/RecruiterReports";
import RecruiterNotifications from "./pages/recruiter/RecruiterNotifications";
import RecruiterAudit from "./pages/recruiter/RecruiterAudit";
import RecruiterSettings from "./pages/recruiter/RecruiterSettings";
import CollegeDashboard from "./pages/college/CollegeDashboard";
import CollegeTPODashboard from "./pages/college/CollegeTPODashboard";
import CollegeTPODepartments from "./pages/college/CollegeTPODepartments";
import CollegeTPOStudents from "./pages/college/CollegeTPOStudents";
import CollegeTPOJobs from "./pages/college/CollegeTPOJobs";
import CollegeTPOApplications from "./pages/college/CollegeTPOApplications";
import CollegeTPOInterviews from "./pages/college/CollegeTPOInterviews";
import CollegeTPOReports from "./pages/college/CollegeTPOReports";
import CollegeTPONotifications from "./pages/college/CollegeTPONotifications";
import CollegeTPOAudit from "./pages/college/CollegeTPOAudit";
import CollegeTPOSettings from "./pages/college/CollegeTPOSettings";
import CollegeTPORecruiters from "./pages/college/CollegeTPORecruiters";
import DepartmentDashboard from "./pages/department/DepartmentDashboard";
import DTODashboard from "./pages/dto/DTODashboard";
import DTOColleges from "./pages/dto/DTOColleges";
import DTODepartments from "./pages/dto/DTODepartments";
import DTOStudents from "./pages/dto/DTOStudents";
import DTOReports from "./pages/dto/DTOReports";
import DTONotifications from "./pages/dto/DTONotifications";
import DTOAudit from "./pages/dto/DTOAudit";
import DTOSettings from "./pages/dto/DTOSettings";
import STODashboard from "./pages/sto/STODashboard";
import STODistricts from "./pages/sto/STODistricts";
import STOColleges from "./pages/sto/STOColleges";
import STOStudents from "./pages/sto/STOStudents";
import STOReports from "./pages/sto/STOReports";
import STOAnalytics from "./pages/sto/STOAnalytics";
import STOSettings from "./pages/sto/STOSettings";
import NTODashboard from "./pages/nto/NTODashboard";
import NTOStates from "./pages/nto/NTOStates";
import NTODistricts from "./pages/nto/NTODistricts";
import NTOColleges from "./pages/nto/NTOColleges";
import NTOReports from "./pages/nto/NTOReports";
import NTONotifications from "./pages/nto/NTONotifications";
import NTOAudit from "./pages/nto/NTOAudit";
import NTOSettings from "./pages/nto/NTOSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminColleges from "./pages/admin/AdminColleges";
import AdminReports from "./pages/admin/AdminReports";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminAccess from "./pages/admin/AdminAccess";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminHelp from "./pages/admin/AdminHelp";
import AdminRecruiters from "./pages/admin/AdminRecruiters";
import NTORecruiters from "./pages/nto/NTORecruiters";
import STORecruiters from "./pages/sto/STORecruiters";
import DTORecruiters from "./pages/dto/DTORecruiters";
import AboutUs from "./pages/AboutUs";
import HowItWorksPage from "./pages/HowItWorks";
import FeaturesPage from "./pages/Features";
import PartnersPage from "./pages/Partners";
import ContactPage from "./pages/Contact";
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
            <Route path="/about" element={<AboutUs />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pending-approval" element={<PendingApproval />} />

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
            <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
            <Route path="/recruiter/opportunities" element={<RecruiterOpportunities />} />
            <Route path="/recruiter/applications" element={<RecruiterApplications />} />
            <Route path="/recruiter/interviews" element={<RecruiterInterviews />} />
            <Route path="/recruiter/hired" element={<RecruiterHired />} />
            <Route path="/recruiter/reports" element={<RecruiterReports />} />
            <Route path="/recruiter/notifications" element={<RecruiterNotifications />} />
            <Route path="/recruiter/audit" element={<RecruiterAudit />} />
            <Route path="/recruiter/settings" element={<RecruiterSettings />} />

            {/* College Routes */}
            <Route path="/college/dashboard" element={<CollegeDashboard />} />

            {/* College TPO Routes */}
            <Route path="/clg-tpo/dashboard" element={<CollegeTPODashboard />} />
            <Route path="/clg-tpo/recruiters" element={<CollegeTPORecruiters />} />
            <Route path="/clg-tpo/jobs" element={<CollegeTPOJobs />} />
            <Route path="/clg-tpo/departments" element={<CollegeTPODepartments />} />
            <Route path="/clg-tpo/students" element={<CollegeTPOStudents />} />
            <Route path="/clg-tpo/applications" element={<CollegeTPOApplications />} />
            <Route path="/clg-tpo/interviews" element={<CollegeTPOInterviews />} />
            <Route path="/clg-tpo/reports" element={<CollegeTPOReports />} />
            <Route path="/clg-tpo/notifications" element={<CollegeTPONotifications />} />
            <Route path="/clg-tpo/audit" element={<CollegeTPOAudit />} />
            <Route path="/clg-tpo/settings" element={<CollegeTPOSettings />} />

            {/* Department Routes */}
            <Route path="/department/dashboard" element={<DepartmentDashboard />} />

            {/* DTO Routes */}
            <Route path="/dto/dashboard" element={<DTODashboard />} />
            <Route path="/dto/colleges" element={<DTOColleges />} />
            <Route path="/dto/departments" element={<DTODepartments />} />
            <Route path="/dto/students" element={<DTOStudents />} />
            <Route path="/dto/recruiters" element={<DTORecruiters />} />
            <Route path="/dto/reports" element={<DTOReports />} />
            <Route path="/dto/notifications" element={<DTONotifications />} />
            <Route path="/dto/audit" element={<DTOAudit />} />
            <Route path="/dto/settings" element={<DTOSettings />} />

            {/* STO Routes */}
            <Route path="/sto/dashboard" element={<STODashboard />} />
            <Route path="/sto/districts" element={<STODistricts />} />
            <Route path="/sto/colleges" element={<STOColleges />} />
            <Route path="/sto/students" element={<STOStudents />} />
            <Route path="/sto/recruiters" element={<STORecruiters />} />
            <Route path="/sto/reports" element={<STOReports />} />
            <Route path="/sto/analytics" element={<STOAnalytics />} />
            <Route path="/sto/settings" element={<STOSettings />} />

            {/* NTO Routes */}
            <Route path="/nto/dashboard" element={<NTODashboard />} />
            <Route path="/nto/states" element={<NTOStates />} />
            <Route path="/nto/districts" element={<NTODistricts />} />
            <Route path="/nto/colleges" element={<NTOColleges />} />
            <Route path="/nto/recruiters" element={<NTORecruiters />} />
            <Route path="/nto/reports" element={<NTOReports />} />
            <Route path="/nto/notifications" element={<NTONotifications />} />
            <Route path="/nto/audit" element={<NTOAudit />} />
            <Route path="/nto/settings" element={<NTOSettings />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/colleges" element={<AdminColleges />} />
            <Route path="/admin/recruiters" element={<AdminRecruiters />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/audit" element={<AdminAudit />} />
            <Route path="/admin/access" element={<AdminAccess />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/help" element={<AdminHelp />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider >
);

export default App;
