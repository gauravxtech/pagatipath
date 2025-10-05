-- Fix recruiter approval synchronization issue
-- This migration ensures that recruiter approval status is properly synced between recruiters and user_roles tables

-- Create a function to sync recruiter approval status
CREATE OR REPLACE FUNCTION sync_recruiter_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- When recruiters.verified is updated, sync with user_roles.approved
  IF TG_TABLE_NAME = 'recruiters' AND OLD.verified IS DISTINCT FROM NEW.verified THEN
    UPDATE public.user_roles 
    SET 
      approved = NEW.verified,
      approved_by = NEW.approved_by,
      updated_at = now()
    WHERE user_id = NEW.user_id AND role = 'recruiter';
  END IF;
  
  -- When user_roles.approved is updated for recruiters, sync with recruiters.verified
  IF TG_TABLE_NAME = 'user_roles' AND NEW.role = 'recruiter' AND OLD.approved IS DISTINCT FROM NEW.approved THEN
    UPDATE public.recruiters 
    SET 
      verified = NEW.approved,
      approved_by = NEW.approved_by,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to keep both tables in sync
DROP TRIGGER IF EXISTS sync_recruiter_approval_from_recruiters ON public.recruiters;
CREATE TRIGGER sync_recruiter_approval_from_recruiters
  AFTER UPDATE ON public.recruiters
  FOR EACH ROW
  EXECUTE FUNCTION sync_recruiter_approval();

DROP TRIGGER IF EXISTS sync_recruiter_approval_from_user_roles ON public.user_roles;
CREATE TRIGGER sync_recruiter_approval_from_user_roles
  AFTER UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION sync_recruiter_approval();

-- Fix any existing inconsistencies
-- Update user_roles to match recruiters table
UPDATE public.user_roles 
SET approved = r.verified
FROM public.recruiters r 
WHERE user_roles.user_id = r.user_id 
  AND user_roles.role = 'recruiter' 
  AND user_roles.approved != r.verified;

-- Update recruiters to match user_roles table (in case user_roles is more up to date)
UPDATE public.recruiters 
SET verified = ur.approved
FROM public.user_roles ur 
WHERE recruiters.user_id = ur.user_id 
  AND ur.role = 'recruiter' 
  AND recruiters.verified != ur.approved;

-- Add a comment to document the sync mechanism
COMMENT ON FUNCTION sync_recruiter_approval() IS 'Keeps recruiter approval status synchronized between recruiters.verified and user_roles.approved';