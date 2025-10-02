-- Allow admins to view all user roles for dashboard statistics
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));