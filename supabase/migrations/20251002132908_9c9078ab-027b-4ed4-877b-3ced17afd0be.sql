-- Add policy to allow viewing recruiter company information for active opportunities
-- This allows students to see which company posted a job opportunity
-- but prevents harvesting all recruiter data

CREATE POLICY "Users can view recruiters for active opportunities"
ON public.recruiters FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.opportunities
    WHERE opportunities.recruiter_id = recruiters.id
    AND opportunities.active = true
  )
);

-- Add comment to document expected application behavior
COMMENT ON TABLE public.recruiters IS 
'Contains recruiter profiles with sensitive contact information. 
Applications should only query non-sensitive fields (company_name, company_website, industry) 
when displaying to students. Contact details (email, phone, contact_person) should only 
be shown to the recruiter themselves and admins.';