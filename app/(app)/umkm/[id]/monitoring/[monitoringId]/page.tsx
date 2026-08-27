import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatOrang, formatRupiah, formatTanggal } from "@/lib/format";
import { percentChange } from "@/lib/comparison";
export default async function MonitoringDetail({
  params,
}: {
  params: Promise<{ id: string; monitoringId: string }>;
}) {
  const { id, monitoringId } = await params;
  const supabase = await createClient();
  const [{ data: u }, { data: m }] = await Promise.all([
    supabase!.from("umkm").select("*").eq("id", id).single(),
    supabase!
      .from("umkm_monitoring")
      .select("*")
      .eq("id", monitoringId)
      .eq("umkm_id", id)
      .single(),
  ]);
  if (!u || !m) notFound();
  const { data: prev } = await supabase!
    .from("umkm_monitoring")
    .select("*")
    .eq("umkm_id", id)
    .lt("monitoring_ke", m.monitoring_ke)
    .order("monitoring_ke", { ascending: false })
    .limit(1)
    .maybeSingle();
  const compare = prev ?? u;
  return (
    <main className="mx-auto max-w-5xl p-5 md:p-8">
      <p className="text-sm text-slate-500">
        {u.nama_usaha} · {formatTanggal(m.tanggal_monitoring)}
      </p>
      <h1 className="mt-2 text-3xl font-semibold">
        Monitoring {m.monitoring_ke}
      </h1>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <article className="rounded-lg bg-white p-6">
          <p className="text-sm text-slate-500">Omzet</p>
          <p className="mt-2 text-2xl font-semibold">{formatRupiah(m.omzet)}</p>
          <p className="mt-2 text-sm text-emerald-700">
            {percentChange(Number(m.omzet), Number(compare.omzet))?.toFixed(
              1,
            ) ?? "Mulai tercatat"}
            % dari kondisi sebelumnya
          </p>
        </article>
        <article className="rounded-lg bg-white p-6">
          <p className="text-sm text-slate-500">Tenaga kerja</p>
          <p className="mt-2 text-2xl font-semibold">
            {formatOrang(m.jumlah_tenaga_kerja)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {m.jumlah_tenaga_kerja - compare.jumlah_tenaga_kerja >= 0
              ? "+"
              : ""}
            {m.jumlah_tenaga_kerja - compare.jumlah_tenaga_kerja} dari kondisi
            sebelumnya
          </p>
        </article>
      </div>
      <section className="mt-5 rounded-lg bg-white p-6">
        <h2 className="font-semibold">Kondisi & tindak lanjut</h2>
        <dl className="mt-5 grid gap-5 md:grid-cols-2">
          {[
            ["Kebutuhan utama", m.kebutuhan_utama],
            ["Kendala", m.kendala],
            ["Catatan", m.catatan],
            ["Tindak lanjut", m.tindak_lanjut],
          ].map(([a, b]) => (
            <div key={a}>
              <dt className="text-sm text-slate-400">{a}</dt>
              <dd className="mt-1 text-sm">{b || "—"}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
