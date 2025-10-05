-- Fix search_path security warnings for sync functions
CREATE OR REPLACE FUNCTION sync_recruiter_to_user_roles()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.verified IS DISTINCT FROM NEW.verified 
     AND current_setting('app.syncing_recruiter', true) IS DISTINCT FROM 'true' THEN
    
    PERFORM set_config('app.syncing_recruiter', 'true', true);
    
    UPDATE public.user_roles 
    SET 
      approved = NEW.verified,
      approved_by = NEW.approved_by
    WHERE user_id = NEW.user_id AND role = 'recruiter'::app_role;
    
    PERFORM set_config('app.syncing_recruiter', 'false', true);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION sync_user_roles_to_recruiter()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.role = 'recruiter'::app_role 
     AND OLD.approved IS DISTINCT FROM NEW.approved
     AND current_setting('app.syncing_recruiter', true) IS DISTINCT FROM 'true' THEN
    
    PERFORM set_config('app.syncing_recruiter', 'true', true);
    
    UPDATE public.recruiters 
    SET 
      verified = NEW.approved,
      approved_by = NEW.approved_by
    WHERE user_id = NEW.user_id;
    
    PERFORM set_config('app.syncing_recruiter', 'false', true);
  END IF;
  
  RETURN NEW;
END;
$$;