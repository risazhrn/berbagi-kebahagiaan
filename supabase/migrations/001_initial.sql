-- Berbagi Kebahagiaan: schema v1 (review before applying to a real project)
create extension if not exists pgcrypto;

create type public.event_type as enum ('free','paid');
create type public.event_status as enum ('draft','published','closed','archived');
create type public.registration_status as enum ('pending_verification','confirmed','rejected','expired','cancelled');
create type public.payment_status as enum ('pending','verified','rejected');

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'super_admin' check (role='super_admin'),
  created_at timestamptz not null default now()
);

create table public.media_assets (
 id uuid primary key default gen_random_uuid(),
 storage_path text not null unique,
 kind text not null check(kind in ('event_poster','gallery','qris','content')),
 caption text,
 is_public boolean not null default false,
 created_at timestamptz not null default now()
);

create table public.events (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 slug text not null unique,
 category text not null,
 type public.event_type not null default 'free',
 price_idr integer not null default 0 check(price_idr >= 0),
 quota integer not null check(quota>0),
 reserved_count integer not null default 0 check(reserved_count>=0),
 title_short text,
 description text not null,
 rundown jsonb not null default '[]'::jsonb,
 requirements jsonb not null default '[]'::jsonb,
 venue_name text not null,
 venue_address text,
 starts_at timestamptz not null,
 ends_at timestamptz not null,
 registration_deadline timestamptz,
 verification_ttl_hours integer not null default 24 check(verification_ttl_hours between 1 and 168),
 status public.event_status not null default 'draft',
 poster_asset_id uuid references public.media_assets(id),
 qris_asset_id uuid references public.media_assets(id),
 payment_recipient_name text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint event_date_order check(ends_at>starts_at),
 constraint event_price_consistency check((type='free' and price_idr=0) or (type='paid' and price_idr>0)),
 constraint event_capacity check(reserved_count<=quota)
);

create table public.registrations (
 id uuid primary key default gen_random_uuid(),
 code text not null unique,
 event_id uuid not null references public.events(id) on delete restrict,
 name text not null,
 email text not null,
 whatsapp text not null,
 city text not null,
 motivation text,
 status public.registration_status not null,
 amount_idr integer not null check(amount_idr >= 0),
 quota_held boolean not null default true,
 expires_at timestamptz,
 confirmed_at timestamptz,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint email_per_event unique(event_id,email),
 constraint expiration_for_paid check(status <> 'pending_verification' or expires_at is not null)
);
create index registrations_event_status_idx on public.registrations(event_id,status);
create index registrations_expire_idx on public.registrations(expires_at) where status='pending_verification';

create table public.payments (
 id uuid primary key default gen_random_uuid(),
 registration_id uuid not null references public.registrations(id) on delete restrict,
 proof_path text not null,
 status public.payment_status not null default 'pending',
 verified_by uuid references public.admin_profiles(id),
 verified_at timestamptz,
 note text,
 created_at timestamptz not null default now()
);
create unique index only_one_verified_payment_per_registration on public.payments(registration_id) where status='verified';

create table public.site_contents (
 key text primary key,
 content jsonb not null,
 updated_at timestamptz not null default now(),
 updated_by uuid references public.admin_profiles(id)
);
create table public.gallery_items (
 id uuid primary key default gen_random_uuid(),
 event_id uuid references public.events(id) on delete set null,
 media_asset_id uuid not null references public.media_assets(id),
 caption text,
 is_published boolean not null default false,
 sort_order integer not null default 0
);
create table public.audit_logs (
 id bigint generated always as identity primary key,
 actor_id uuid references public.admin_profiles(id),
 action text not null,
 entity_type text not null,
 entity_id text not null,
 details jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);

create or replace function public.is_super_admin() returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.admin_profiles where id=(select auth.uid()) and role='super_admin')
$$;

alter table public.admin_profiles enable row level security;
alter table public.media_assets enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.payments enable row level security;
alter table public.site_contents enable row level security;
alter table public.gallery_items enable row level security;
alter table public.audit_logs enable row level security;

-- Admin has authenticated access; anonymous visitors can see only published public content.
create policy admin_read_self on public.admin_profiles for select to authenticated using ((select auth.uid())=id);
create policy admin_all_media on public.media_assets for all to authenticated using (public.is_super_admin()) with check(public.is_super_admin());
create policy public_read_media on public.media_assets for select to anon,authenticated using (is_public and kind <> 'qris');
create policy public_read_events on public.events for select to anon,authenticated using (status='published');
create policy admin_all_events on public.events for all to authenticated using (public.is_super_admin()) with check(public.is_super_admin());
create policy admin_all_registrations on public.registrations for all to authenticated using (public.is_super_admin()) with check(public.is_super_admin());
create policy admin_all_payments on public.payments for all to authenticated using (public.is_super_admin()) with check(public.is_super_admin());
create policy public_read_content on public.site_contents for select to anon,authenticated using (true);
create policy admin_all_content on public.site_contents for all to authenticated using (public.is_super_admin()) with check(public.is_super_admin());
create policy public_read_gallery on public.gallery_items for select to anon,authenticated using (is_published);
create policy admin_all_gallery on public.gallery_items for all to authenticated using (public.is_super_admin()) with check(public.is_super_admin());
create policy admin_read_logs on public.audit_logs for select to authenticated using (public.is_super_admin());

