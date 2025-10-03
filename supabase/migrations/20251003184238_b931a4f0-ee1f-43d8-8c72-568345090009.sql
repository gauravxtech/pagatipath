-- Fix recruiter approval synchronization issue
-- Use session variables to prevent infinite recursion

-- Function to sync from recruiters table to user_roles
CREATE OR REPLACE FUNCTION sync_recruiter_to_user_roles()
RETURNS TRIGGER AS $$
BEGIN
  -- Only sync if this update wasn't triggered by sync_user_roles_to_recruiter
  IF TG_OP = 'UPDATE' AND OLD.verified IS DISTINCT FROM NEW.verified 
     AND current_setting('app.syncing_recruiter', true) IS DISTINCT FROM 'true' THEN
    
    -- Set flag to prevent recursion
    PERFORM set_config('app.syncing_recruiter', 'true', true);
    
    UPDATE public.user_roles 
    SET 
      approved = NEW.verified,
      approved_by = NEW.approved_by
    WHERE user_id = NEW.user_id AND role = 'recruiter'::app_role;
    
    -- Reset flag
    PERFORM set_config('app.syncing_recruiter', 'false', true);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync from user_roles table to recruiters
CREATE OR REPLACE FUNCTION sync_user_roles_to_recruiter()
RETURNS TRIGGER AS $$
BEGIN
  -- Only sync if this is a recruiter role update and wasn't triggered by sync_recruiter_to_user_roles
  IF TG_OP = 'UPDATE' AND NEW.role = 'recruiter'::app_role 
     AND OLD.approved IS DISTINCT FROM NEW.approved
     AND current_setting('app.syncing_recruiter', true) IS DISTINCT FROM 'true' THEN
    
    -- Set flag to prevent recursion
    PERFORM set_config('app.syncing_recruiter', 'true', true);
    
    UPDATE public.recruiters 
    SET 
      verified = NEW.approved,
      approved_by = NEW.approved_by
    WHERE user_id = NEW.user_id;
    
    -- Reset flag
    PERFORM set_config('app.syncing_recruiter', 'false', true);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to keep both tables in sync
DROP TRIGGER IF EXISTS sync_recruiter_approval_from_recruiters ON public.recruiters;
CREATE TRIGGER sync_recruiter_approval_from_recruiters
  AFTER UPDATE ON public.recruiters
  FOR EACH ROW
  EXECUTE FUNCTION sync_recruiter_to_user_roles();

DROP TRIGGER IF EXISTS sync_recruiter_approval_from_user_roles ON public.user_roles;
CREATE TRIGGER sync_recruiter_approval_from_user_roles
  AFTER UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_roles_to_recruiter();

-- Fix any existing inconsistencies by updating user_roles to match recruiters table
UPDATE public.user_roles 
SET approved = r.verified
FROM public.recruiters r 
WHERE user_roles.user_id = r.user_id 
  AND user_roles.role = 'recruiter'::app_role
  AND user_roles.approved IS DISTINCT FROM r.verified;