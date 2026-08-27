import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah, formatTanggal } from "@/lib/format";

export const dynamic = "force-dynamic";
export default async function UmkmPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const p = await searchParams;
  const page = Math.max(1, Number(p.page) || 1);
  const size = [10, 20, 50].includes(Number(p.size)) ? Number(p.size) : 10;
  const supabase = await createClient();
  let query = supabase!
    .from("umkm_current")
    .select(
      "id,nama_usaha,nama_peserta,kategori_usaha,jenis_usaha,current_omzet,monitoring_ke,created_at,kecamatan(nama)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * size, page * size - 1);
  if (p.q)
    query = query.or(
      `nama_usaha.ilike.%${p.q}%,nama_peserta.ilike.%${p.q}%,nik.ilike.%${p.q}%,nomor_kontak.ilike.%${p.q}%`,
    );
  if (p.kategori) query = query.eq("kategori_usaha", p.kategori);
  const { data: rawData, count: rawCount } = await query;
  const data = rawData ?? [];
  const count = rawCount ?? 0;
  return (
    <main className="mx-auto max-w-[1440px] p-5 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Data utama</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Data UMKM
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {count} UMKM sesuai cakupan akses Anda.
          </p>
        </div>
        <Link
          className="rounded-md bg-[#176b57] px-4 py-2.5 text-sm font-medium text-white"
          href="/umkm/tambah"
        >
          + Tambah Data
        </Link>
      </div>
      <form className="mt-7 grid gap-3 rounded-lg bg-white p-4 md:grid-cols-[1fr_200px_auto]">
        <input
          name="q"
          defaultValue={p.q}
          placeholder="Cari nama usaha, peserta, NIK, atau kontak…"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          name="kategori"
          defaultValue={p.kategori}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Semua kategori</option>
          <option>Perdagangan</option>
          <option>Jasa</option>
          <option>Industri</option>
        </select>
        <button className="rounded-md bg-slate-900 px-5 py-2 text-sm text-white">
          Terapkan
        </button>
      </form>
      <div className="mt-5 overflow-x-auto rounded-lg bg-white">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {[
                "Nama Usaha",
                "Peserta",
                "Kecamatan",
                "Kategori",
                "Omzet Terakhir",
                "Monitoring",
                "Tanggal Input",
                "Aksi",
              ].map((x) => (
                <th className="px-4 py-3" key={x}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 font-medium">
                  {r.nama_usaha}
                  <p className="text-xs font-normal text-slate-400">
                    {r.jenis_usaha}
                  </p>
                </td>
                <td className="px-4 py-4">{r.nama_peserta}</td>
                  <td className="px-4 py-4">{r.kecamatan?.[0]?.nama}</td>
                <td className="px-4 py-4">{r.kategori_usaha}</td>
                <td className="px-4 py-4 font-medium">
                  {formatRupiah(r.current_omzet)}
                </td>
                <td className="px-4 py-4">
                  {r.monitoring_ke ? `Monitoring ${r.monitoring_ke}` : "Belum"}
                </td>
                <td className="px-4 py-4">{formatTanggal(r.created_at)}</td>
                <td className="px-4 py-4">
                  <Link
                    className="font-medium text-emerald-700"
                    href={`/umkm/${r.id}`}
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-medium">Belum ada data UMKM</p>
            <p className="mt-1 text-sm text-slate-500">
              Mulai dengan menambahkan data UMKM pertama.
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <span>
          Halaman {page} dari {Math.max(1, Math.ceil(count / size))}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <Link
              className="rounded-md border bg-white px-3 py-1.5"
              href={`?page=${page - 1}&size=${size}`}
            >
              Sebelumnya
            </Link>
          )}
          {page * size < count && (
            <Link
              className="rounded-md border bg-white px-3 py-1.5"
              href={`?page=${page + 1}&size=${size}`}
            >
              Berikutnya
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