-- Public submissions are performed only through a trusted server endpoint, not by anon table INSERT.
-- For the service-role RPC invocation, ensure file proof has been successfully uploaded/validated first.
-- A single transaction holds the event lock, reserves capacity, creates the registration and records the proof.
create or replace function public.create_registration_with_proof(
 p_event_id uuid,
 p_name text,
 p_email text,
 p_whatsapp text,
 p_city text,
 p_motivation text,
 p_proof_path text default null
) returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 e public.events%rowtype;
 r public.registrations%rowtype;
 v_code text;
 v_count int;
begin
 -- Explicitly restrict to server secret/service role. A client browser must never execute this RPC.
 if auth.role() <> 'service_role' then raise exception 'not_authorized'; end if;
 select * into e from public.events where id=p_event_id for update;
 if not found or e.status <> 'published' then raise exception 'event_not_available'; end if;
 if e.registration_deadline is not null and now() > e.registration_deadline then raise exception 'registration_closed'; end if;
 if now() >= e.starts_at then raise exception 'event_started'; end if;
 if e.reserved_count >= e.quota then raise exception 'event_full'; end if;
 if e.type='paid' and (p_proof_path is null or length(trim(p_proof_path))=0 or e.qris_asset_id is null) then raise exception 'proof_required'; end if;
 if e.type='free' and p_proof_path is not null then raise exception 'proof_not_expected'; end if;
 if p_email is null or length(trim(p_email))=0 or p_name is null or length(trim(p_name))=0 then raise exception 'invalid_participant'; end if;
 if exists(select 1 from public.registrations where event_id=p_event_id and lower(email)=lower(trim(p_email))) then raise exception 'already_registered'; end if;
 v_code := 'BK-' || to_char(now() at time zone 'Asia/Jakarta','YYYYMM') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10));
 insert into public.registrations(code,event_id,name,email,whatsapp,city,motivation,status,amount_idr,expires_at)
 values (v_code,p_event_id,trim(p_name),lower(trim(p_email)),trim(p_whatsapp),trim(p_city),p_motivation,
  case when e.type='free' then 'confirmed'::public.registration_status else 'pending_verification'::public.registration_status end,
  e.price_idr,
  case when e.type='paid' then now()+make_interval(hours=>e.verification_ttl_hours) else null end
 ) returning * into r;
 if e.type='paid' then
   insert into public.payments(registration_id,proof_path) values(r.id,p_proof_path);
 end if;
 update public.events set reserved_count=reserved_count+1,updated_at=now() where id=e.id;
 return jsonb_build_object('registration_id',r.id,'registration_code',r.code,'status',r.status,'expires_at',r.expires_at);
end $$;

-- For consistency, updates to status and quota run as a single DB operation.
-- Expiry does NOT release already-confirmed registrations.
create or replace function public.expire_pending_registrations() returns integer language plpgsql security definer set search_path='' as $$
declare r record; v_count integer:=0; v_event_id uuid; v_status public.registration_status; v_held boolean; v_expires timestamptz;
begin
 if auth.role() <> 'service_role' then raise exception 'not_authorized'; end if;
 -- Lock order is event then registration, matching the payment-review handler.
 -- Selecting candidates without locking is safe because rows are rechecked under lock.
 for r in select id,event_id from public.registrations where status='pending_verification' and quota_held and expires_at<now() order by event_id,id loop
   select id into v_event_id from public.events where id=r.event_id for update;
   select status,quota_held,expires_at into v_status,v_held,v_expires from public.registrations where id=r.id for update;
   if v_status='pending_verification' and v_held and v_expires<now() then
     update public.events set reserved_count=reserved_count-1,updated_at=now() where id=r.event_id and reserved_count>0;
     update public.registrations set status='expired',quota_held=false,updated_at=now() where id=r.id;
     v_count:=v_count+1;
   end if;
 end loop;
 return v_count;
end $$;

revoke all on function public.create_registration_with_proof(uuid,text,text,text,text,text,text) from public,anon,authenticated;
revoke all on function public.expire_pending_registrations() from public,anon,authenticated;
grant execute on function public.create_registration_with_proof(uuid,text,text,text,text,text,text) to service_role;
grant execute on function public.expire_pending_registrations() to service_role;

-- Configure private Supabase Storage buckets via dashboard: payment-proofs (private), event-posters (public), gallery (public), qris-images (private server-served).
-- Enable Cron separately after testing the expiration function with actual service role privileges.
