"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Home, CalendarDays, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <Card className="max-w-lg w-full border shadow-xl text-center p-8 sm:p-12 space-y-6">
        <div className="mx-auto h-20 w-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
          <SearchX className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
            Error 404 — Halaman Tidak Ditemukan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Halaman Tidak Tersedia
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Halaman atau dokumen rapat yang Anda tuju mungkin telah dipindahkan, selesai diarsipkan, atau alamat URL yang Anda masukkan salah.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 text-xs text-muted-foreground flex items-center justify-center gap-2 border">
          <Building2 className="h-4 w-4 text-primary" />
          <span>Sistem Informasi Rapat — Yayasan Al Wathoniyah Asshodriyah 9</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2 text-xs">
              <Home className="h-4 w-4" />
              <span>Kembali ke Beranda</span>
            </Button>
          </Link>
          <Link href="/rapat">
            <Button className="w-full sm:w-auto gap-2 text-xs">
              <CalendarDays className="h-4 w-4" />
              <span>Buka Rapat Saya</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
