import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/domain";

export async function getSessionProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id,name,role,kecamatan_id")
    .eq("id", user.id)
    .single();
  return data as Profile | null;
}

export async function requireProfile() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/login");
  return profile;
}
