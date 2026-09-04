"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMeeting } from "@/lib/meeting-context";
import { PersonaSwitcher } from "./persona-switcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Home,
  Menu,
  X,
  ChevronRight,
  Shield,
} from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, meetings } = useMeeting();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Count meetings inviting this user that are OPEN or ONGOING
  const userActiveMeetingsCount = meetings.filter((m) => {
    const isInvited = m.attendees.some((att) => att.userId === currentUser.id);
    const isOpenOrOngoing = m.status === "OPEN" || m.status === "ONGOING";
    return isInvited && isOpenOrOngoing;
  }).length;

  const navItems = [
    {
      title: "Rapat Saya",
      href: "/rapat",
      icon: CalendarDays,
      badge: userActiveMeetingsCount > 0 ? userActiveMeetingsCount : undefined,
    },
    {
      title: "Beranda Utama",
      href: "/",
      icon: Home,
    },
  ];

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
          <Link href="/" className="font-heading font-extrabold text-primary text-base">
            RapatKita
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
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-base tracking-tight text-primary block leading-none">
                RapatKita
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                Al Wathoniyah Asshodriyah 9
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

        {/* User Card */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {currentUser.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">
                {currentUser.nama}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {currentUser.jabatan}
              </p>
              <Badge
                variant={currentUser.globalRole === "ADMIN" ? "default" : "secondary"}
                className="mt-1 text-[10px] py-0 px-2 h-4 uppercase font-semibold"
              >
                {currentUser.globalRole === "ADMIN" ? "Admin Pengelola" : "Peserta"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <div className="text-[11px] font-bold text-muted-foreground uppercase px-3 py-1 tracking-wider">
            Menu Peserta
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/rapat" && pathname.startsWith("/rapat"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                {item.badge !== undefined && (
                  <Badge
                    variant={isActive ? "secondary" : "default"}
                    className="text-[10px] px-1.5 py-0 h-4 font-bold"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}

          {currentUser.globalRole === "ADMIN" && (
            <div className="pt-6">
              <div className="text-[11px] font-bold text-muted-foreground uppercase px-3 py-1 tracking-wider">
                Akses Pengelola
              </div>
              <Link
                href="/kelola"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors mt-1"
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4" />
                  <span>Dashboard Admin</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px]">Sesi Aktif:</span>
            <span className="font-semibold text-foreground text-[11px]">
              {currentUser.email.split("@")[0]}
            </span>
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Hanya menampilkan rapat yang mengundang Anda saat berstatus Terbuka atau Berlangsung.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Topbar */}
        <header className="hidden md:flex h-16 border-b bg-background px-8 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-foreground font-heading">
              Area Anggota & Peserta Rapat
            </h1>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-xs text-muted-foreground">
              Yayasan Al Wathoniyah Asshodriyah 9
            </span>
          </div>
          <div className="flex items-center gap-4">
            <PersonaSwitcher />
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
