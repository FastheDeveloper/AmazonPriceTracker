import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
//@ts-ignore
import { createClient } from 'jsr:@supabase/supabase-js@2';

//@ts-ignore
Deno.serve(async (req) => {
  //@ts-ignore

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  //@ts-ignore
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: req.headers.get('Authorization')! } },
  });

  //get all tracked searches
  const { data: trackedSearches, error: trackedError } = await supabase
    .from('searches')
    .select('*')
    .eq('is_tracked', true)
    .order('created_at', { ascending: false });

  const res = await Promise.all(
    trackedSearches.map((search: any) =>
      supabase.functions.invoke('scrapeStarted', {
        body: JSON.stringify({ record: search }),
      })
    )
  );
  console.log('====================================');
  console.log(JSON.stringify(res, null, 2));
  console.log('====================================');

  return new Response(JSON.stringify({ success: true, ok: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/scrape-tracked-searches' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'


    --remote 

      curl -i --location --request POST 'https://kucvnewwkdrvtwgoqpaq.supabase.co/functions/v1/scrape-tracked-searches' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y3ZuZXd3a2RydnR3Z29xcGFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTQwNTIyOCwiZXhwIjoyMDQ2OTgxMjI4fQ.BETXgqH7lctdoRLCVJeFnClmaULShCm438RQO_Jjf-g' \
    --header 'Content-Type: application/json' 


    --cron


    select
  cron.schedule(
    'invoke-function-every-half-minute',
    '30 seconds',
    $$
    select
      net.http_post(
          url:='https://project-ref.supabase.co/functions/v1/function-name',
          headers:=jsonb_build_object('Content-Type','application/json', 'Authorization', 'Bearer ' || 'YOUR_ANON_KEY'),
          body:=jsonb_build_object('time', now() ),
          timeout_milliseconds:=5000
      ) as request_id;
    $$
  );


*/
