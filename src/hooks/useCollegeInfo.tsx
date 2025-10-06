import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useCollegeInfo() {
  const { user } = useAuth();
  const [collegeName, setCollegeName] = useState<string>('');
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollegeInfo = async () => {
      if (!user) return;

      try {
        const { data: tpoData } = await supabase
          .from('college_tpo')
          .select('college_id, colleges(name)')
          .eq('user_id', user.id)
          .single();

        if (tpoData?.college_id && tpoData.colleges) {
          setCollegeId(tpoData.college_id);
          setCollegeName((tpoData.colleges as any).name);
        }
      } catch (error) {
        console.error('Error fetching college info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeInfo();
  }, [user]);

  return { collegeName, collegeId, loading };
}
