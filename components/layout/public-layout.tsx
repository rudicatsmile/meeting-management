"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PersonaSwitcher } from "./persona-switcher";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LayoutDashboard, ArrowRight } from "lucide-react";
import { useMeeting } from "@/lib/meeting-context";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useMeeting();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Notification Bar */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center text-xs font-medium text-primary flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping"></span>
        <span>Sistem Informasi Rapat & Dokumentasi Nota Dinas Resmi — Yayasan Al Wathoniyah Asshodriyah 9</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm border border-border/60 group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/logo-yayasan.png"
                alt="Logo Yayasan Al Wathoniyah Asshodriyah 9"
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg tracking-tight text-primary flex items-center gap-1.5">
                RapatKita
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                  YAW 9
                </span>
              </span>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                Yayasan Al Wathoniyah Asshodriyah 9
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Beranda
            </Link>
            <Link href="/rapat" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              Rapat Saya
            </Link>
            {currentUser.globalRole === "ADMIN" && (
              <Link href="/kelola" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                Dashboard Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <PersonaSwitcher />

            <div className="flex items-center gap-2">
              <Link href="/rapat">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  Rapat Saya
                </Button>
              </Link>
              {currentUser.globalRole === "ADMIN" ? (
                <Link href="/kelola">
                  <Button size="sm" className="gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Kelola</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/rapat">
                  <Button size="sm" className="gap-1.5">
                    <span>Buka Rapat</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/40 py-8 mt-16 no-print">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs border border-border/60 shrink-0">
              <Image
                src="/logo-yayasan.png"
                alt="Logo Yayasan Al Wathoniyah Asshodriyah 9"
                width={28}
                height={28}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="font-semibold text-foreground">Yayasan Al Wathoniyah Asshodriyah 9</p>
              <p>Jl. Penggilingan Raya, Cakung, Jakarta Timur — DKI Jakarta</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" />
              Sistem Terarsip Digital & Audit Log Aman
            </span>
            <span>&copy; {new Date().getFullYear()} RapatKita. Hak Cipta Dilindungi.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
