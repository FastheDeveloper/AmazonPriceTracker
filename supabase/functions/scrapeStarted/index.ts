// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

console.log('Hello from Functions!');

const startScraping = async (keyword: string, search_id: string) => {
  const searchParams = new URLSearchParams({
    dataset_id: 'gd_lwdb4vjm1ehb499uxs',
    limit_multiple_results: '10',
    format: 'json',
    uncompressed_webhook: 'true',
    endpoint: `https://kucvnewwkdrvtwgoqpaq.supabase.co/functions/v1/scrapedCompleted?id=${search_id}`,
    auth_header: `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
  });
  const res = await fetch(
    `https://api.brightdata.com/datasets/v3/trigger?${searchParams.toString()}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('BRIGHT_DATA_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ keyword, url: 'https://www.amazon.com', pages_to_search: 1 }]),
    }
  );

  const resultJson = await res.json();
  return resultJson;
};

Deno.serve(async (req) => {
  const { record } = await req.json();

  const newScrapJob = await startScraping(record?.query, record?.id);
  const authHeader = req.headers.get('Authorization')!;
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data, error } = await supabaseClient
    .from('searches') //in the searches database
    .update({ snapshot_id: newScrapJob.snapshot_id, status: 'Scraping' }) //update the snapshot and status
    .eq('id', record.id) // in the row that has the "id" that is the same as the record.id we recieve from request
    // .select('snapshot_id') // to get back only column snapshot_id
    // .select(['snapshot_id', 'query', 'status']) // to get it back all coulmn- nope wont work
    // .select(`snapshot_id, query, status`) // to get it back from these specified columns
    .select() // to get it back all columns
    .single(); //to take the first item thats returned?
  console.log('====================================');
  console.log(error);
  console.log('====================================');

  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
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
