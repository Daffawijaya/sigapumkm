"use client";
import { useActionState, useState } from "react";
import { addMonitoringAction } from "@/app/(app)/umkm/[id]/monitoring/tambah/actions";
const field =
  "mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
const toggles = [
  ["memiliki_nib", "NIB"],
  ["memiliki_halal", "Halal"],
  ["memiliki_pirt", "PIRT"],
  ["memiliki_haki", "HAKI"],
  ["memiliki_whatsapp_business", "WhatsApp Business"],
  ["memiliki_instagram", "Instagram"],
  ["memiliki_facebook", "Facebook"],
  ["memiliki_tiktok", "TikTok"],
];
export function MonitoringForm({
  umkmId,
  defaults,
}: {
  umkmId: string;
  defaults: Record<string, unknown>;
}) {
  const [state, action, pending] = useActionState(addMonitoringAction, null);
  const [kbli] = useState(defaults.kbli ?? []);
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="umkm_id" value={umkmId} />
      <input type="hidden" name="kbli" value={JSON.stringify(kbli)} />
      {state?.error && (
        <p className="rounded-md bg-rose-50 p-4 text-sm text-rose-700">
          {state.error}
        </p>
      )}
      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold">1. Perkembangan usaha</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <label className="text-sm font-medium">
            Tanggal monitoring
            <input
              name="tanggal_monitoring"
              type="date"
              required
              defaultValue={new Date().toISOString().slice(0, 10)}
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Omzet terbaru
            <input
              name="omzet"
              type="number"
              min="0"
              required
              defaultValue={String(defaults.omzet ?? 0)}
              className={field}
            />
          </label>
          <label className="text-sm font-medium">
            Jumlah tenaga kerja
            <input
              name="jumlah_tenaga_kerja"
              type="number"
              min="0"
              required
              defaultValue={String(defaults.jumlah_tenaga_kerja ?? 0)}
              className={field}
            />
          </label>
        </div>
      </section>
      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold">2–3. Legalitas & digitalisasi</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {toggles.map(([name, label]) => (
            <label
              key={name}
              className="flex items-center justify-between rounded-md border border-slate-200 p-4 text-sm font-medium"
            >
              {label}
              <input
                name={name}
                type="checkbox"
                defaultChecked={Boolean(defaults[name])}
              />
            </label>
          ))}
        </div>
        {[
          ["nomor_nib", "Nomor NIB"],
          ["nomor_halal", "Nomor Halal"],
          ["nomor_pirt", "Nomor PIRT"],
          ["nomor_haki", "Nomor HAKI"],
          ["whatsapp_business", "WhatsApp Business"],
          ["instagram", "Instagram"],
          ["facebook", "Facebook"],
          ["tiktok", "TikTok"],
        ].map(([name, label]) => (
          <input
            key={name}
            name={name}
            defaultValue={String(defaults[name] ?? "")}
            placeholder={label}
            className={`${field} md:w-[calc(50%-6px)] md:mr-3`}
          />
        ))}
      </section>
      <section className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold">4. Kondisi & tindak lanjut</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["kebutuhan_utama", "Kebutuhan utama"],
            ["kendala", "Kendala"],
            ["catatan", "Catatan monitoring"],
            ["tindak_lanjut", "Tindak lanjut"],
          ].map(([name, label]) => (
            <label key={name} className="text-sm font-medium">
              {label}
              <textarea
                name={name}
                defaultValue={String(defaults[name] ?? "")}
                rows={3}
                className={field}
              />
            </label>
          ))}
        </div>
      </section>
      <div className="flex justify-end">
        <button
          disabled={pending}
          className="rounded-md bg-[#176b57] px-6 py-3 font-medium text-white disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan Monitoring"}
        </button>
      </div>
    </form>
  );
}
