import { ArrowRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatOrang, formatPersen, formatRupiah } from "@/lib/format";
import { percentChange } from "@/lib/comparison";

export interface MonitoringSnapshot { label: string; omzet: number; tenagaKerja: number; legalitas: number; digitalisasi: number }

function ChangeBadge({ value, suffix = "" }: { value: number; suffix?: string }) {
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const tone = value > 0 ? "bg-emerald-50 text-emerald-700" : value < 0 ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${tone}`}><Icon size={13}/>{value > 0 ? "+" : ""}{value}{suffix}</span>;
}

function ComparisonCard({ title, before, after }: { title: string; before: MonitoringSnapshot; after: MonitoringSnapshot }) {
  const omzetPercent = percentChange(after.omzet, before.omzet);
  const rows = [
    { label: "Omzet", before: formatRupiah(before.omzet), after: formatRupiah(after.omzet), change: omzetPercent === null ? "Mulai tercatat" : formatPersen(omzetPercent) },
    { label: "Tenaga kerja", before: formatOrang(before.tenagaKerja), after: formatOrang(after.tenagaKerja), badge: <ChangeBadge value={after.tenagaKerja - before.tenagaKerja} suffix=" orang"/> },
    { label: "Legalitas", before: `${before.legalitas}/4`, after: `${after.legalitas}/4`, badge: <ChangeBadge value={after.legalitas - before.legalitas} suffix=" dokumen"/> },
    { label: "Digitalisasi", before: `${before.digitalisasi}/4`, after: `${after.digitalisasi}/4`, badge: <ChangeBadge value={after.digitalisasi - before.digitalisasi} suffix=" kanal"/> },
  ];
  return <article className="overflow-hidden rounded-lg bg-white"><div className="border-b border-slate-200 bg-slate-50 px-5 py-4"><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{title}</p><div className="mt-2 flex items-center gap-2 text-sm font-medium"><span>{before.label}</span><ArrowRight size={15} className="text-slate-400"/><span>{after.label}</span></div></div><div className="divide-y divide-slate-100">{rows.map((row) => <div key={row.label} className="grid gap-3 px-5 py-4 sm:grid-cols-[120px_1fr_auto] sm:items-center"><p className="text-sm text-slate-500">{row.label}</p><div className="flex items-center gap-2 text-sm"><span>{row.before}</span><ArrowRight size={14} className="text-slate-300"/><strong>{row.after}</strong></div>{row.badge ?? <span className={`rounded-full px-2 py-1 text-xs font-medium ${omzetPercent !== null && omzetPercent < 0 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{row.change}</span>}</div>)}</div></article>;
}

export function SnapshotComparison({ baseline, latest, previous }: { baseline: MonitoringSnapshot; latest?: MonitoringSnapshot; previous?: MonitoringSnapshot }) {
  if (!latest) return <section className="mt-5 rounded-lg bg-white p-8 text-center"><h2 className="font-semibold">Perbandingan sebelum & sesudah</h2><p className="mt-2 text-sm text-slate-500">Belum ada monitoring. Kondisi terkini masih sama dengan data awal (baseline).</p></section>;
  return <section className="mt-5"><div className="mb-4"><h2 className="text-lg font-semibold">Perbandingan sebelum & sesudah</h2><p className="mt-1 text-sm text-slate-500">Monitoring terakhir dipilih otomatis sebagai kondisi terbaru.</p></div><div className="grid gap-5 xl:grid-cols-2"><ComparisonCard title="Data awal vs kondisi terbaru" before={baseline} after={latest}/><ComparisonCard title="Monitoring sebelumnya vs terbaru" before={previous ?? baseline} after={latest}/></div></section>;
}
