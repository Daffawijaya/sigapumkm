import Link from "next/link";
import {
  Building2,
  ClipboardCheck,
  TrendingUp,
  Shield,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";

export default async function Home() {
  const supabase = await createClient();
  let totalUmkm = 0;
  let totalOmzet = 0;
  let monitored = 0;
  let kecamatanCount = 0;

  if (supabase) {
    const [{ count }, { data: omzetRows }, { count: monCount }, { data: kec }] =
      await Promise.all([
        supabase.from("umkm_current").select("*", { count: "exact", head: true }),
        supabase.from("umkm_current").select("current_omzet"),
        supabase
          .from("umkm_current")
          .select("*", { count: "exact", head: true })
          .not("latest_monitoring_id", "is", null),
        supabase.from("kecamatan").select("id"),
      ]);
    totalUmkm = count ?? 0;
    totalOmzet = (omzetRows ?? []).reduce(
      (s, r) => s + Number(r.current_omzet ?? 0),
      0,
    );
    monitored = monCount ?? 0;
    kecamatanCount = (kec ?? []).length;
  }

  const coverage =
    totalUmkm > 0 ? Math.round((monitored / totalUmkm) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#f5f7f6] text-slate-900">
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#103b33] font-bold text-lime-200">
            S
          </div>
          <span className="text-lg font-semibold tracking-tight">
            SIGAPUMKM
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Masuk
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-[#176b57] px-4 py-2 text-sm font-medium text-white"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pt-20 pb-24 text-center md:pt-32 md:pb-36">
        <p className="text-sm font-medium text-[#176b57]">
          Sistem Informasi UMKM
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl md:leading-tight">
          Pantau perkembangan
          <br />
          UMKM secara <span className="text-[#176b57]">utuh</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-slate-500 md:text-lg">
          Dari baseline hingga tindak lanjut — satu ruang kerja untuk
          mendata, memonitor, dan melihat pertumbuhan UMKM di Tenggarong
          Seberang dan Anggana.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-[#176b57] px-6 py-3 text-sm font-medium text-white"
          >
            Mulai Sekarang
          </Link>
          <a
            href="#fitur"
            className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Total UMKM",
              value: totalUmkm.toLocaleString("id-ID"),
              icon: Building2,
              color: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Omzet Terkini",
              value: formatRupiah(totalOmzet),
              icon: TrendingUp,
              color: "bg-blue-50 text-blue-700",
            },
            {
              label: "Sudah Dimonitor",
              value: `${monitored} / ${totalUmkm}`,
              icon: ClipboardCheck,
              color: "bg-amber-50 text-amber-700",
            },
            {
              label: "Kecamatan",
              value: String(kecamatanCount),
              icon: Building2,
              color: "bg-rose-50 text-rose-700",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white p-5">
              <div
                className={`mb-3 inline-flex rounded-lg p-2 ${s.color}`}
              >
                <s.icon size={18} />
              </div>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fitur" className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Semua yang dibutuhkan, tanpa ribet
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
            Fitur dirancang sesuai kebutuhan pendataan dan monitoring UMKM
            di lapangan.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: ClipboardCheck,
              title: "Monitoring Berkala",
              desc: "Catat perkembangan omzet, tenaga kerja, legalitas, dan digitalisasi UMKM dari waktu ke waktu.",
            },
            {
              icon: TrendingUp,
              title: "Perbandingan Otomatis",
              desc: "Lihat perubahan dari baseline ke kondisi terbaru — pertumbuhan dan penurunan terdeteksi otomatis.",
            },
            {
              icon: Shield,
              title: "Legalitas & Digital",
              desc: "Pantau status NIB, Halal, PIRT, HAKI, serta kehadiran di WhatsApp, Instagram, Facebook, dan TikTok.",
            },
            {
              icon: Building2,
              title: "Per Kecamatan",
              desc: "Data terstruktur per kecamatan dengan akses terbatas sesuai peran pengguna.",
            },
            {
              icon: Smartphone,
              title: "Digitalisasi UMKM",
              desc: "Tandai kanal digital yang digunakan dan lacak perkembangan kehadiran online.",
            },
            {
              icon: ArrowRight,
              title: "Tindak Lanjut",
              desc: "Dokumentasi kebutuhan utama, kendala, dan langkah tindak lanjut untuk setiap UMKM.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl bg-white p-6">
              <div className="mb-4 inline-flex rounded-lg bg-[#176b57]/10 p-2.5 text-[#176b57]">
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {coverage > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="overflow-hidden rounded-2xl bg-[#103b33] p-10 text-center text-white md:p-16">
            <p className="text-sm font-medium text-lime-200">Cakupan monitoring</p>
            <p className="mt-3 text-5xl font-semibold md:text-7xl">
              {coverage}%
            </p>
            <p className="mt-3 text-sm text-emerald-100/60">
              UMKM sudah terpantau dari {totalUmkm} total data
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-[#103b33]"
            >
              Lihat Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-xs text-slate-400">
          <p>SIGAPUMKM — Sistem Informasi Pendataan & Monitoring UMKM</p>
          <p className="mt-1">
            Kecamatan Tenggarong Seberang & Anggana, Kutai Kartanegara
          </p>
        </div>
      </footer>
    </main>
  );
}
