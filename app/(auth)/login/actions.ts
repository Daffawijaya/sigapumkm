"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(
  _: { error?: string } | null,
  formData: FormData,
) {
  const supabase = await createClient();
  if (!supabase)
    return {
      error:
        "Supabase belum dikonfigurasi. Isi environment variable terlebih dahulu.",
    };
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email atau kata sandi tidak sesuai." };
  redirect("/dashboard");
}
