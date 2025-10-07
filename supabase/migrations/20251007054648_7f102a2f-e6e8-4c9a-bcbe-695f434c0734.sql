-- Add RLS policy to allow admins to update students
CREATE POLICY "Admins can update all students"
ON public.students
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policy to allow NTO officers to update students
CREATE POLICY "NTO can update students"
ON public.students
FOR UPDATE
USING (has_role(auth.uid(), 'nto'::app_role))
WITH CHECK (has_role(auth.uid(), 'nto'::app_role));