import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useRecruiterInfo() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState<string>('');
  const [recruiterId, setRecruiterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterInfo = async () => {
      if (!user) return;

      try {
        const { data: recruiterData } = await supabase
          .from('recruiters')
          .select('id, company_name')
          .eq('user_id', user.id)
          .single();

        if (recruiterData) {
          setRecruiterId(recruiterData.id);
          setCompanyName(recruiterData.company_name);
        }
      } catch (error) {
        console.error('Error fetching recruiter info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterInfo();
  }, [user]);

  return { companyName, recruiterId, loading };
}
