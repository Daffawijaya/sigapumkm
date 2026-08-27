"use client";
import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createUmkmAction } from "@/app/(app)/umkm/actions";

const field =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
function ToggleField({
  name,
  label,
  detail,
}: {
  name: string;
  label: string;
  detail: string;
}) {
  const [yes, setYes] = useState(false);
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <label className="font-medium">{label}</label>
        <label className="flex items-center gap-2 text-sm">
          <input
            name={name}
            type="checkbox"
            checked={yes}
            onChange={(e) => setYes(e.target.checked)}
          />{" "}
          Ya
        </label>
      </div>
      {yes && (
        <input
          name={detail}
          className={field}
          placeholder={`Nomor/akun ${label}`}
          required
        />
      )}
    </div>
  );
}
export function UmkmForm({
  districts,
  isAdmin,
}: {
  districts: { id: string; nama: string }[];
  isAdmin: boolean;
}) {
  const [state, action, pending] = useActionState(createUmkmAction, null);
  const [hasNib, setHasNib] = useState(false);
  const [kbli, setKbli] = useState([{ kode: "", nama: "" }]);
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="kbli" value={JSON.stringify(kbli)} />
      {state?.error && (
        <div
          role="alert"
          className="rounded-md bg-rose-50 p-4 text-sm text-rose-700"
        >
          {state.error}
        </div>
      )}
      <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-7">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Bagian 1
          </p>
          <h2 className="mt-1 text-lg font-semibold">Data peserta & usaha</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {isAdmin && (
            <label className="text-sm font-medium">
              Kecamatan
              <select name="kecamatan_id" required className={field}>
                <option value="">Pilih kecamatan</option>
                {districts.map((d) => (
                  <option value={d.id} key={d.id}>
                    {d.nama}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="text-sm font-medium">
            Nama peserta
            <input name="nama_peserta" required className={field} />
          </label>
          <label className="text-sm font-medium">
            NIK
            <input
              name="nik"
              required
              inputMode="numeric"
              maxLength={16}
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Nama usaha
            <input name="nama_usaha" required className={field} />
          </label>
          <label className="text-sm font-medium md:col-span-2">
            Alamat
            <textarea name="alamat" required rows={3} className={field} />
          </label>
          <label className="text-sm font-medium">
            Nomor kontak
            <input name="nomor_kontak" required className={field} />
          </label>
          <label className="text-sm font-medium">
            Kategori
            <select name="kategori_usaha" required className={field}>
              <option>Perdagangan</option>
              <option>Jasa</option>
              <option>Industri</option>
            </select>
          </label>
          <label className="text-sm font-medium">
            Jenis usaha
            <input
              name="jenis_usaha"
              required
              placeholder="Contoh: Kuliner"
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Tahun mulai
            <input
              name="tahun_mulai_usaha"
              type="number"
              required
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Jumlah tenaga kerja
            <input
              name="jumlah_tenaga_kerja"
              type="number"
              min="0"
              defaultValue="0"
              required
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Omzet bulanan (Rp)
            <input
              name="omzet"
              type="number"
              min="0"
              defaultValue="0"
              required
              className={field}
            />
          </label>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Bagian 2
        </p>
        <h2 className="mb-6 mt-1 text-lg font-semibold">Legalitas & KBLI</h2>
        <div className="space-y-4">
          <div className="rounded-md border border-slate-200 p-4">
            <div className="flex justify-between">
              <label className="font-medium">NIB</label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="memiliki_nib"
                  type="checkbox"
                  checked={hasNib}
                  onChange={(e) => setHasNib(e.target.checked)}
                />{" "}
                Ya
              </label>
            </div>
            {hasNib && (
              <>
                <input
                  name="nomor_nib"
                  required
                  className={field}
                  placeholder="Nomor NIB"
                />
                <div className="mt-4 space-y-3">
                  {kbli.map((x, i) => (
                    <div
                      className="grid gap-2 md:grid-cols-[160px_1fr_auto]"
                      key={i}
                    >
                      <input
                        value={x.kode}
                        onChange={(e) =>
                          setKbli(
                            kbli.map((k, j) =>
                              j === i ? { ...k, kode: e.target.value } : k,
                            ),
                          )
                        }
                        className={field}
                        placeholder="Kode KBLI"
                      />
                      <input
                        value={x.nama}
                        onChange={(e) =>
                          setKbli(
                            kbli.map((k, j) =>
                              j === i ? { ...k, nama: e.target.value } : k,
                            ),
                          )
                        }
                        className={field}
                        placeholder="Nama KBLI"
                      />
                      <button
                        type="button"
                        onClick={() => setKbli(kbli.filter((_, j) => j !== i))}
                        aria-label="Hapus KBLI"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setKbli([...kbli, { kode: "", nama: "" }])}
                    className="flex items-center gap-2 text-sm font-medium text-emerald-700"
                  >
                    <Plus size={16} /> Tambah KBLI
                  </button>
                </div>
              </>
            )}
          </div>
          <ToggleField
            name="memiliki_halal"
            detail="nomor_halal"
            label="Sertifikat Halal"
          />
          <ToggleField name="memiliki_pirt" detail="nomor_pirt" label="PIRT" />
          <ToggleField
            name="memiliki_haki"
            detail="nomor_haki"
            label="HAKI / Sertifikat Merek"
          />
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Bagian 3
        </p>
        <h2 className="mb-6 mt-1 text-lg font-semibold">Digitalisasi</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ToggleField
            name="memiliki_whatsapp_business"
            detail="whatsapp_business"
            label="WhatsApp Business"
          />
          <ToggleField
            name="memiliki_instagram"
            detail="instagram"
            label="Instagram"
          />
          <ToggleField
            name="memiliki_facebook"
            detail="facebook"
            label="Facebook"
          />
          <ToggleField name="memiliki_tiktok" detail="tiktok" label="TikTok" />
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Bagian 4
        </p>
        <h2 className="mb-4 mt-1 text-lg font-semibold">Kebutuhan utama</h2>
        <textarea
          name="kebutuhan_utama"
          rows={4}
          className={field}
          placeholder="Jelaskan kebutuhan atau dukungan yang diperlukan"
        />
      </section>
      <div className="flex justify-end">
        <button
          disabled={pending}
          className="rounded-md bg-[#176b57] px-6 py-3 font-medium text-white disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan baseline UMKM"}
        </button>
      </div>
    </form>
  );
}
