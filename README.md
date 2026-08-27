# SIGAPUMKM

Sistem informasi full-stack untuk pendataan, monitoring perkembangan, dan analitik UMKM Kecamatan Tenggarong Seberang dan Kecamatan Anggana.

## Teknologi

- Next.js, TypeScript, dan Tailwind CSS
- Supabase PostgreSQL, Auth, dan Row Level Security
- Zod dan React Hook Form
- Recharts dan Lucide React

## Menjalankan secara lokal

Salin `.env.example` menjadi `.env.local`, isi konfigurasi Supabase, lalu jalankan:

```bash
npm install
npm run dev
```

Migration database tersedia di `supabase/migrations/001_initial_schema.sql`.
