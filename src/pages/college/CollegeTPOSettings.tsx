import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CollegeTPOSidebar } from "@/components/college/CollegeTPOSidebar";

export default function CollegeTPOSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tpoData, setTpoData] = useState<any>(null);
  const [collegeData, setCollegeData] = useState<any>(null);
  const [profileData, setProfileData] = useState({
    tpo_full_name: "",
    email: "",
    mobile_number: "",
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
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const { data: tpo, error: tpoError } = await supabase
        .from("college_tpo")
        .select(`
          *,
          colleges (
            name,
            code,
            state,
            district
          )
        `)
        .eq("user_id", user?.id)
        .single();

      if (tpoError) throw tpoError;
      
      setTpoData(tpo);
      setCollegeData(tpo.colleges);
      setProfileData({
        tpo_full_name: tpo.tpo_full_name || "",
        email: tpo.email || "",
        mobile_number: tpo.mobile_number || "",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load profile data");
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("college_tpo")
        .update(profileData)
        .eq("user_id", user?.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully");
      fetchData();
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
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;
      
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CollegeTPOSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <Tabs defaultValue="profile" className="max-w-2xl">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="college">College Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">TPO Profile</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.tpo_full_name}
                      onChange={(e) => setProfileData({ ...profileData, tpo_full_name: e.target.value })}
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
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={profileData.mobile_number}
                      onChange={(e) => setProfileData({ ...profileData, mobile_number: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="college">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">College Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label>College Name</Label>
                    <p className="text-lg">{collegeData?.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Registration Number</Label>
                    <p className="text-lg">{collegeData?.code || "N/A"}</p>
                  </div>
                  <div>
                    <Label>State</Label>
                    <p className="text-lg">{collegeData?.state || "N/A"}</p>
                  </div>
                  <div>
                    <Label>District</Label>
                    <p className="text-lg">{collegeData?.district || "N/A"}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="current">Current Password</Label>
                    <Input
                      id="current"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="new">New Password</Label>
                    <Input
                      id="new"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
}
