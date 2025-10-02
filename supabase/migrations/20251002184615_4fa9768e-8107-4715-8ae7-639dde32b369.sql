-- Fix RLS policies for NTO to approve STOs properly
-- Drop existing policy and recreate with correct permissions
DROP POLICY IF EXISTS "NTO can update STO and DTO roles" ON public.user_roles;

-- Allow NTO to update STO and DTO roles in user_roles table
CREATE POLICY "NTO can update STO and DTO roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'nto'::app_role) 
  AND role IN ('sto'::app_role, 'dto'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'nto'::app_role) 
  AND role IN ('sto'::app_role, 'dto'::app_role)
);

-- Ensure NTO can also view STO and DTO roles to verify approval
CREATE POLICY "NTO can view STO and DTO roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'nto'::app_role) 
  AND role IN ('sto'::app_role, 'dto'::app_role)
);