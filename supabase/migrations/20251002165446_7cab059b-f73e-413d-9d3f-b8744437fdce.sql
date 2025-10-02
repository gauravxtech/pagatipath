-- Fix the broken admin user by removing it and using proper Supabase Auth approach
-- First, clean up any broken admin user attempts
DELETE FROM auth.users WHERE email = 'admin@pragatipath.com' AND encrypted_password IS NOT NULL;

-- We cannot properly create auth users via SQL migration
-- Instead, we'll create a temporary bypass for the admin role
-- The actual admin account should be created through Supabase Auth UI

-- For now, comment the user_roles table to document the admin setup
COMMENT ON TABLE public.user_roles IS 'User roles with approval system. ADMIN SETUP: Create admin@pragatipath.com through Supabase Auth, then run: INSERT INTO user_roles (user_id, role, approved) SELECT id, ''admin''::app_role, true FROM auth.users WHERE email = ''admin@pragatipath.com'' ON CONFLICT DO NOTHING;';