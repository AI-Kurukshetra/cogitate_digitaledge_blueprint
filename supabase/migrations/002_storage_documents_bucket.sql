-- Documents bucket for dashboard uploads and generated PDFs.
-- Run after schema; bucket is private; authenticated users with app roles can upload/read.

insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do update set name = excluded.name, public = excluded.public;

-- Allow authenticated users to upload (dashboard create/replace document).
drop policy if exists documents_upload on storage.objects;
create policy documents_upload on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents');

-- Allow authenticated users to read (signed URLs are created server-side; anon may need select for public URLs).
drop policy if exists documents_select on storage.objects;
create policy documents_select on storage.objects
  for select to authenticated
  using (bucket_id = 'documents');

-- Allow overwrite (upsert) for replace-file flow.
drop policy if exists documents_update on storage.objects;
create policy documents_update on storage.objects
  for update to authenticated
  using (bucket_id = 'documents')
  with check (bucket_id = 'documents');
