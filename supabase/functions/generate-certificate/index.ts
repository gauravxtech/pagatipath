import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CertificateRequest {
  studentId: string;
  type: string; // 'completion', 'participation', 'achievement'
  title: string;
  description?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { studentId, type, title, description } = await req.json() as CertificateRequest;

    console.log('Generating certificate for student:', studentId);

    // Get student details
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*, colleges(name), departments(name)')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      throw new Error('Student not found');
    }

    // Generate certificate HTML (simplified - in production use a proper PDF library)
    const certificateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Georgia', serif;
            text-align: center;
            padding: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .certificate {
            background: white;
            padding: 60px;
            border: 10px solid #667eea;
            border-radius: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 { font-size: 48px; color: #667eea; margin-bottom: 20px; }
          h2 { font-size: 32px; color: #333; margin: 20px 0; }
          .student-name { font-size: 36px; color: #764ba2; font-weight: bold; margin: 30px 0; }
          .details { font-size: 18px; color: #666; margin: 20px 0; }
          .date { font-size: 16px; color: #999; margin-top: 40px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>🏆 Certificate of ${type}</h1>
          <h2>${title}</h2>
          <p class="details">This is to certify that</p>
          <p class="student-name">${student.full_name}</p>
          <p class="details">ABC ID: ${student.abc_id}</p>
          <p class="details">${student.colleges?.name || 'N/A'}</p>
          <p class="details">${student.departments?.name || 'N/A'}</p>
          ${description ? `<p class="details">${description}</p>` : ''}
          <p class="date">Issued on: ${new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </body>
      </html>
    `;

    // In production, convert HTML to PDF using a library like jsPDF or Puppeteer
    // For now, we'll store the HTML and return a URL
    const filename = `certificate_${studentId}_${Date.now()}.html`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filename, new Blob([certificateHtml], { type: 'text/html' }), {
        contentType: 'text/html',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrl } = supabase.storage
      .from('certificates')
      .getPublicUrl(filename);

    // Save certificate record
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .insert({
        student_id: studentId,
        type,
        title,
        description,
        certificate_url: publicUrl.publicUrl,
      })
      .select()
      .single();

    if (certError) {
      throw certError;
    }

    console.log('Certificate generated successfully:', certificate.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        certificate,
        url: publicUrl.publicUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error generating certificate:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});