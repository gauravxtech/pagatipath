-- Create the default admin user
-- First check if admin already exists
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@pragatipath.com';
  
  IF admin_user_id IS NULL THEN
    -- Create admin user with proper authentication
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
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@pragatipath.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"System Administrator","role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_user_id;
    
    -- Insert identity record
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      admin_user_id,
      admin_user_id::text,
      jsonb_build_object('sub', admin_user_id::text, 'email', 'admin@pragatipath.com'),
      'email',
      NOW(),
      NOW(),
      NOW()
    );
    
    -- Create user role with approved status
    INSERT INTO public.user_roles (user_id, role, approved, approved_by)
    VALUES (admin_user_id, 'admin'::app_role, true, admin_user_id)
    ON CONFLICT (user_id, role) DO UPDATE SET approved = true;
    
    -- Create profile
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (admin_user_id, 'admin@pragatipath.com', 'System Administrator', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET full_name = 'System Administrator';
    
    RAISE NOTICE 'Admin user created successfully with email: admin@pragatipath.com and password: admin123';
  ELSE
    -- Admin already exists, just ensure role is approved
    INSERT INTO public.user_roles (user_id, role, approved, approved_by)
    VALUES (admin_user_id, 'admin'::app_role, true, admin_user_id)
    ON CONFLICT (user_id, role) DO UPDATE SET approved = true;
    
    RAISE NOTICE 'Admin user already exists, role status updated';
  END IF;
END $$;