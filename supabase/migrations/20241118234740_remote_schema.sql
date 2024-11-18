create policy "Enable read access for all users"
on "public"."products_history"
as permissive
for select
to authenticated
using (true);



