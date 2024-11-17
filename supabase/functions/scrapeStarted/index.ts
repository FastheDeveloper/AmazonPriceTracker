// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
//@ts-ignore
import { createClient } from 'jsr:@supabase/supabase-js@2';

console.log('Hello from Functions!');

const startScraping = async (keyword: string, search_id: string) => {
  if (!keyword || !search_id) {
    throw new Error('Keyword and search_id are required');
  }

  //@ts-ignore
  const brightDataApiKey = Deno.env.get('BRIGHT_DATA_API_KEY');
  //@ts-ignore
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!brightDataApiKey || !supabaseAnonKey) {
    throw new Error('Missing required environment variables');
  }

  const searchParams = new URLSearchParams({
    dataset_id: 'gd_lwdb4vjm1ehb499uxs',
    limit_multiple_results: '10',
    format: 'json',
    uncompressed_webhook: 'true',
    endpoint: `https://kucvnewwkdrvtwgoqpaq.supabase.co/functions/v1/scrapedCompleted?id=${search_id}`,
    auth_header: `Bearer ${supabaseAnonKey}`,
  });

  try {
    const res = await fetch(
      `https://api.brightdata.com/datasets/v3/trigger?${searchParams.toString()}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${brightDataApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ keyword, url: 'https://www.amazon.com', pages_to_search: 1 }]),
      }
    );

    if (!res.ok) {
      throw new Error(`Brightdata API error: ${res.status} ${res.statusText}`);
    }

    const resultJson = await res.json();
    return resultJson;
  } catch (error) {
    throw new Error(
      `Failed to start scraping: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

//@ts-ignore
Deno.serve(async (req: Request) => {
  try {
    // Validate request
    if (!req.headers.get('Authorization')) {
      throw new Error('Authorization header is required');
    }

    // Parse request body
    const body = await req.json().catch(() => {
      throw new Error('Invalid JSON payload');
    });

    if (!body.record?.query || !body.record?.id) {
      throw new Error('Missing required fields: query and id');
    }

    // Start scraping
    const newScrapJob = await startScraping(body.record.query, body.record.id);

    // Initialize Supabase client
    //@ts-ignore
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    //@ts-ignore
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    // Update database
    const { data, error: dbError } = await supabaseClient
      .from('searches')
      .update({
        snapshot_id: newScrapJob.snapshot_id,
        status: 'Scraping',
      })
      .eq('id', body.record.id)
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in scrapeStarted:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

// curl -H "Authorization: Bearer f2e544a9-294a-4cef-ba71-2d66674ef3e9"
// -H "Content-Type: application/json"
// -d '[{"keyword":"X-box","url":"https://www.amazon.com","pages_to_search":1}]'
// "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lwdb4vjm1ehb499uxs&limit_multiple_results=10"

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/scrapeStarted' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"record":{"id":9,"query":"Plane"}}'



--remote

  curl -i --location --request POST 'https://kucvnewwkdrvtwgoqpaq.supabase.co/functions/v1/scrapeStarted' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y3ZuZXd3a2RydnR3Z29xcGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0MDUyMjgsImV4cCI6MjA0Njk4MTIyOH0.OqYip2LtKJj6GYLR-2Vx1yYfzjw9PiqInNrj3_Ka14c' \
    --header 'Content-Type: application/json' \
    --data '{"record":{"id":9,"query":"Plane"}}'





*/
