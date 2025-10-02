import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Get user role from user_roles table
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (userRole) {
          // Route based on role
          switch (userRole.role) {
            case 'student':
              navigate('/student/dashboard');
              break;
            case 'recruiter':
              navigate('/recruiter/dashboard');
              break;
            case 'college_placement':
              navigate('/college/dashboard');
              break;
            case 'dept_coordinator':
              navigate('/department/dashboard');
              break;
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'dto':
              navigate('/dto/dashboard');
              break;
            case 'sto':
              navigate('/sto/dashboard');
              break;
            case 'nto':
              navigate('/nto/dashboard');
              break;
            default:
              navigate('/');
          }
        }
      } catch (error) {
        console.error('Error checking user role:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
};

export default Dashboard;
