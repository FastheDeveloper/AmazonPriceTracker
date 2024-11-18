drop policy "Enable update for users based on email" on "public"."searches";

alter table "public"."product_search" drop constraint "product_search_pkey";

drop index if exists "public"."product_search_pkey";

alter table "public"."product_search" drop column "created_at";

alter table "public"."product_search" drop column "id";

alter table "public"."product_search" alter column "asin" set not null;

alter table "public"."product_search" alter column "search_id" set not null;

CREATE UNIQUE INDEX product_search_pkey ON public.product_search USING btree (asin, search_id);

alter table "public"."product_search" add constraint "product_search_pkey" PRIMARY KEY using index "product_search_pkey";

create policy "Enable update for users based on userId"
on "public"."searches"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER "StartScrapingDatabaseInsert" AFTER INSERT ON public.searches FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://kucvnewwkdrvtwgoqpaq.supabase.co/functions/v1/scrapeStarted', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y3ZuZXd3a2RydnR3Z29xcGFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTQwNTIyOCwiZXhwIjoyMDQ2OTgxMjI4fQ.BETXgqH7lctdoRLCVJeFnClmaULShCm438RQO_Jjf-g"}', '{}', '1000');


