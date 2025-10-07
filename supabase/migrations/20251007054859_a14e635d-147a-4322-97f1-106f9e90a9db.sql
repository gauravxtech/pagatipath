-- Add RLS policy to allow admins to view all students
CREATE POLICY "Admins can view all students for management"
ON public.students
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policy to allow NTO to view all students
CREATE POLICY "NTO can view all students"
ON public.students
FOR SELECT
USING (has_role(auth.uid(), 'nto'::app_role));