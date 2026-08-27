"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth";
import { monitoringSchema } from "@/schemas/monitoring";

export async function addMonitoringAction(
  _: { error?: string } | null,
  formData: FormData,
) {
  await requireProfile();
  const raw = Object.fromEntries(formData.entries()) as Record<string, unknown>;
  for (const k of [
    "memiliki_nib",
    "memiliki_halal",
    "memiliki_pirt",
    "memiliki_haki",
    "memiliki_whatsapp_business",
    "memiliki_instagram",
    "memiliki_facebook",
    "memiliki_tiktok",
  ])
    raw[k] = formData.get(k) === "on";
  try {
    raw.kbli = JSON.parse(String(formData.get("kbli") ?? "[]"));
  } catch {
    raw.kbli = [];
  }
  const parsed = monitoringSchema.safeParse(raw);
  if (!parsed.success)
    return {
      error: parsed.error.issues[0]?.message ?? "Data monitoring belum valid.",
    };
  const supabase = await createClient();
  const { data, error } = await supabase!.rpc("create_monitoring", {
    payload: parsed.data,
    kbli_rows: parsed.data.kbli,
  });
  if (error || !data)
    return { error: "Monitoring gagal disimpan. Silakan coba kembali." };
  revalidatePath("/dashboard");
  revalidatePath(`/umkm/${parsed.data.umkm_id}`);
  redirect(`/umkm/${parsed.data.umkm_id}/monitoring/${data}`);
}
