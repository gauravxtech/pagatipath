import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRecruiterInfo } from "@/hooks/useRecruiterInfo";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { RecruiterSidebar } from "@/components/recruiter/RecruiterSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function RecruiterSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companyName } = useRecruiterInfo();
  const [loading, setLoading] = useState(false);
  const [recruiterData, setRecruiterData] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    mobile_number: "",
    company_website: "",
    industry: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchRecruiterData();
  }, [user, navigate]);

  const fetchRecruiterData = async () => {
    try {
      const { data, error } = await supabase
        .from("recruiters")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      
      setRecruiterData(data);
      setProfileData({
        company_name: data.company_name || "",
        contact_person: data.contact_person || "",
        email: data.email || "",
        mobile_number: data.mobile_number || "",
        company_website: data.company_website || "",
        industry: data.industry || "",
      });
    } catch (error) {
      console.error("Error fetching recruiter data:", error);
      toast.error("Failed to load profile data");
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("recruiters")
        .update(profileData)
        .eq("user_id", user?.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;
      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout sidebar={<RecruiterSidebar />} title="Settings" subtitle={companyName}>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={profileData.company_name}
                  onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={profileData.contact_person}
                  onChange={(e) => setProfileData({ ...profileData, contact_person: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input
                  id="mobile_number"
                  value={profileData.mobile_number}
                  onChange={(e) => setProfileData({ ...profileData, mobile_number: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="company_website">Company Website</Label>
                <Input
                  id="company_website"
                  type="url"
                  value={profileData.company_website}
                  onChange={(e) => setProfileData({ ...profileData, company_website: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={profileData.industry}
                  onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="current_password">Current Password</Label>
                <Input
                  id="current_password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
