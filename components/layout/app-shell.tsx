"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  ClipboardCheck,
  LogOut,
  Menu,
  PlusCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Profile } from "@/types/domain";

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const items = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/umkm", label: "Data UMKM", icon: Building2 },
    ...(profile.role === "KECAMATAN"
      ? [{ href: "/umkm/tambah", label: "Tambah Data", icon: PlusCircle }]
      : []),
    { href: "/monitoring", label: "Monitoring", icon: ClipboardCheck },
  ];
  const nav = (
    <>
      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-lime-200 font-bold text-[#103b33]">
          S
        </div>
        <div>
          <p className="font-semibold">SIGAPUMKM</p>
          <p className="text-xs text-emerald-100/60">Monitoring UMKM</p>
        </div>
      </div>
      <nav className="mt-7 space-y-1">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            onClick={() => setOpen(false)}
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm ${path.startsWith(href) ? "bg-white/10 font-medium text-white" : "text-emerald-50/70 hover:bg-white/5"}`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-white/10 pt-5">
        <p className="px-3 text-sm font-medium">{profile.name}</p>
        <p className="px-3 text-xs text-emerald-100/50">
          {profile.role === "ADMIN" ? "Administrator" : "Petugas Kecamatan"}
        </p>
        <a
          href="/auth/signout"
          className="mt-3 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-emerald-50/70"
        >
          <LogOut size={16} />
          Keluar
        </a>
      </div>
    </>
  );
  return (
    <div className="min-h-screen bg-[#f5f7f6]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#103b33] px-5 py-6 text-white lg:flex">
        {nav}
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            className="flex h-full w-72 flex-col bg-[#103b33] px-5 py-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="ml-auto mb-3" onClick={() => setOpen(false)}>
              <X />
            </button>
            {nav}
          </aside>
        </div>
      )}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">
          <button
            className="mr-3 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Buka navigasi"
          >
            <Menu />
          </button>
          <p className="text-sm font-semibold">Sistem Informasi UMKM</p>
          <Link
            href="/umkm/tambah"
            className="ml-auto rounded-md bg-[#176b57] px-4 py-2 text-sm font-medium text-white"
          >
            + Tambah UMKM
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
