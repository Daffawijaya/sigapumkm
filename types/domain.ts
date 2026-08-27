export type UserRole = "ADMIN" | "KECAMATAN";
export type KategoriUsaha = "Perdagangan" | "Jasa" | "Industri";
export type PerkembanganStatus =
  "Berkembang" | "Stabil" | "Perlu Perhatian" | "Belum Dimonitor";

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  kecamatan_id: string | null;
}
export interface KbliInput {
  kode: string;
  nama: string;
}
export interface CurrentState {
  omzet: number;
  jumlah_tenaga_kerja: number;
  memiliki_nib: boolean;
  memiliki_halal: boolean;
  memiliki_pirt: boolean;
  memiliki_haki: boolean;
  memiliki_whatsapp_business: boolean;
  memiliki_instagram: boolean;
  memiliki_facebook: boolean;
  memiliki_tiktok: boolean;
}
