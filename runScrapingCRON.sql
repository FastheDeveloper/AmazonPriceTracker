select
  cron.schedule(
    'invoke-scraper-every-minute',
    '*/3 * * * *',
    $$
    select
      net.http_post(
          url:='https://project-ref.supabase.co/functions/v1/scrape-tracked-searches',
          headers:=jsonb_build_object('Content-Type','application/json', 'Authorization', 'Bearer <SECRET>'),
          timeout_milliseconds:=5000
      ) as request_id;
    $$
  );
