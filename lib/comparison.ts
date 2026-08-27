import type { CurrentState, PerkembanganStatus } from "@/types/domain";

export function percentChange(
  current: number,
  previous: number,
): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

const countLegal = (s: CurrentState) =>
  [s.memiliki_nib, s.memiliki_halal, s.memiliki_pirt, s.memiliki_haki].filter(
    Boolean,
  ).length;
const countDigital = (s: CurrentState) =>
  [
    s.memiliki_whatsapp_business,
    s.memiliki_instagram,
    s.memiliki_facebook,
    s.memiliki_tiktok,
  ].filter(Boolean).length;

export function growthStatus(
  baseline: CurrentState,
  current?: CurrentState,
): PerkembanganStatus {
  if (!current) return "Belum Dimonitor";
  const changes = [
    current.omzet - baseline.omzet,
    current.jumlah_tenaga_kerja - baseline.jumlah_tenaga_kerja,
    countLegal(current) - countLegal(baseline),
    countDigital(current) - countDigital(baseline),
  ];
  if (changes.some((v) => v < 0)) return "Perlu Perhatian";
  if (changes.some((v) => v > 0)) return "Berkembang";
  return "Stabil";
}
