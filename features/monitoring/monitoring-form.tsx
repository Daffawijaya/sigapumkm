"use client";
import { useActionState, useState } from "react";
import { addMonitoringAction } from "@/app/(app)/umkm/[id]/monitoring/tambah/actions";

const field =
  "mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function ToggleField({
  name,
  label,
  detail,
  defaultChecked,
  defaultValue,
}: {
  name: string;
  label: string;
  detail: string;
  defaultChecked?: boolean;
  defaultValue?: string;
}) {
  const [yes, setYes] = useState(defaultChecked ?? false);
  return (
    <div className="rounded-md border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
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
          defaultValue={defaultValue ?? ""}
          placeholder={`Nomor/akun ${label}`}
          className={field}
        />
      )}
    </div>
  );
}

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
      <section className="rounded-lg bg-white p-6">
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
      <section className="rounded-lg bg-white p-6">
        <h2 className="font-semibold">2. Legalitas</h2>
        <div className="mt-5 space-y-4">
          <ToggleField
            name="memiliki_nib"
            detail="nomor_nib"
            label="NIB"
            defaultChecked={Boolean(defaults.memiliki_nib)}
            defaultValue={String(defaults.nomor_nib ?? "")}
          />
          <ToggleField
            name="memiliki_halal"
            detail="nomor_halal"
            label="Halal"
            defaultChecked={Boolean(defaults.memiliki_halal)}
            defaultValue={String(defaults.nomor_halal ?? "")}
          />
          <ToggleField
            name="memiliki_pirt"
            detail="nomor_pirt"
            label="PIRT"
            defaultChecked={Boolean(defaults.memiliki_pirt)}
            defaultValue={String(defaults.nomor_pirt ?? "")}
          />
          <ToggleField
            name="memiliki_haki"
            detail="nomor_haki"
            label="HAKI"
            defaultChecked={Boolean(defaults.memiliki_haki)}
            defaultValue={String(defaults.nomor_haki ?? "")}
          />
        </div>
      </section>
      <section className="rounded-lg bg-white p-6">
        <h2 className="font-semibold">3. Digitalisasi</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ToggleField
            name="memiliki_whatsapp_business"
            detail="whatsapp_business"
            label="WhatsApp Business"
            defaultChecked={Boolean(defaults.memiliki_whatsapp_business)}
            defaultValue={String(defaults.whatsapp_business ?? "")}
          />
          <ToggleField
            name="memiliki_instagram"
            detail="instagram"
            label="Instagram"
            defaultChecked={Boolean(defaults.memiliki_instagram)}
            defaultValue={String(defaults.instagram ?? "")}
          />
          <ToggleField
            name="memiliki_facebook"
            detail="facebook"
            label="Facebook"
            defaultChecked={Boolean(defaults.memiliki_facebook)}
            defaultValue={String(defaults.facebook ?? "")}
          />
          <ToggleField
            name="memiliki_tiktok"
            detail="tiktok"
            label="TikTok"
            defaultChecked={Boolean(defaults.memiliki_tiktok)}
            defaultValue={String(defaults.tiktok ?? "")}
          />
        </div>
      </section>
      <section className="rounded-lg bg-white p-6">
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
