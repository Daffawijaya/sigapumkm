import Link from "next/link";
import { ArrowRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  formatOrang,
  formatPersen,
  formatRupiah,
  formatTanggal,
} from "@/lib/format";
import { percentChange } from "@/lib/comparison";

const legalitas = [
  ["NIB", "memiliki_nib", "current_nib"],
  ["Halal", "memiliki_halal", "current_halal"],
  ["PIRT", "memiliki_pirt", "current_pirt"],
  ["HAKI", "memiliki_haki", "current_haki"],
] as const;
const digital = [
  ["WhatsApp Business", "memiliki_whatsapp_business", "current_wa"],
  ["Instagram", "memiliki_instagram", "current_instagram"],
  ["Facebook", "memiliki_facebook", "current_facebook"],
  ["TikTok", "memiliki_tiktok", "current_tiktok"],
] as const;

function ChangeValue({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const tone =
    value > 0
      ? "text-emerald-700"
      : value < 0
        ? "text-rose-700"
        : "text-slate-500";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${tone}`}
    >
      <Icon size={13} />
      {value > 0 ? "+" : ""}
      {value}
      {suffix}
    </span>
  );
}

export const dynamic = "force-dynamic";
export default async function MonitoringPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const size = 20;
  const supabase = await createClient();
  let query = supabase!
    .from("umkm_current")
    .select(
      "id,nama_usaha,nama_peserta,kategori_usaha,omzet,jumlah_tenaga_kerja,memiliki_nib,memiliki_halal,memiliki_pirt,memiliki_haki,memiliki_whatsapp_business,memiliki_instagram,memiliki_facebook,memiliki_tiktok,current_omzet,current_tenaga_kerja,current_nib,current_halal,current_pirt,current_haki,current_wa,current_instagram,current_facebook,current_tiktok,latest_monitoring_id,monitoring_ke,tanggal_monitoring,kecamatan(nama)",
      { count: "exact" },
    )
    .order("nama_usaha")
    .range((page - 1) * size, page * size - 1);
  if (params.q)
    query = query.or(
      `nama_usaha.ilike.%${params.q}%,nama_peserta.ilike.%${params.q}%`,
    );
  const { data: rawRows, count: rawCount } = await query;
  const rows = rawRows ?? [];
  const count = rawCount ?? 0;

  return (
    <main className="mx-auto max-w-[1600px] p-5 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            Baseline vs kondisi terbaru
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Perkembangan Seluruh UMKM
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Setiap baris membandingkan data awal dengan monitoring paling
            terakhir secara otomatis.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
          {count} UMKM
        </span>
      </div>
      <form className="mt-7 flex gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <input
          name="q"
          defaultValue={params.q}
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="Cari nama usaha atau peserta…"
        />
        <button className="rounded-md bg-slate-900 px-5 py-2 text-sm text-white">
          Cari
        </button>
        {params.q && (
          <Link
            href="/monitoring"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm"
          >
            Reset
          </Link>
        )}
      </form>
      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[1500px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {[
                "UMKM",
                "Monitoring terakhir",
                "Omzet awal → terbaru",
                "Pertumbuhan",
                "Tenaga kerja awal → terbaru",
                "Perubahan legalitas",
                "Perubahan kanal digital",
                "Status",
                "Aksi",
              ].map((heading) => (
                <th key={heading} className="px-4 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const monitored = Boolean(row.latest_monitoring_id);
              const omzetGrowth = monitored
                ? percentChange(Number(row.current_omzet), Number(row.omzet))
                : 0;
              const tenagaChange =
                Number(row.current_tenaga_kerja) -
                Number(row.jumlah_tenaga_kerja);
              const legalAdded = legalitas
                .filter(([, before, after]) => !row[before] && row[after])
                .map(([label]) => label);
              const legalRemoved = legalitas
                .filter(([, before, after]) => row[before] && !row[after])
                .map(([label]) => label);
              const digitalAdded = digital
                .filter(([, before, after]) => !row[before] && row[after])
                .map(([label]) => label);
              const digitalRemoved = digital
                .filter(([, before, after]) => row[before] && !row[after])
                .map(([label]) => label);
              const hasDecline =
                (omzetGrowth !== null && omzetGrowth < 0) ||
                tenagaChange < 0 ||
                legalRemoved.length > 0 ||
                digitalRemoved.length > 0;
              const hasGrowth =
                (omzetGrowth !== null && omzetGrowth > 0) ||
                tenagaChange > 0 ||
                legalAdded.length > 0 ||
                digitalAdded.length > 0;
              const status = !monitored
                ? "Belum Dimonitor"
                : hasDecline
                  ? "Perlu Perhatian"
                  : hasGrowth
                    ? "Berkembang"
                    : "Stabil";
              return (
                <tr key={row.id} className="align-top hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <p className="font-semibold">{row.nama_usaha}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {row.nama_peserta} · {row.kecamatan?.[0]?.nama}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {monitored ? (
                      <>
                        <p className="font-medium">
                          Monitoring {row.monitoring_ke}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatTanggal(row.tanggal_monitoring)}
                        </p>
                      </>
                    ) : (
                      <span className="text-slate-400">Belum ada</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span>{formatRupiah(row.omzet)}</span>
                      <ArrowRight size={14} className="text-slate-300" />
                      <strong>{formatRupiah(row.current_omzet)}</strong>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {!monitored ? (
                      <span className="text-slate-400">—</span>
                    ) : omzetGrowth === null ? (
                      <span className="text-emerald-700">Mulai tercatat</span>
                    ) : (
                      <span
                        className={`font-semibold ${omzetGrowth > 0 ? "text-emerald-700" : omzetGrowth < 0 ? "text-rose-700" : "text-slate-600"}`}
                      >
                        {formatPersen(omzetGrowth)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span>{formatOrang(row.jumlah_tenaga_kerja)}</span>
                      <ArrowRight size={14} className="text-slate-300" />
                      <strong>{formatOrang(row.current_tenaga_kerja)}</strong>
                    </div>
                    {monitored && (
                      <div className="mt-1">
                        <ChangeValue value={tenagaChange} suffix=" orang" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex max-w-[220px] flex-wrap gap-1">
                      {legalAdded.map((x) => (
                        <span
                          key={`a-${x}`}
                          className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
                        >
                          + {x}
                        </span>
                      ))}
                      {legalRemoved.map((x) => (
                        <span
                          key={`r-${x}`}
                          className="rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700"
                        >
                          − {x}
                        </span>
                      ))}
                      {monitored &&
                        legalAdded.length === 0 &&
                        legalRemoved.length === 0 && (
                          <span className="text-xs text-slate-400">Tetap</span>
                        )}
                      {!monitored && (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex max-w-[240px] flex-wrap gap-1">
                      {digitalAdded.map((x) => (
                        <span
                          key={`a-${x}`}
                          className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                        >
                          + {x}
                        </span>
                      ))}
                      {digitalRemoved.map((x) => (
                        <span
                          key={`r-${x}`}
                          className="rounded-full bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700"
                        >
                          − {x}
                        </span>
                      ))}
                      {monitored &&
                        digitalAdded.length === 0 &&
                        digitalRemoved.length === 0 && (
                          <span className="text-xs text-slate-400">Tetap</span>
                        )}
                      {!monitored && (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${status === "Berkembang" ? "bg-emerald-50 text-emerald-700" : status === "Perlu Perhatian" ? "bg-rose-50 text-rose-700" : status === "Stabil" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      className="font-medium text-emerald-700"
                      href={`/umkm/${row.id}`}
                    >
                      Lihat detail
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-medium">Belum ada data UMKM</p>
            <p className="mt-1 text-sm text-slate-500">
              Data perbandingan akan muncul setelah UMKM ditambahkan.
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span>
          Halaman {page} dari {Math.max(1, Math.ceil(count / size))}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              className="rounded-md border bg-white px-3 py-1.5"
              href={`?page=${page - 1}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`}
            >
              Sebelumnya
            </Link>
          )}
          {page * size < count && (
            <Link
              className="rounded-md border bg-white px-3 py-1.5"
              href={`?page=${page + 1}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`}
            >
              Berikutnya
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
