import { z } from "zod";

export const monitoringSchema = z.object({
  umkm_id: z.string().uuid(),
  tanggal_monitoring: z.string().date(),
  omzet: z.coerce.number().min(0),
  jumlah_tenaga_kerja: z.coerce.number().int().min(0),
  memiliki_nib: z.boolean(),
  nomor_nib: z.string().nullable().optional(),
  memiliki_halal: z.boolean(),
  nomor_halal: z.string().nullable().optional(),
  memiliki_pirt: z.boolean(),
  nomor_pirt: z.string().nullable().optional(),
  memiliki_haki: z.boolean(),
  nomor_haki: z.string().nullable().optional(),
  memiliki_whatsapp_business: z.boolean(),
  whatsapp_business: z.string().nullable().optional(),
  memiliki_instagram: z.boolean(),
  instagram: z.string().nullable().optional(),
  memiliki_facebook: z.boolean(),
  facebook: z.string().nullable().optional(),
  memiliki_tiktok: z.boolean(),
  tiktok: z.string().nullable().optional(),
  kebutuhan_utama: z.string().default(""),
  catatan: z.string().default(""),
  kendala: z.string().default(""),
  tindak_lanjut: z.string().default(""),
  kbli: z
    .array(z.object({ kode: z.string().min(1), nama: z.string().min(1) }))
    .default([]),
});
export type MonitoringInput = z.infer<typeof monitoringSchema>;
