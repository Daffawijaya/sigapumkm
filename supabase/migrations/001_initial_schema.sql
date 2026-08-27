create extension if not exists pgcrypto;
create type public.user_role as enum ('ADMIN','KECAMATAN');
create type public.kategori_usaha as enum ('Perdagangan','Jasa','Industri');

create table public.kecamatan (
  id uuid primary key default gen_random_uuid(), nama text not null unique,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
insert into public.kecamatan (nama) values ('Tenggarong Seberang'), ('Anggana') on conflict do nothing;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade, name text not null,
  role public.user_role not null, kecamatan_id uuid references public.kecamatan(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint profile_scope check ((role = 'ADMIN' and kecamatan_id is null) or (role = 'KECAMATAN' and kecamatan_id is not null))
);

create table public.umkm (
  id uuid primary key default gen_random_uuid(), kecamatan_id uuid not null references public.kecamatan(id), created_by uuid not null references auth.users(id),
  nama_peserta text not null, nik text not null check (nik ~ '^\d{16}$'), nama_usaha text not null, alamat text not null, nomor_kontak text not null,
  kategori_usaha public.kategori_usaha not null, jenis_usaha text not null, tahun_mulai_usaha integer not null check (tahun_mulai_usaha between 1900 and extract(year from now())::int),
  jumlah_tenaga_kerja integer not null check (jumlah_tenaga_kerja >= 0), omzet numeric(18,2) not null check (omzet >= 0),
  memiliki_nib boolean not null default false, nomor_nib text, memiliki_halal boolean not null default false, nomor_halal text,
  memiliki_pirt boolean not null default false, nomor_pirt text, memiliki_haki boolean not null default false, nomor_haki text,
  memiliki_whatsapp_business boolean not null default false, whatsapp_business text, memiliki_instagram boolean not null default false, instagram text,
  memiliki_facebook boolean not null default false, facebook text, memiliki_tiktok boolean not null default false, tiktok text, kebutuhan_utama text not null default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint umkm_nib check (memiliki_nib or nomor_nib is null), constraint umkm_halal check (memiliki_halal or nomor_halal is null),
  constraint umkm_pirt check (memiliki_pirt or nomor_pirt is null), constraint umkm_haki check (memiliki_haki or nomor_haki is null),
  constraint umkm_wa check (memiliki_whatsapp_business or whatsapp_business is null), constraint umkm_ig check (memiliki_instagram or instagram is null),
  constraint umkm_fb check (memiliki_facebook or facebook is null), constraint umkm_tt check (memiliki_tiktok or tiktok is null)
);

create table public.kbli (
  id uuid primary key default gen_random_uuid(), umkm_id uuid not null references public.umkm(id) on delete cascade,
  kode text not null, nama text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(umkm_id,kode)
);

create table public.umkm_monitoring (
  id uuid primary key default gen_random_uuid(), umkm_id uuid not null references public.umkm(id) on delete cascade,
  kecamatan_id uuid not null references public.kecamatan(id), created_by uuid not null references auth.users(id), tanggal_monitoring date not null,
  monitoring_ke integer not null check (monitoring_ke > 0), omzet numeric(18,2) not null check (omzet >= 0), jumlah_tenaga_kerja integer not null check (jumlah_tenaga_kerja >= 0),
  memiliki_nib boolean not null, nomor_nib text, memiliki_halal boolean not null, nomor_halal text, memiliki_pirt boolean not null, nomor_pirt text,
  memiliki_haki boolean not null, nomor_haki text, memiliki_whatsapp_business boolean not null, whatsapp_business text,
  memiliki_instagram boolean not null, instagram text, memiliki_facebook boolean not null, facebook text, memiliki_tiktok boolean not null, tiktok text,
  kebutuhan_utama text not null default '', catatan text not null default '', kendala text not null default '', tindak_lanjut text not null default '',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(umkm_id, monitoring_ke)
);

create table public.monitoring_kbli (
  id uuid primary key default gen_random_uuid(), monitoring_id uuid not null references public.umkm_monitoring(id) on delete cascade,
  kode text not null, nama text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(monitoring_id,kode)
);

create index umkm_kecamatan_idx on public.umkm(kecamatan_id); create index umkm_created_by_idx on public.umkm(created_by);
create index umkm_nama_usaha_idx on public.umkm using gin (to_tsvector('simple', nama_usaha)); create index umkm_nik_idx on public.umkm(nik);
create index umkm_kategori_idx on public.umkm(kategori_usaha); create index umkm_created_at_idx on public.umkm(created_at desc);
create index monitoring_umkm_idx on public.umkm_monitoring(umkm_id, monitoring_ke desc); create index monitoring_kecamatan_idx on public.umkm_monitoring(kecamatan_id);
create index monitoring_tanggal_idx on public.umkm_monitoring(tanggal_monitoring desc); create index monitoring_created_idx on public.umkm_monitoring(created_at desc);

create or replace function public.my_profile() returns public.profiles language sql stable security definer set search_path = public as $$ select * from public.profiles where id = auth.uid() $$;
revoke all on function public.my_profile() from public; grant execute on function public.my_profile() to authenticated;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select coalesce((select role = 'ADMIN' from public.profiles where id = auth.uid()), false) $$;
create or replace function public.my_kecamatan_id() returns uuid language sql stable security definer set search_path = public as $$ select kecamatan_id from public.profiles where id = auth.uid() $$;

alter table public.profiles enable row level security; alter table public.umkm enable row level security; alter table public.kbli enable row level security;
alter table public.umkm_monitoring enable row level security; alter table public.monitoring_kbli enable row level security;
create policy profiles_read_self_or_admin on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy umkm_select on public.umkm for select using (public.is_admin() or kecamatan_id = public.my_kecamatan_id());
create policy umkm_insert on public.umkm for insert with check (created_by = auth.uid() and (public.is_admin() or kecamatan_id = public.my_kecamatan_id()));
create policy umkm_update on public.umkm for update using (public.is_admin() or kecamatan_id = public.my_kecamatan_id()) with check (public.is_admin() or kecamatan_id = public.my_kecamatan_id());
create policy umkm_delete on public.umkm for delete using (public.is_admin() or kecamatan_id = public.my_kecamatan_id());
create policy kbli_all on public.kbli for all using (exists(select 1 from public.umkm u where u.id=umkm_id and (public.is_admin() or u.kecamatan_id=public.my_kecamatan_id()))) with check (exists(select 1 from public.umkm u where u.id=umkm_id and (public.is_admin() or u.kecamatan_id=public.my_kecamatan_id())));
create policy monitoring_select on public.umkm_monitoring for select using (public.is_admin() or kecamatan_id=public.my_kecamatan_id());
create policy monitoring_insert on public.umkm_monitoring for insert with check (created_by=auth.uid() and (public.is_admin() or kecamatan_id=public.my_kecamatan_id()));
create policy monitoring_update on public.umkm_monitoring for update using (public.is_admin() or kecamatan_id=public.my_kecamatan_id()) with check (public.is_admin() or kecamatan_id=public.my_kecamatan_id());
create policy monitoring_delete on public.umkm_monitoring for delete using (public.is_admin() or kecamatan_id=public.my_kecamatan_id());
create policy monitoring_kbli_all on public.monitoring_kbli for all using (exists(select 1 from public.umkm_monitoring m where m.id=monitoring_id and (public.is_admin() or m.kecamatan_id=public.my_kecamatan_id()))) with check (exists(select 1 from public.umkm_monitoring m where m.id=monitoring_id and (public.is_admin() or m.kecamatan_id=public.my_kecamatan_id())));

create or replace function public.create_umkm(payload jsonb, kbli_rows jsonb default '[]') returns uuid language plpgsql security invoker set search_path=public as $$
declare new_id uuid; p public.profiles;
begin
  select * into strict p from public.profiles where id=auth.uid();
  insert into public.umkm (kecamatan_id,created_by,nama_peserta,nik,nama_usaha,alamat,nomor_kontak,kategori_usaha,jenis_usaha,tahun_mulai_usaha,jumlah_tenaga_kerja,omzet,memiliki_nib,nomor_nib,memiliki_halal,nomor_halal,memiliki_pirt,nomor_pirt,memiliki_haki,nomor_haki,memiliki_whatsapp_business,whatsapp_business,memiliki_instagram,instagram,memiliki_facebook,facebook,memiliki_tiktok,tiktok,kebutuhan_utama)
  values (case when p.role='ADMIN' then (payload->>'kecamatan_id')::uuid else p.kecamatan_id end,auth.uid(),payload->>'nama_peserta',payload->>'nik',payload->>'nama_usaha',payload->>'alamat',payload->>'nomor_kontak',(payload->>'kategori_usaha')::public.kategori_usaha,payload->>'jenis_usaha',(payload->>'tahun_mulai_usaha')::int,(payload->>'jumlah_tenaga_kerja')::int,(payload->>'omzet')::numeric,(payload->>'memiliki_nib')::boolean,nullif(payload->>'nomor_nib',''),(payload->>'memiliki_halal')::boolean,nullif(payload->>'nomor_halal',''),(payload->>'memiliki_pirt')::boolean,nullif(payload->>'nomor_pirt',''),(payload->>'memiliki_haki')::boolean,nullif(payload->>'nomor_haki',''),(payload->>'memiliki_whatsapp_business')::boolean,nullif(payload->>'whatsapp_business',''),(payload->>'memiliki_instagram')::boolean,nullif(payload->>'instagram',''),(payload->>'memiliki_facebook')::boolean,nullif(payload->>'facebook',''),(payload->>'memiliki_tiktok')::boolean,nullif(payload->>'tiktok',''),coalesce(payload->>'kebutuhan_utama','')) returning id into new_id;
  insert into public.kbli(umkm_id,kode,nama) select new_id,x.kode,x.nama from jsonb_to_recordset(kbli_rows) as x(kode text,nama text);
  return new_id;
end $$;

create or replace function public.create_monitoring(payload jsonb, kbli_rows jsonb default '[]') returns uuid language plpgsql security invoker set search_path=public as $$
declare new_id uuid; target public.umkm; next_no int;
begin
  select * into strict target from public.umkm where id=(payload->>'umkm_id')::uuid for update;
  select coalesce(max(monitoring_ke),0)+1 into next_no from public.umkm_monitoring where umkm_id=target.id;
  insert into public.umkm_monitoring (umkm_id,kecamatan_id,created_by,tanggal_monitoring,monitoring_ke,omzet,jumlah_tenaga_kerja,memiliki_nib,nomor_nib,memiliki_halal,nomor_halal,memiliki_pirt,nomor_pirt,memiliki_haki,nomor_haki,memiliki_whatsapp_business,whatsapp_business,memiliki_instagram,instagram,memiliki_facebook,facebook,memiliki_tiktok,tiktok,kebutuhan_utama,catatan,kendala,tindak_lanjut)
  values(target.id,target.kecamatan_id,auth.uid(),(payload->>'tanggal_monitoring')::date,next_no,(payload->>'omzet')::numeric,(payload->>'jumlah_tenaga_kerja')::int,(payload->>'memiliki_nib')::boolean,nullif(payload->>'nomor_nib',''),(payload->>'memiliki_halal')::boolean,nullif(payload->>'nomor_halal',''),(payload->>'memiliki_pirt')::boolean,nullif(payload->>'nomor_pirt',''),(payload->>'memiliki_haki')::boolean,nullif(payload->>'nomor_haki',''),(payload->>'memiliki_whatsapp_business')::boolean,nullif(payload->>'whatsapp_business',''),(payload->>'memiliki_instagram')::boolean,nullif(payload->>'instagram',''),(payload->>'memiliki_facebook')::boolean,nullif(payload->>'facebook',''),(payload->>'memiliki_tiktok')::boolean,nullif(payload->>'tiktok',''),coalesce(payload->>'kebutuhan_utama',''),coalesce(payload->>'catatan',''),coalesce(payload->>'kendala',''),coalesce(payload->>'tindak_lanjut','')) returning id into new_id;
  insert into public.monitoring_kbli(monitoring_id,kode,nama) select new_id,x.kode,x.nama from jsonb_to_recordset(kbli_rows) as x(kode text,nama text); return new_id;
end $$;
grant execute on function public.create_umkm(jsonb,jsonb), public.create_monitoring(jsonb,jsonb) to authenticated;

create view public.umkm_current with (security_invoker=true) as
select u.*, m.id as latest_monitoring_id, m.monitoring_ke, m.tanggal_monitoring,
  coalesce(m.omzet,u.omzet) as current_omzet, coalesce(m.jumlah_tenaga_kerja,u.jumlah_tenaga_kerja) as current_tenaga_kerja,
  coalesce(m.memiliki_nib,u.memiliki_nib) as current_nib, coalesce(m.memiliki_halal,u.memiliki_halal) as current_halal,
  coalesce(m.memiliki_pirt,u.memiliki_pirt) as current_pirt, coalesce(m.memiliki_haki,u.memiliki_haki) as current_haki,
  coalesce(m.memiliki_whatsapp_business,u.memiliki_whatsapp_business) as current_wa, coalesce(m.memiliki_instagram,u.memiliki_instagram) as current_instagram,
  coalesce(m.memiliki_facebook,u.memiliki_facebook) as current_facebook, coalesce(m.memiliki_tiktok,u.memiliki_tiktok) as current_tiktok,
  coalesce(m.kebutuhan_utama,u.kebutuhan_utama) as current_kebutuhan
from public.umkm u left join lateral (select * from public.umkm_monitoring mm where mm.umkm_id=u.id order by mm.monitoring_ke desc limit 1) m on true;
grant select on public.umkm_current to authenticated;
