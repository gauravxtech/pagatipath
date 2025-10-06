-- Drop the problematic RLS policies on applications table
DROP POLICY IF EXISTS "Recruiters can view applications for their opportunities" ON applications;
DROP POLICY IF EXISTS "Recruiters can update applications for their opportunities" ON applications;

-- Recreate the policies without causing infinite recursion
CREATE POLICY "Recruiters can view applications for their opportunities"
ON applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM opportunities
    WHERE opportunities.id = applications.opportunity_id
    AND opportunities.created_by = auth.uid()
  )
);

CREATE POLICY "Recruiters can update applications for their opportunities"
ON applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM opportunities
    WHERE opportunities.id = applications.opportunity_id
    AND opportunities.created_by = auth.uid()
  )
);