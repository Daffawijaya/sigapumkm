import { z } from "zod";

const conditional =
  (flag: string, field: string, label: string) =>
  (data: Record<string, unknown>, ctx: z.RefinementCtx) => {
    if (data[flag] && !String(data[field] ?? "").trim())
      ctx.addIssue({
        code: "custom",
        path: [field],
        message: `${label} wajib diisi.`,
      });
  };
const optionalText = z.string().trim().nullable().optional();
const booleanValue = z.boolean().default(false);

export const umkmSchema = z
  .object({
    kecamatan_id: z.string().uuid().optional(),
    nama_peserta: z.string().trim().min(1, "Nama peserta wajib diisi."),
    nik: z.string().regex(/^\d{16}$/, "NIK harus tepat 16 digit."),
    nama_usaha: z.string().trim().min(1),
    alamat: z.string().trim().min(1),
    nomor_kontak: z.string().trim().min(6),
    kategori_usaha: z.enum(["Perdagangan", "Jasa", "Industri"]),
    jenis_usaha: z.string().trim().min(1),
    tahun_mulai_usaha: z.coerce
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear()),
    jumlah_tenaga_kerja: z.coerce.number().int().min(0),
    omzet: z.coerce.number().min(0),
    memiliki_nib: booleanValue,
    nomor_nib: optionalText,
    memiliki_halal: booleanValue,
    nomor_halal: optionalText,
    memiliki_pirt: booleanValue,
    nomor_pirt: optionalText,
    memiliki_haki: booleanValue,
    nomor_haki: optionalText,
    memiliki_whatsapp_business: booleanValue,
    whatsapp_business: optionalText,
    memiliki_instagram: booleanValue,
    instagram: optionalText,
    memiliki_facebook: booleanValue,
    facebook: optionalText,
    memiliki_tiktok: booleanValue,
    tiktok: optionalText,
    kebutuhan_utama: z.string().trim().default(""),
    kbli: z
      .array(
        z.object({
          kode: z.string().trim().min(1),
          nama: z.string().trim().min(1),
        }),
      )
      .default([]),
  })
  .superRefine((data, ctx) => {
    conditional("memiliki_nib", "nomor_nib", "Nomor NIB")(data, ctx);
    if (data.memiliki_nib && data.kbli.length === 0)
      ctx.addIssue({
        code: "custom",
        path: ["kbli"],
        message: "Minimal satu KBLI wajib diisi.",
      });
    conditional("memiliki_halal", "nomor_halal", "Nomor halal")(data, ctx);
    conditional("memiliki_pirt", "nomor_pirt", "Nomor PIRT")(data, ctx);
    conditional("memiliki_haki", "nomor_haki", "Nomor HAKI")(data, ctx);
    conditional(
      "memiliki_whatsapp_business",
      "whatsapp_business",
      "WhatsApp Business",
    )(data, ctx);
    conditional("memiliki_instagram", "instagram", "Instagram")(data, ctx);
    conditional("memiliki_facebook", "facebook", "Facebook")(data, ctx);
    conditional("memiliki_tiktok", "tiktok", "TikTok")(data, ctx);
  });
export type UmkmInput = z.infer<typeof umkmSchema>;
