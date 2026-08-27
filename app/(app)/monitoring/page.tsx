import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah, formatTanggal } from "@/lib/format";
export default async function MonitoringPage() {
  const supabase = await createClient();
  const { data: rawData } = await supabase!
    .from("umkm_monitoring")
    .select(
      "id,umkm_id,monitoring_ke,tanggal_monitoring,omzet,jumlah_tenaga_kerja,umkm(nama_usaha),kecamatan(nama),profiles(name)",
    )
    .order("tanggal_monitoring", { ascending: false })
    .limit(100);
  const data = rawData ?? [];
  return (
    <main className="mx-auto max-w-[1440px] p-5 md:p-8">
      <h1 className="text-3xl font-semibold">Riwayat Monitoring</h1>
      <p className="mt-2 text-sm text-slate-500">
        Seluruh snapshot kondisi sesuai cakupan akses Anda.
      </p>
      <div className="mt-7 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                "Nama usaha",
                "Kecamatan",
                "Monitoring",
                "Tanggal",
                "Omzet",
                "Tenaga kerja",
                "Aksi",
              ].map((x) => (
                <th key={x} className="px-4 py-3">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((m) => (
              <tr key={m.id}>
                  <td className="px-4 py-4 font-medium">{m.umkm?.[0]?.nama_usaha}</td>
                  <td className="px-4 py-4">{m.kecamatan?.[0]?.nama}</td>
                <td className="px-4 py-4">Monitoring {m.monitoring_ke}</td>
                <td className="px-4 py-4">
                  {formatTanggal(m.tanggal_monitoring)}
                </td>
                <td className="px-4 py-4">{formatRupiah(m.omzet)}</td>
                <td className="px-4 py-4">{m.jumlah_tenaga_kerja}</td>
                <td className="px-4 py-4">
                  <Link
                    className="text-emerald-700"
                    href={`/umkm/${m.umkm_id}/monitoring/${m.id}`}
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
