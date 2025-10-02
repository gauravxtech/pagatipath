import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PendingApproval = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role, approved')
          .eq('user_id', user.id)
          .single();

        if (userRole) {
          setRole(userRole.role);
          
          // If approved, redirect to dashboard
          if (userRole.approved) {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };

    checkApprovalStatus();

    // Check every 30 seconds if status has changed
    const interval = setInterval(checkApprovalStatus, 30000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const getRoleDisplayName = (roleKey: string) => {
    const roleNames: { [key: string]: string } = {
      'nto': 'National Training Officer',
      'sto': 'State Training Officer',
      'dto': 'District Training Officer',
      'college_placement': 'College TPO',
      'dept_coordinator': 'Department Coordinator',
      'student': 'Student',
      'recruiter': 'Recruiter'
    };
    return roleNames[roleKey] || roleKey;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center">
            <Clock className="h-8 w-8 text-warning" />
          </div>
          <CardTitle className="text-2xl">Pending Approval</CardTitle>
          <CardDescription>Your account is awaiting administrator approval</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Account Type:</span>
              <span className="font-medium">{getRoleDisplayName(role)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Your registration as a <strong>{getRoleDisplayName(role)}</strong> has been submitted successfully. 
              An administrator will review your account shortly.
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              <strong>What happens next?</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Administrator will verify your credentials</li>
              <li>You'll receive an email notification once approved</li>
              <li>This page will automatically update when approved</li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Need help? Contact your administrator
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
