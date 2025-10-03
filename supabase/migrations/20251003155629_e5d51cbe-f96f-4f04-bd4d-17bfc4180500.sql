-- Phase 1: Critical Security Fixes

-- 1. Fix Student Data Exposure - Drop overly permissive recruiter policy
DROP POLICY IF EXISTS "Recruiters can view students (limited)" ON public.students;

-- Create new restricted policy for recruiters (only see students who applied to their jobs)
CREATE POLICY "Recruiters can view applicant students only"
ON public.students
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'recruiter'::app_role) AND
  EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.opportunities o ON o.id = a.opportunity_id
    WHERE a.student_id = students.id
      AND o.created_by = auth.uid()
  )
);

-- 2. Protect College TPO Contact Information - Remove public viewing
DROP POLICY IF EXISTS "Admins and officers can view college TPO" ON public.college_tpo;

CREATE POLICY "Authorized roles can view college TPO"
ON public.college_tpo
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'nto'::app_role) OR
  has_role(auth.uid(), 'sto'::app_role) OR
  has_role(auth.uid(), 'dto'::app_role)
);

-- 3. Protect Department Coordinators Contact Information
DROP POLICY IF EXISTS "College TPO and higher can view dept coordinators" ON public.department_coordinators;

CREATE POLICY "Authorized roles can view dept coordinators"
ON public.department_coordinators
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'nto'::app_role) OR
  has_role(auth.uid(), 'sto'::app_role) OR
  has_role(auth.uid(), 'dto'::app_role) OR
  has_role(auth.uid(), 'college_placement'::app_role)
);

-- 4. Secure Recruiter Data - Create public view without sensitive info
CREATE OR REPLACE VIEW public.public_recruiters AS
SELECT
  id,
  company_name,
  industry,
  company_website,
  verified
FROM public.recruiters
WHERE verified = true;

-- Drop and recreate recruiter viewing policy to use limited fields
DROP POLICY IF EXISTS "Users can view recruiters for active opportunities" ON public.recruiters;

CREATE POLICY "Limited recruiter info for opportunities"
ON public.recruiters
FOR SELECT
TO authenticated
USING (
  verified = true AND
  EXISTS (
    SELECT 1 FROM public.opportunities
    WHERE opportunities.recruiter_id = recruiters.id
      AND opportunities.active = true
  )
);

-- 5. Lock Down Audit Logs
CREATE POLICY "Prevent direct audit log inserts"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Prevent audit log deletion"
ON public.audit_logs
FOR DELETE
TO authenticated
USING (false);

CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'nto'::app_role) OR
  has_role(auth.uid(), 'sto'::app_role)
);

-- 6. Prevent Certificate Fraud
CREATE POLICY "Only admins can issue certificates"
ON public.certificates
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'nto'::app_role)
);

CREATE POLICY "Prevent certificate modification"
ON public.certificates
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Prevent certificate deletion"
ON public.certificates
FOR DELETE
TO authenticated
USING (false);

-- 7. Secure Notifications - Prevent direct inserts
CREATE POLICY "Prevent direct notification inserts"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Prevent notification deletion"
ON public.notifications
FOR DELETE
TO authenticated
USING (false);

-- 8. Secure Analytics Events
CREATE POLICY "System can insert analytics"
ON public.analytics_events
FOR INSERT
TO authenticated
WITH CHECK (false);

-- 9. Fix Database Function Security - Add proper search_path
CREATE OR REPLACE FUNCTION public.calculate_employability_score(student_id_param uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  score integer := 0;
  student_data record;
BEGIN
  SELECT * INTO student_data FROM public.students WHERE id = student_id_param;
  
  IF student_data.profile_completed THEN
    score := score + 20;
  END IF;
  
  IF student_data.skills IS NOT NULL THEN
    score := score + LEAST(array_length(student_data.skills, 1) * 2, 20);
  END IF;
  
  IF student_data.certificates IS NOT NULL THEN
    score := score + LEAST(jsonb_array_length(student_data.certificates) * 5, 20);
  END IF;
  
  IF student_data.experience IS NOT NULL THEN
    score := score + LEAST(jsonb_array_length(student_data.experience) * 10, 20);
  END IF;
  
  score := score + LEAST((
    SELECT COUNT(*) FROM public.applications WHERE applications.student_id = student_id_param
  ) * 2, 10);
  
  score := score + LEAST((
    SELECT COUNT(*) FROM public.applications a
    JOIN public.interviews i ON i.application_id = a.id
    WHERE a.student_id = student_id_param AND i.status = 'completed'
  ) * 5, 10);
  
  RETURN LEAST(score, 100);
END;
$function$;