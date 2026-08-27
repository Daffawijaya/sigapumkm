export const formatRupiah = (value: number | string | null | undefined) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));

export const formatPersen = (value: number | null) =>
  value === null
    ? "—"
    : `${value > 0 ? "+" : ""}${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(value)}%`;
export const formatOrang = (value: number) =>
  `${new Intl.NumberFormat("id-ID").format(value)} orang`;
export const formatTanggal = (value: string | Date) =>
  new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
    new Date(value),
  );
