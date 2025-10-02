-- Create enum types for roles and statuses
CREATE TYPE app_role AS ENUM (
  'student',
  'dept_coordinator',
  'college_placement',
  'recruiter',
  'dto',
  'sto',
  'nto',
  'admin'
);

CREATE TYPE application_status AS ENUM (
  'applied',
  'under_review',
  'interview_scheduled',
  'interviewed',
  'offered',
  'accepted',
  'rejected',
  'withdrawn'
);

CREATE TYPE opportunity_type AS ENUM (
  'job',
  'internship',
  'training',
  'project'
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Colleges table
CREATE TABLE public.colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  state text NOT NULL,
  district text NOT NULL,
  address text,
  phone text,
  email text,
  website text,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;

-- Departments table
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  code text NOT NULL,
  coordinator_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(college_id, code)
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Students table
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  abc_id text UNIQUE NOT NULL,
  full_name text NOT NULL,
  dob date,
  gender text,
  email text UNIQUE NOT NULL,
  phone text,
  state text,
  district text,
  college_id uuid REFERENCES public.colleges(id),
  department_id uuid REFERENCES public.departments(id),
  education jsonb DEFAULT '[]'::jsonb,
  skills text[] DEFAULT ARRAY[]::text[],
  experience jsonb DEFAULT '[]'::jsonb,
  domains_interested text[] DEFAULT ARRAY[]::text[],
  resume_url text,
  certificates jsonb DEFAULT '[]'::jsonb,
  profile_completed boolean DEFAULT false,
  placed boolean DEFAULT false,
  employability_score int DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_students_abc_id ON public.students(abc_id);
CREATE INDEX idx_students_college_id ON public.students(college_id);
CREATE INDEX idx_students_department_id ON public.students(department_id);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Recruiters table
CREATE TABLE public.recruiters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name text NOT NULL,
  company_website text,
  industry text,
  contact_person text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  verified boolean DEFAULT false,
  kyc_documents jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;

-- Opportunities table
CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid REFERENCES public.recruiters(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  type opportunity_type NOT NULL,
  description text,
  requirements jsonb DEFAULT '{}'::jsonb,
  skills_required text[] DEFAULT ARRAY[]::text[],
  department text,
  location text,
  stipend_min int,
  stipend_max int,
  duration_months int,
  positions_available int DEFAULT 1,
  deadline date,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id)
);

CREATE INDEX idx_opportunities_recruiter_id ON public.opportunities(recruiter_id);
CREATE INDEX idx_opportunities_active ON public.opportunities(active);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Applications table
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  status application_status DEFAULT 'applied' NOT NULL,
  cover_letter text,
  recruiter_feedback text,
  interview_scheduled_at timestamptz,
  applied_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(opportunity_id, student_id)
);

CREATE INDEX idx_applications_student_id ON public.applications(student_id);
CREATE INDEX idx_applications_opportunity_id ON public.applications(opportunity_id);
CREATE INDEX idx_applications_status ON public.applications(status);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Certificates table
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  certificate_url text,
  issued_at timestamptz DEFAULT now() NOT NULL,
  issued_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_certificates_student_id ON public.certificates(student_id);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Audit logs table
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for students
CREATE POLICY "Students can view their own profile"
  ON public.students FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile"
  ON public.students FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all students"
  ON public.students FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Recruiters can view students (limited)"
  ON public.students FOR SELECT
  USING (public.has_role(auth.uid(), 'recruiter'));

-- RLS Policies for opportunities
CREATE POLICY "Anyone can view active opportunities"
  ON public.opportunities FOR SELECT
  USING (active = true);

CREATE POLICY "Recruiters can create opportunities"
  ON public.opportunities FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'recruiter'));

CREATE POLICY "Recruiters can update their opportunities"
  ON public.opportunities FOR UPDATE
  USING (
    created_by = auth.uid() AND 
    public.has_role(auth.uid(), 'recruiter')
  );

-- RLS Policies for applications
CREATE POLICY "Students can view their applications"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE students.id = applications.student_id
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE students.id = student_id
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can view applications for their opportunities"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities
      WHERE opportunities.id = applications.opportunity_id
      AND opportunities.created_by = auth.uid()
    )
  );

CREATE POLICY "Recruiters can update applications for their opportunities"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities
      WHERE opportunities.id = applications.opportunity_id
      AND opportunities.created_by = auth.uid()
    )
  );

-- RLS Policies for colleges
CREATE POLICY "Anyone can view approved colleges"
  ON public.colleges FOR SELECT
  USING (approved = true);

CREATE POLICY "Admins can manage all colleges"
  ON public.colleges FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for certificates
CREATE POLICY "Students can view their certificates"
  ON public.certificates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE students.id = certificates.student_id
      AND students.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER handle_colleges_updated_at
  BEFORE UPDATE ON public.colleges
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_recruiters_updated_at
  BEFORE UPDATE ON public.recruiters
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();