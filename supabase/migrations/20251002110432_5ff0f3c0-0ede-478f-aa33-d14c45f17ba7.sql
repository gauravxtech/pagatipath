-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('resumes', 'resumes', false),
  ('certificates', 'certificates', true),
  ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes
CREATE POLICY "Students can upload their own resumes"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Students can view their own resumes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Recruiters can view student resumes"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' 
  AND has_role(auth.uid(), 'recruiter'::app_role)
);

-- Storage policies for certificates (public)
CREATE POLICY "Anyone can view certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

CREATE POLICY "System can upload certificates"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificates');

-- Storage policies for KYC documents
CREATE POLICY "Recruiters can upload their own KYC documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Recruiters can view their own KYC documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all KYC documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'kyc-documents' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add missing RLS policies for recruiters table
CREATE POLICY "Recruiters can view their own profile"
ON public.recruiters FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can update their own profile"
ON public.recruiters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can insert their own profile"
ON public.recruiters FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all recruiters"
ON public.recruiters FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add policies for departments
CREATE POLICY "Everyone can view departments"
ON public.departments FOR SELECT
USING (true);

CREATE POLICY "College placement can manage departments"
ON public.departments FOR ALL
USING (has_role(auth.uid(), 'college_placement'::app_role));

CREATE POLICY "Admins can manage departments"
ON public.departments FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger to automatically create student profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_student_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF new.raw_user_meta_data->>'role' = 'student' THEN
    INSERT INTO public.students (
      user_id,
      abc_id,
      full_name,
      email,
      profile_completed
    ) VALUES (
      new.id,
      new.raw_user_meta_data->>'abc_id',
      new.raw_user_meta_data->>'full_name',
      new.email,
      false
    );
  ELSIF new.raw_user_meta_data->>'role' = 'recruiter' THEN
    INSERT INTO public.recruiters (
      user_id,
      company_name,
      contact_person,
      email,
      verified
    ) VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'company_name', 'Not Set'),
      new.raw_user_meta_data->>'full_name',
      new.email,
      false
    );
  END IF;

  -- Always insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, (new.raw_user_meta_data->>'role')::app_role);

  RETURN new;
END;
$$;

-- Update the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_student_user();