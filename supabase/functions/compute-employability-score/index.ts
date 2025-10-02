import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { studentId } = await req.json();

    console.log('Computing employability score for student:', studentId);

    // Get student data
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      throw new Error('Student not found');
    }

    let score = 0;

    // Profile completion (20 points)
    if (student.profile_completed) {
      score += 20;
    }

    // Skills (20 points - 2 per skill, max 20)
    if (student.skills && Array.isArray(student.skills)) {
      score += Math.min(student.skills.length * 2, 20);
    }

    // Education (15 points)
    if (student.education && Array.isArray(student.education)) {
      score += Math.min(student.education.length * 5, 15);
    }

    // Experience (15 points)
    if (student.experience && Array.isArray(student.experience)) {
      score += Math.min(student.experience.length * 7, 15);
    }

    // Certificates (10 points)
    const { count: certCount } = await supabase
      .from('certificates')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId);

    score += Math.min((certCount || 0) * 5, 10);

    // Applications (10 points)
    const { count: appCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId);

    score += Math.min((appCount || 0) * 2, 10);

    // Interview success (10 points)
    const { data: studentApps } = await supabase
      .from('applications')
      .select('id')
      .eq('student_id', studentId);

    const appIds = studentApps?.map(a => a.id) || [];
    
    const { count: interviewCount } = await supabase
      .from('interviews')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')
      .in('application_id', appIds);

    score += Math.min((interviewCount || 0) * 5, 10);

    // Cap at 100
    const finalScore = Math.min(score, 100);

    // Update student score
    const { error: updateError } = await supabase
      .from('students')
      .update({ employability_score: finalScore })
      .eq('id', studentId);

    if (updateError) {
      throw updateError;
    }

    console.log('Employability score updated:', finalScore);

    return new Response(
      JSON.stringify({ success: true, score: finalScore }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error computing employability score:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});