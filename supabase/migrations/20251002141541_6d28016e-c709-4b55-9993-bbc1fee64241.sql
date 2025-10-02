-- Add DTO/STO/NTO roles to enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'dto';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'sto';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'nto';

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid REFERENCES auth.users(id),
  resolved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS public.interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  scheduled_at timestamp with time zone NOT NULL,
  duration_minutes integer DEFAULT 60,
  location text,
  meeting_link text,
  interviewer_name text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  feedback text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create placement_drives table
CREATE TABLE IF NOT EXISTS public.placement_drives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  college_id uuid REFERENCES public.colleges(id),
  department_id uuid REFERENCES public.departments(id),
  organizer_id uuid REFERENCES auth.users(id) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  participants_count integer DEFAULT 0,
  companies_invited uuid[],
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  action_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  entity_type text,
  entity_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create college_rankings table
CREATE TABLE IF NOT EXISTS public.college_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid REFERENCES public.colleges(id) NOT NULL,
  year integer NOT NULL,
  placement_rate decimal(5,2),
  average_package decimal(12,2),
  highest_package decimal(12,2),
  companies_visited integer,
  students_placed integer,
  rank integer,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(college_id, year)
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_rankings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_tickets
CREATE POLICY "Students can view their tickets"
  ON public.support_tickets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.students
    WHERE students.id = support_tickets.student_id
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Students can create tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.students
    WHERE students.id = support_tickets.student_id
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage tickets"
  ON public.support_tickets FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for interviews
CREATE POLICY "Students can view their interviews"
  ON public.interviews FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.students s ON s.id = a.student_id
    WHERE a.id = interviews.application_id
    AND s.user_id = auth.uid()
  ));

CREATE POLICY "Recruiters can manage interviews"
  ON public.interviews FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.applications a
    JOIN public.opportunities o ON o.id = a.opportunity_id
    WHERE a.id = interviews.application_id
    AND o.created_by = auth.uid()
  ));

-- RLS Policies for placement_drives
CREATE POLICY "Everyone can view active drives"
  ON public.placement_drives FOR SELECT
  USING (status IN ('upcoming', 'ongoing'));

CREATE POLICY "College placement can manage drives"
  ON public.placement_drives FOR ALL
  USING (has_role(auth.uid(), 'college_placement'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for analytics_events
CREATE POLICY "Admins can view analytics"
  ON public.analytics_events FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sto'::app_role) OR has_role(auth.uid(), 'nto'::app_role));

-- RLS Policies for college_rankings
CREATE POLICY "Everyone can view rankings"
  ON public.college_rankings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage rankings"
  ON public.college_rankings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'nto'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON public.interviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_placement_drives_updated_at
  BEFORE UPDATE ON public.placement_drives
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate employability score
CREATE OR REPLACE FUNCTION public.calculate_employability_score(student_id_param uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  score integer := 0;
  student_data record;
BEGIN
  SELECT * INTO student_data FROM public.students WHERE id = student_id_param;
  
  -- Profile completion (20 points)
  IF student_data.profile_completed THEN
    score := score + 20;
  END IF;
  
  -- Skills (20 points - 2 per skill, max 20)
  IF student_data.skills IS NOT NULL THEN
    score := score + LEAST(array_length(student_data.skills, 1) * 2, 20);
  END IF;
  
  -- Certificates (20 points)
  IF student_data.certificates IS NOT NULL THEN
    score := score + LEAST(jsonb_array_length(student_data.certificates) * 5, 20);
  END IF;
  
  -- Experience (20 points)
  IF student_data.experience IS NOT NULL THEN
    score := score + LEAST(jsonb_array_length(student_data.experience) * 10, 20);
  END IF;
  
  -- Applications (10 points)
  score := score + LEAST((
    SELECT COUNT(*) FROM public.applications WHERE applications.student_id = student_id_param
  ) * 2, 10);
  
  -- Interview success (10 points)
  score := score + LEAST((
    SELECT COUNT(*) FROM public.applications a
    JOIN public.interviews i ON i.application_id = a.id
    WHERE a.student_id = student_id_param AND i.status = 'completed'
  ) * 5, 10);
  
  RETURN LEAST(score, 100);
END;
$$;

-- Function to send notification
CREATE OR REPLACE FUNCTION public.create_notification(
  user_id_param uuid,
  title_param text,
  message_param text,
  type_param text DEFAULT 'info',
  action_url_param text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, action_url)
  VALUES (user_id_param, title_param, message_param, type_param, action_url_param)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Function to track analytics event
CREATE OR REPLACE FUNCTION public.track_event(
  event_type_param text,
  user_id_param uuid DEFAULT NULL,
  entity_type_param text DEFAULT NULL,
  entity_id_param uuid DEFAULT NULL,
  metadata_param jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.analytics_events (event_type, user_id, entity_type, entity_id, metadata)
  VALUES (event_type_param, user_id_param, entity_type_param, entity_id_param, metadata_param)
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;