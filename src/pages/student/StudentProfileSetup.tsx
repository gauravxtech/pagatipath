import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileWizard } from '@/components/student/ProfileWizard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function StudentProfileSetup() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkProfileCompletion();
  }, [user]);

  const checkProfileCompletion = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const { data: student } = await supabase
      .from('students')
      .select('profile_completed')
      .eq('user_id', user.id)
      .single();

    if (student?.profile_completed) {
      navigate('/student/dashboard');
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <ProfileWizard />;
}
