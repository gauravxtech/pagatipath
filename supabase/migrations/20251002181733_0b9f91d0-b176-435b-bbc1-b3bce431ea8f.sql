-- Add UPDATE policies for admins on officer tables

-- NTO Officers - Allow admins to update
CREATE POLICY "Admins can update NTO officers"
ON public.nto_officers
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- STO Officers - Allow admins and NTO to update
CREATE POLICY "Admins and NTO can update STO officers"
ON public.sto_officers
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'nto'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'nto'::app_role));

-- DTO Officers - Allow admins, NTO, and STO to update
CREATE POLICY "Admins, NTO and STO can update DTO officers"
ON public.dto_officers
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'nto'::app_role) OR has_role(auth.uid(), 'sto'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'nto'::app_role) OR has_role(auth.uid(), 'sto'::app_role));

-- College TPO - Allow admins and officers to update
CREATE POLICY "Admins and officers can update college TPO"
ON public.college_tpo
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'nto'::app_role) OR 
  has_role(auth.uid(), 'sto'::app_role) OR 
  has_role(auth.uid(), 'dto'::app_role)
)
WITH CHECK (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'nto'::app_role) OR 
  has_role(auth.uid(), 'sto'::app_role) OR 
  has_role(auth.uid(), 'dto'::app_role)
);

-- Department Coordinators - Allow admins and officers to update
CREATE POLICY "Admins and officers can update dept coordinators"
ON public.department_coordinators
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'nto'::app_role) OR 
  has_role(auth.uid(), 'sto'::app_role) OR 
  has_role(auth.uid(), 'dto'::app_role) OR 
  has_role(auth.uid(), 'college_placement'::app_role)
)
WITH CHECK (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'nto'::app_role) OR 
  has_role(auth.uid(), 'sto'::app_role) OR 
  has_role(auth.uid(), 'dto'::app_role) OR 
  has_role(auth.uid(), 'college_placement'::app_role)
);

-- Allow admins to update user_roles for approval management
CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow NTO to update STO and DTO roles
CREATE POLICY "NTO can update STO and DTO roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'nto'::app_role) AND 
  role IN ('sto'::app_role, 'dto'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'nto'::app_role) AND 
  role IN ('sto'::app_role, 'dto'::app_role)
);