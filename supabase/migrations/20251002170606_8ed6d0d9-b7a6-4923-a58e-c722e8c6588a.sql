-- Create tables for different officer roles

-- NTO (National Training Officer)
CREATE TABLE IF NOT EXISTS public.nto_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile_number TEXT NOT NULL,
  national_officer_id TEXT NOT NULL UNIQUE,
  approved BOOLEAN DEFAULT false,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- STO (State Training Officer)
CREATE TABLE IF NOT EXISTS public.sto_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile_number TEXT NOT NULL,
  state TEXT NOT NULL,
  state_officer_id TEXT NOT NULL UNIQUE,
  approved BOOLEAN DEFAULT false,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- DTO (District Training Officer)
CREATE TABLE IF NOT EXISTS public.dto_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile_number TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  district_officer_id TEXT NOT NULL UNIQUE,
  approved BOOLEAN DEFAULT false,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- College TPO (Training & Placement Officer)
CREATE TABLE IF NOT EXISTS public.college_tpo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  college_id UUID REFERENCES public.colleges(id),
  college_registration_number TEXT NOT NULL UNIQUE,
  tpo_full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile_number TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Department Coordinators (Department TPO / HOD)
CREATE TABLE IF NOT EXISTS public.department_coordinators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  college_id UUID REFERENCES public.colleges(id) NOT NULL,
  department_id UUID REFERENCES public.departments(id),
  department_name TEXT NOT NULL,
  coordinator_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile_number TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add missing fields to students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS mobile_number TEXT,
ADD COLUMN IF NOT EXISTS enrollment_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS year_semester TEXT;

-- Add mobile number to recruiters
ALTER TABLE public.recruiters
ADD COLUMN IF NOT EXISTS mobile_number TEXT;

-- Enable RLS
ALTER TABLE public.nto_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sto_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dto_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_tpo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_coordinators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for NTO Officers
CREATE POLICY "NTO officers can view their own profile"
  ON public.nto_officers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "NTO officers can update their own profile"
  ON public.nto_officers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all NTO officers"
  ON public.nto_officers FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for STO Officers
CREATE POLICY "STO officers can view their own profile"
  ON public.sto_officers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "STO officers can update their own profile"
  ON public.sto_officers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and NTO can view STO officers"
  ON public.sto_officers FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'nto'::app_role));

-- RLS Policies for DTO Officers
CREATE POLICY "DTO officers can view their own profile"
  ON public.dto_officers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "DTO officers can update their own profile"
  ON public.dto_officers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins, NTO and STO can view DTO officers"
  ON public.dto_officers FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'nto'::app_role) OR has_role(auth.uid(), 'sto'::app_role));

-- RLS Policies for College TPO
CREATE POLICY "College TPO can view their own profile"
  ON public.college_tpo FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "College TPO can update their own profile"
  ON public.college_tpo FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and officers can view college TPO"
  ON public.college_tpo FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'nto'::app_role) OR has_role(auth.uid(), 'sto'::app_role) OR has_role(auth.uid(), 'dto'::app_role));

-- RLS Policies for Department Coordinators
CREATE POLICY "Dept coordinators can view their own profile"
  ON public.department_coordinators FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Dept coordinators can update their own profile"
  ON public.department_coordinators FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "College TPO and higher can view dept coordinators"
  ON public.department_coordinators FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'nto'::app_role) OR has_role(auth.uid(), 'sto'::app_role) OR has_role(auth.uid(), 'dto'::app_role) OR has_role(auth.uid(), 'college_placement'::app_role));

-- Update user roles enum if needed
DO $$ 
BEGIN
  -- Check if enum values exist, if not this will be handled by type system
  NULL;
END $$;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nto_officers_updated_at BEFORE UPDATE ON public.nto_officers
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_sto_officers_updated_at BEFORE UPDATE ON public.sto_officers
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_dto_officers_updated_at BEFORE UPDATE ON public.dto_officers
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_college_tpo_updated_at BEFORE UPDATE ON public.college_tpo
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_department_coordinators_updated_at BEFORE UPDATE ON public.department_coordinators
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Update trigger function to handle new roles
CREATE OR REPLACE FUNCTION public.handle_new_student_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF new.raw_user_meta_data->>'role' = 'student' THEN
    INSERT INTO public.students (
      user_id,
      abc_id,
      full_name,
      email,
      mobile_number,
      enrollment_number,
      year_semester,
      profile_completed
    ) VALUES (
      new.id,
      new.raw_user_meta_data->>'abc_id',
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'mobile_number',
      new.raw_user_meta_data->>'enrollment_number',
      new.raw_user_meta_data->>'year_semester',
      false
    );
  ELSIF new.raw_user_meta_data->>'role' = 'recruiter' THEN
    INSERT INTO public.recruiters (
      user_id,
      company_name,
      contact_person,
      email,
      mobile_number,
      verified
    ) VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'company_name', 'Not Set'),
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'mobile_number',
      false
    );
  ELSIF new.raw_user_meta_data->>'role' = 'nto' THEN
    INSERT INTO public.nto_officers (
      user_id,
      full_name,
      email,
      mobile_number,
      national_officer_id,
      approved
    ) VALUES (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'mobile_number',
      new.raw_user_meta_data->>'national_officer_id',
      false
    );
  ELSIF new.raw_user_meta_data->>'role' = 'sto' THEN
    INSERT INTO public.sto_officers (
      user_id,
      full_name,
      email,
      mobile_number,
      state,
      state_officer_id,
      approved
    ) VALUES (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'mobile_number',
      new.raw_user_meta_data->>'state',
      new.raw_user_meta_data->>'state_officer_id',
      false
    );
  ELSIF new.raw_user_meta_data->>'role' = 'dto' THEN
    INSERT INTO public.dto_officers (
      user_id,
      full_name,
      email,
      mobile_number,
      state,
      district,
      district_officer_id,
      approved
    ) VALUES (
      new.id,
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'mobile_number',
      new.raw_user_meta_data->>'state',
      new.raw_user_meta_data->>'district',
      new.raw_user_meta_data->>'district_officer_id',
      false
    );
  ELSIF new.raw_user_meta_data->>'role' = 'college_placement' THEN
    INSERT INTO public.college_tpo (
      user_id,
      college_registration_number,
      tpo_full_name,
      email,
      mobile_number,
      approved
    ) VALUES (
      new.id,
      new.raw_user_meta_data->>'college_registration_number',
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'mobile_number',
      false
    );
  ELSIF new.raw_user_meta_data->>'role' = 'dept_coordinator' THEN
    INSERT INTO public.department_coordinators (
      user_id,
      college_id,
      department_name,
      coordinator_name,
      email,
      mobile_number,
      approved
    ) VALUES (
      new.id,
      (new.raw_user_meta_data->>'college_id')::uuid,
      new.raw_user_meta_data->>'department_name',
      new.raw_user_meta_data->>'full_name',
      new.email,
      new.raw_user_meta_data->>'mobile_number',
      false
    );
  END IF;

  -- Always insert user role
  INSERT INTO public.user_roles (user_id, role, approved)
  VALUES (new.id, (new.raw_user_meta_data->>'role')::app_role, false);

  RETURN new;
END;
$function$;