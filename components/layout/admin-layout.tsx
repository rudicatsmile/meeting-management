"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMeeting } from "@/lib/meeting-context";
import { PersonaSwitcher } from "./persona-switcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Users,
  Home,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CalendarCheck,
} from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useMeeting();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      title: "Dashboard",
      href: "/kelola",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Kelola Rapat",
      href: "/kelola/rapat",
      icon: CalendarDays,
      exact: false,
    },
    {
      title: "Buat Rapat Baru",
      href: "/kelola/rapat/baru",
      icon: PlusCircle,
      exact: true,
    },
    {
      title: "Kelola Pengguna",
      href: "/kelola/user",
      icon: Users,
      exact: true,
    },
  ];

  // If non-admin is trying to access /kelola in mock demo
  if (currentUser.globalRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-background rounded-2xl border p-8 shadow-lg text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold font-heading">Akses Khusus Admin</h2>
          <p className="text-sm text-muted-foreground">
            Akun Anda saat ini (<strong>{currentUser.nama}</strong>) memiliki peran{" "}
            <strong>Pengguna Biasa / Peserta</strong>. Menu <code>/kelola</code> hanya dapat diakses oleh Admin Pengelola Rapat.
          </p>
          <div className="p-4 bg-muted/50 rounded-xl text-left border text-xs space-y-2">
            <p className="font-semibold text-foreground">💡 Cara menguji area Admin:</p>
            <p className="text-muted-foreground">
              Gunakan <strong>Persona Switcher</strong> di bawah ini untuk beralih ke akun <strong>Dra. Hj. Dewi Lestari, M.Pd.</strong> (Admin Pengelola).
            </p>
            <div className="pt-2 flex justify-center">
              <PersonaSwitcher />
            </div>
          </div>
          <div className="pt-2">
            <Link href="/rapat">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Halaman Rapat Saya</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/20">
      {/* Mobile Header */}
      <div className="md:hidden border-b bg-background px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/kelola" className="font-heading font-extrabold text-primary text-base">
            RapatKita Admin
          </Link>
        </div>
        <PersonaSwitcher />
      </div>

      {/* Sidebar Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-background flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <Link href="/kelola" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-base tracking-tight text-primary block leading-none">
                RapatKita
              </span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                Panel Pengelola
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Institution Badge */}
        <div className="px-4 py-3 border-b bg-primary/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-semibold text-primary truncate">
              Yayasan Al Wathoniyah Asshodriyah 9
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
          <div className="text-[11px] font-bold text-muted-foreground uppercase px-3 py-1 tracking-wider">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) &&
                (item.href !== "/kelola" || pathname === "/kelola");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}

          <div className="pt-6">
            <div className="text-[11px] font-bold text-muted-foreground uppercase px-3 py-1 tracking-wider">
              Tautan Cepat
            </div>
            <Link
              href="/rapat"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors mt-1"
            >
              <CalendarDays className="h-4 w-4 text-primary" />
              <span>Lihat Rapat Saya</span>
            </Link>
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Beranda Publik</span>
            </Link>
          </div>
        </div>

        {/* Admin Footer info */}
        <div className="p-4 border-t text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px]">Admin Login:</span>
            <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 uppercase">
              Admin
            </Badge>
          </div>
          <p className="font-semibold text-foreground text-xs truncate">
            {currentUser.nama}
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 border-b bg-background px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-foreground font-heading">
              Panel Pengelola Rapat & Nota Dinas
            </h1>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-xs font-medium text-primary">
              Yayasan Al Wathoniyah Asshodriyah 9
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/kelola/rapat/baru">
              <Button size="sm" className="gap-1.5 shadow-sm">
                <PlusCircle className="h-4 w-4" />
                <span>Rapat Baru</span>
              </Button>
            </Link>
            <PersonaSwitcher />
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
