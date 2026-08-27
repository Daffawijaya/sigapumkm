const stats = [
  {
    label: "Total UMKM",
    value: "—",
    note: "Data aktif",
    color: "bg-emerald-500",
  },
  {
    label: "Total omzet",
    value: "Rp —",
    note: "Kondisi terkini",
    color: "bg-blue-500",
  },
  {
    label: "Sudah dimonitor",
    value: "—",
    note: "Cakupan monitoring",
    color: "bg-amber-500",
  },
  {
    label: "Perlu perhatian",
    value: "—",
    note: "Butuh tindak lanjut",
    color: "bg-rose-500",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f7f6] text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#103b33] px-5 py-6 text-white lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 pb-6">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-lime-200 font-bold text-[#103b33]">
            S
          </div>
          <div>
            <p className="font-semibold tracking-tight">SIGAPUMKM</p>
            <p className="text-xs text-emerald-100/60">Kutai Kartanegara</p>
          </div>
        </div>
        <nav className="mt-7 space-y-1" aria-label="Navigasi utama">
          {["Dashboard", "Data UMKM", "Monitoring"].map((item, index) => (
            <a
              key={item}
              href="#"
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm ${index === 0 ? "bg-white/10 font-medium" : "text-emerald-50/70 hover:bg-white/5"}`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {item}
            </a>
          ))}
        </nav>
        <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium">Administrator</p>
          <p className="mt-1 text-xs text-emerald-100/60">
            Akses seluruh kecamatan
          </p>
        </div>
      </aside>

      <section className="lg:ml-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">
          <div>
            <p className="text-xs text-slate-500">Sistem Informasi UMKM</p>
            <p className="text-sm font-semibold">Monitoring Terpadu</p>
          </div>
          <button className="rounded-md bg-[#176b57] px-4 py-2 text-sm font-medium text-white shadow-sm">
            + Tambah Data UMKM
          </button>
        </header>

        <div className="mx-auto max-w-[1440px] p-5 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-[#176b57]">
                Ringkasan wilayah
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                Dashboard SIGAPUMKM
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Pantau pertumbuhan usaha, legalitas, digitalisasi, dan kebutuhan
                tindak lanjut UMKM Tenggarong Seberang dan Anggana.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Data diperbarui setelah sinkronisasi
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-lg bg-white p-5"
              >
                <div className={`mb-4 h-1 w-9 rounded-full ${stat.color}`} />
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-slate-400">{stat.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,.7fr)]">
            <article className="rounded-lg bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">Tren omzet UMKM</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Rata-rata kondisi terbaru per bulan
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Data aktual
                </span>
              </div>
              <div className="mt-8 grid h-60 place-items-center rounded-md border border-dashed border-slate-200 bg-slate-50/70 text-center">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Grafik siap menampilkan data
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Hubungkan Supabase untuk melihat tren aktual
                  </p>
                </div>
              </div>
            </article>
            <article className="rounded-lg bg-[#173f37] p-5 text-white">
              <p className="text-sm font-medium text-emerald-100">
                Cakupan monitoring
              </p>
              <div className="mx-auto my-7 grid h-36 w-36 place-items-center rounded-full border-[12px] border-white/10 border-t-lime-300">
                <div className="text-center">
                  <p className="text-3xl font-semibold">—%</p>
                  <p className="text-[11px] text-emerald-100/60">terpantau</p>
                </div>
              </div>
              <p className="text-center text-xs leading-5 text-emerald-100/70">
                Monitoring berkala membantu mengidentifikasi UMKM yang
                berkembang dan memerlukan perhatian.
              </p>
            </article>
          </div>

          <article className="mt-5 overflow-hidden rounded-lg bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold">UMKM perlu perhatian</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Prioritas tindak lanjut berdasarkan indikator objektif
                </p>
              </div>
              <button className="text-sm font-medium text-[#176b57]">
                Lihat semua
              </button>
            </div>
            <div className="grid min-h-32 place-items-center p-6 text-center">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Belum ada data untuk ditampilkan
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Data akan muncul setelah UMKM dan monitoring tersimpan.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
