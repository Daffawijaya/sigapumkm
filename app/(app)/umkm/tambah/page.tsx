import { UmkmForm } from "@/features/umkm/umkm-form";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
export default async function TambahUmkmPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase!
    .from("kecamatan")
    .select("id,nama")
    .order("nama");
  return (
    <main className="mx-auto max-w-5xl p-5 md:p-8">
      <p className="text-sm text-slate-500">Data UMKM / Tambah</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Pendataan awal UMKM
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Data ini menjadi baseline dan tidak berubah saat monitoring berikutnya.
      </p>
      <div className="mt-7">
        <UmkmForm districts={data ?? []} isAdmin={profile.role === "ADMIN"} />
      </div>
    </main>
  );
}
