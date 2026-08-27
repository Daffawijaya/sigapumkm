import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#f4f7f5] lg:grid-cols-[1.05fr_.95fr]">
      <section className="hidden bg-[#103b33] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-lime-200 text-lg font-bold text-[#103b33]">
            S
          </div>
          <div>
            <p className="font-semibold">SIGAPUMKM</p>
            <p className="text-xs text-emerald-100/60">Kutai Kartanegara</p>
          </div>
        </div>
        <div className="max-w-xl">
          <p className="text-sm font-medium text-lime-200">
            Data yang bergerak menjadi tindakan
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight">
            Pantau perkembangan UMKM secara utuh, dari baseline hingga tindak
            lanjut.
          </h1>
          <p className="mt-5 text-emerald-50/70">
            Satu ruang kerja untuk Tenggarong Seberang dan Anggana.
          </p>
        </div>
        <p className="text-xs text-emerald-100/40">
          Sistem informasi pendataan dan monitoring UMKM
        </p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg bg-white p-7 md:p-10">
          <p className="text-sm font-medium text-emerald-700">Selamat datang</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Masuk ke akun Anda
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Gunakan akun admin atau kecamatan yang telah terdaftar.
          </p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
