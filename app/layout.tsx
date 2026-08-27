import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
