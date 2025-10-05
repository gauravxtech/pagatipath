import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ApprovalStatus {
  userRole: any;
  recruiterData: any;
  lastChecked: string;
}

export function ApprovalStatusDebug() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ApprovalStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Check user_roles table
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role, approved, approved_by, created_at, updated_at')
        .eq('user_id', user.id)
        .maybeSingle();

      // Check recruiters table if user is a recruiter
      let recruiterData = null;
      if (userRole?.role === 'recruiter') {
        const { data, error } = await supabase
          .from('recruiters')
          .select('verified, approved_by, created_at, updated_at')
          .eq('user_id', user.id)
          .maybeSingle();
        recruiterData = data;
      }

      setStatus({
        userRole,
        recruiterData,
        lastChecked: new Date().toISOString()
      });
    } catch (error) {
      console.error('Debug check error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [user]);

  if (!user) return null;

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          Approval Status Debug
          <Button 
            size="sm" 
            variant="outline" 
            onClick={checkStatus}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>User ID:</strong> {user.id}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        {status && (
          <>
            <div>
              <strong>Last Checked:</strong> {new Date(status.lastChecked).toLocaleString()}
            </div>
            <div>
              <strong>User Role Data:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(status.userRole, null, 2)}
              </pre>
            </div>
            {status.recruiterData && (
              <div>
                <strong>Recruiter Data:</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(status.recruiterData, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}