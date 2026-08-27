import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MonitoringForm } from "@/features/monitoring/monitoring-form";
export default async function AddMonitoringPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: u }, { data: last }, { data: baselineKbli = [] }] =
    await Promise.all([
      supabase!.from("umkm").select("*").eq("id", id).single(),
      supabase!
        .from("umkm_monitoring")
        .select("*")
        .eq("umkm_id", id)
        .order("monitoring_ke", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase!.from("kbli").select("kode,nama").eq("umkm_id", id),
    ]);
  if (!u) notFound();
  const defaults = { ...(last ?? u), kbli: baselineKbli };
  return (
    <main className="mx-auto max-w-5xl p-5 md:p-8">
      <p className="text-sm text-slate-500">{u.nama_usaha} / Monitoring</p>
      <h1 className="mt-2 text-3xl font-semibold">Tambah Monitoring</h1>
      <p className="mt-2 text-sm text-slate-500">
        Form telah diisi dengan kondisi terbaru. Ubah hanya data yang
        berkembang.
      </p>
      <div className="mt-7">
        <MonitoringForm umkmId={id} defaults={defaults} />
      </div>
    </main>
  );
}
