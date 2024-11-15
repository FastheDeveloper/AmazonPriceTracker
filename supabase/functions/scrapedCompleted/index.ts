// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

//@ts-ignore
import { createClient } from 'jsr:@supabase/supabase-js@2';

console.log('Hello from Functions!');

//@ts-ignore
Deno.serve(async (req:Request) => {
  try {
    // Validate request parameters
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      throw new Error('Search ID is required');
    }

    // Validate request body
    const reqJson = await req.json().catch(() => {
      throw new Error('Invalid JSON payload');
    });

    if (!Array.isArray(reqJson)) {
      throw new Error('Payload must be an array of products');
    }

    // Validate auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }


    // Initialize Supabase client
    //@ts-ignore
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    //@ts-ignore
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${supabaseKey}` } },
    });

    const updated_at = new Date().toISOString();
    
    // Process products
    const products = reqJson.map((p) => ({
      asin: p.asin,
      updated_at,
      name: p.name,
      image: p.image,
      url: p.url,
      final_price: p.final_price,
      currency: p.currency,
    }));

    // Perform database operations
    const { error: productsError } = await supabase.from('products').upsert(products);
    if (productsError) {
      throw new Error(`Failed to upsert products: ${productsError.message}`);
    }

    const productsSearchLink = products.map((p) => ({
      asin: p.asin,
      search_id: id,
    }));

    const { error: product_searchError } = await supabase
      .from('product_search')
      .upsert(productsSearchLink);
    if (product_searchError) {
      throw new Error(`Failed to upsert product_search: ${product_searchError.message}`);
    }

    const { error: searchError } = await supabase
      .from('searches')
      .update({ status: 'Completed', last_scraped_at: updated_at })
      .eq('id', id);
    if (searchError) {
      throw new Error(`Failed to update search status: ${searchError.message}`);
    }

    return new Response(
      JSON.stringify({ message: 'Processing completed successfully' }), 
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }), 
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/scrapedCompleted' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
