import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIGAPUMKM | Monitoring UMKM",
  description:
    "Sistem pendataan dan monitoring perkembangan UMKM Kecamatan Tenggarong Seberang dan Anggana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${outfit.variable} antialiased`}>{children}</body>
    </html>
  );
}
