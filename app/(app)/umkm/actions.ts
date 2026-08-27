"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { umkmSchema } from "@/schemas/umkm";

const boolFields = [
  "memiliki_nib",
  "memiliki_halal",
  "memiliki_pirt",
  "memiliki_haki",
  "memiliki_whatsapp_business",
  "memiliki_instagram",
  "memiliki_facebook",
  "memiliki_tiktok",
];
export async function createUmkmAction(
  _: { error?: string } | null,
  formData: FormData,
) {
  const profile = await requireProfile();
  const raw: Record<string, unknown> = Object.fromEntries(formData.entries());
  for (const key of boolFields) raw[key] = formData.get(key) === "on";
  try {
    raw.kbli = JSON.parse(String(formData.get("kbli") ?? "[]"));
  } catch {
    raw.kbli = [];
  }
  const parsed = umkmSchema.safeParse(raw);
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message ?? "Data belum valid." };
  const input = parsed.data;
  if (profile.role === "KECAMATAN")
    input.kecamatan_id = profile.kecamatan_id ?? undefined;
  const clean = { ...input };
  if (!clean.memiliki_nib) {
    clean.nomor_nib = null;
    clean.kbli = [];
  }
  for (const [flag, field] of [
    ["memiliki_halal", "nomor_halal"],
    ["memiliki_pirt", "nomor_pirt"],
    ["memiliki_haki", "nomor_haki"],
    ["memiliki_whatsapp_business", "whatsapp_business"],
    ["memiliki_instagram", "instagram"],
    ["memiliki_facebook", "facebook"],
    ["memiliki_tiktok", "tiktok"],
  ] as const)
    if (!clean[flag]) clean[field] = null;
  const supabase = await createClient();
  const { data, error } = await supabase!.rpc("create_umkm", {
    payload: clean,
    kbli_rows: clean.kbli,
  });
  if (error || !data)
    return { error: "Data UMKM gagal disimpan. Silakan coba kembali." };
  revalidatePath("/dashboard");
  revalidatePath("/umkm");
  redirect(`/umkm/${data}`);
}

export async function deleteUmkmAction(id: string) {
  await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase!.from("umkm").delete().eq("id", id);
  if (error) throw new Error("Data UMKM gagal dihapus.");
  revalidatePath("/umkm");
  redirect("/umkm");
}
