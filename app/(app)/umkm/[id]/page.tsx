import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatOrang, formatRupiah, formatTanggal } from "@/lib/format";
import { growthStatus, percentChange } from "@/lib/comparison";
import { SnapshotComparison, type MonitoringSnapshot } from "@/components/umkm/snapshot-comparison";

export default async function DetailUmkmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: u }, { data: rawMonitorings }, { data: rawKbli }] =
    await Promise.all([
      supabase!
        .from("umkm_current")
        .select("*,kecamatan(nama)")
        .eq("id", id)
        .single(),
      supabase!
        .from("umkm_monitoring")
        .select("*")
        .eq("umkm_id", id)
        .order("monitoring_ke", { ascending: false }),
      supabase!.from("kbli").select("*").eq("umkm_id", id),
    ]);
  if (!u) notFound();
  const monitorings = rawMonitorings ?? [];
  const kbli = rawKbli ?? [];
  const latest = monitorings[0];
  const previous = monitorings[1];
  const baseline = { ...u };
  const current = latest ? latest : undefined;
  const status = growthStatus(baseline, current);
  const change = latest
    ? percentChange(Number(latest.omzet), Number(u.omzet))
    : null;
  const toSnapshot = (row: Record<string, unknown>, label: string): MonitoringSnapshot => ({
    label,
    omzet: Number(row.omzet ?? 0),
    tenagaKerja: Number(row.jumlah_tenaga_kerja ?? 0),
    legalitas: [row.memiliki_nib, row.memiliki_halal, row.memiliki_pirt, row.memiliki_haki].filter(Boolean).length,
    digitalisasi: [row.memiliki_whatsapp_business, row.memiliki_instagram, row.memiliki_facebook, row.memiliki_tiktok].filter(Boolean).length,
  });
  const baselineSnapshot = toSnapshot(u, "Baseline");
  const latestSnapshot = latest ? toSnapshot(latest, `Monitoring ${latest.monitoring_ke}`) : undefined;
  const previousSnapshot = previous ? toSnapshot(previous, `Monitoring ${previous.monitoring_ke}`) : baselineSnapshot;
  return (
    <main className="mx-auto max-w-[1280px] p-5 md:p-8">
      <p className="text-sm text-slate-500">
        <Link href="/umkm">Data UMKM</Link> / Detail
      </p>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              {u.nama_usaha}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${status === "Berkembang" ? "bg-emerald-50 text-emerald-700" : status === "Perlu Perhatian" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"}`}
            >
              {status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {u.nama_peserta} · {u.kecamatan?.nama} · {u.kategori_usaha}
          </p>
        </div>
        <Link
          href={`/umkm/${id}/monitoring/tambah`}
          className="rounded-md bg-[#176b57] px-4 py-2.5 text-sm font-medium text-white"
        >
          + Tambah Monitoring
        </Link>
      </div>
      <div className="mt-7 grid gap-3 md:grid-cols-4">
        {[
          {
            l: "Omzet terkini",
            v: formatRupiah(u.current_omzet),
            n: latest
              ? change === null
                ? "Omzet mulai tercatat"
                : `${change! >= 0 ? "+" : ""}${change!.toFixed(1)}% dari baseline`
              : "Baseline",
          },
          {
            l: "Tenaga kerja",
            v: formatOrang(u.current_tenaga_kerja),
            n: "Kondisi terkini",
          },
          {
            l: "Legalitas",
            v: `${[u.current_nib, u.current_halal, u.current_pirt, u.current_haki].filter(Boolean).length}/4`,
            n: "Dokumen aktif",
          },
          {
            l: "Digitalisasi",
            v: `${[u.current_wa, u.current_instagram, u.current_facebook, u.current_tiktok].filter(Boolean).length}/4`,
            n: "Kanal aktif",
          },
        ].map((x) => (
          <article
            key={x.l}
            className="rounded-lg bg-white p-5"
          >
            <p className="text-sm text-slate-500">{x.l}</p>
            <p className="mt-2 text-xl font-semibold">{x.v}</p>
            <p className="mt-2 text-xs text-slate-400">{x.n}</p>
          </article>
        ))}
      </div>
      <SnapshotComparison baseline={baselineSnapshot} latest={latestSnapshot} previous={previousSnapshot} />
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <section className="rounded-lg bg-white p-6">
          <h2 className="font-semibold">Data usaha & peserta</h2>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            {[
              ["Nama peserta", u.nama_peserta],
              ["NIK", u.nik],
              ["Jenis usaha", u.jenis_usaha],
              ["Tahun mulai", u.tahun_mulai_usaha],
              ["Nomor kontak", u.nomor_kontak],
              ["Alamat", u.alamat],
            ].map(([a, b]) => (
              <div key={a}>
                <dt className="text-slate-400">{a}</dt>
                <dd className="mt-1 font-medium">{b}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-7 font-semibold">KBLI Baseline</h3>
          <div className="mt-3 space-y-2">
            {kbli.map((k) => (
              <div key={k.id} className="rounded-md bg-slate-50 p-3 text-sm">
                <b>{k.kode}</b> — {k.nama}
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg bg-white p-6">
          <h2 className="font-semibold">Timeline perkembangan</h2>
          <div className="mt-5 border-l-2 border-slate-200 pl-5">
            <div className="relative pb-7">
              <i className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-emerald-600" />
              <p className="font-medium">Baseline</p>
              <p className="text-xs text-slate-400">
                {formatTanggal(u.created_at)}
              </p>
            </div>
            {[...monitorings].reverse().map((m) => (
              <Link
                href={`/umkm/${id}/monitoring/${m.id}`}
                key={m.id}
                className="relative block pb-7"
              >
                <i className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-white ring-2 ring-emerald-600" />
                <p className="font-medium">Monitoring {m.monitoring_ke}</p>
                <p className="text-xs text-slate-400">
                  {formatTanggal(m.tanggal_monitoring)} ·{" "}
                  {formatRupiah(m.omzet)}
                </p>
              </Link>
            ))}
          </div>
          {monitorings.length === 0 && (
            <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">
              UMKM ini belum pernah dimonitor.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
