-- Add approval system to tables
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false;
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false;
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false;

-- Add approved_by field to track who approved
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id);
ALTER TABLE public.departments ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id);
ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id);
ALTER TABLE public.recruiters ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id);

-- Add approved field to user_roles for role-level approval
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS approved boolean DEFAULT false;
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id);

-- Create default admin user (admin@pragatipath.com / admin123)
-- First, we need to create the auth user manually via SQL
-- Note: Password hash for 'admin123' (you should change this in production)
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@pragatipath.com';
  
  IF admin_user_id IS NULL THEN
    -- Insert into auth.users (this is a simplified version, in production use Supabase Auth API)
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@pragatipath.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"System Administrator","role":"admin"}',
      now(),
      now(),
      '',
      '',
      ''
    ) RETURNING id INTO admin_user_id;

    -- Insert profile
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (admin_user_id, 'admin@pragatipath.com', 'System Administrator')
    ON CONFLICT (id) DO NOTHING;

    -- Insert admin role (pre-approved)
    INSERT INTO public.user_roles (user_id, role, approved)
    VALUES (admin_user_id, 'admin', true)
    ON CONFLICT (user_id, role) DO UPDATE SET approved = true;
  END IF;
END $$;

-- Update RLS policies to check approval status
DROP POLICY IF EXISTS "Students can view their own profile" ON public.students;
CREATE POLICY "Students can view their own profile"
ON public.students FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Approved students can update their profile" ON public.students;
CREATE POLICY "Approved students can update their profile"
ON public.students FOR UPDATE
USING (auth.uid() = user_id AND approved = true);

-- Update has_role function to check approval status
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
      AND role = _role 
      AND approved = true
  )
$$;

-- Function to get user's pending approval role
CREATE OR REPLACE FUNCTION public.get_pending_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id 
    AND approved = false
  LIMIT 1
$$;

COMMENT ON TABLE public.user_roles IS 'User roles with approval system - each role needs approval from higher authority';