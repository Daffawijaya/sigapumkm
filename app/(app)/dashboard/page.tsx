import { DashboardCharts } from "@/components/dashboard/charts";
import { createClient } from "@/lib/supabase/server";
import { formatOrang, formatRupiah } from "@/lib/format";

export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ data: rawRows }, { data: rawDistricts }] = await Promise.all([
    supabase!
      .from("umkm_current")
      .select(
        "id,kecamatan_id,kategori_usaha,current_omzet,current_tenaga_kerja,latest_monitoring_id",
      ),
    supabase!.from("kecamatan").select("id,nama"),
  ]);
  const rows = rawRows ?? [];
  const districts = rawDistricts ?? [];
  const totalOmzet = rows.reduce((s, r) => s + Number(r.current_omzet), 0);
  const tenaga = rows.reduce((s, r) => s + Number(r.current_tenaga_kerja), 0);
  const monitored = rows.filter((r) => r.latest_monitoring_id).length;
  const cards = [
    { label: "Total UMKM", value: String(rows.length), note: "UMKM aktif" },
    {
      label: "Total omzet",
      value: formatRupiah(totalOmzet),
      note: "Kondisi terkini",
    },
    {
      label: "Total tenaga kerja",
      value: formatOrang(tenaga),
      note: "Terserap saat ini",
    },
    {
      label: "Sudah dimonitor",
      value: `${monitored} / ${rows.length}`,
      note: `${rows.length ? Math.round((monitored / rows.length) * 100) : 0}% cakupan`,
    },
  ];
  const category = ["Perdagangan", "Jasa", "Industri"].map((name) => ({
    name,
    value: rows.filter((r) => r.kategori_usaha === name).length,
  }));
  const district = districts.map((d) => ({
    name: d.nama,
    value: rows.filter((r) => r.kecamatan_id === d.id).length,
  }));
  return (
    <main className="mx-auto max-w-[1440px] p-5 md:p-8">
      <p className="text-sm font-medium text-emerald-700">Ringkasan wilayah</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Dashboard SIGAPUMKM
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Kondisi terkini UMKM berdasarkan baseline dan monitoring terbaru.
      </p>
      <div className="my-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <article
            key={c.label}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold">{c.value}</p>
            <p className="mt-2 text-xs text-slate-400">{c.note}</p>
          </article>
        ))}
      </div>
      <DashboardCharts category={category} district={district} />
    </main>
  );
}
