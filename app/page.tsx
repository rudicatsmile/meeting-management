"use client";

import React from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMeeting } from "@/lib/meeting-context";
import {
  CalendarDays,
  FileCheck2,
  Users2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
} from "lucide-react";

export default function HomePage() {
  const { meetings, currentUser } = useMeeting();

  const openCount = meetings.filter((m) => m.status === "OPEN").length;
  const ongoingCount = meetings.filter((m) => m.status === "ONGOING").length;
  const completedCount = meetings.filter((m) => m.status === "COMPLETED").length;

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container relative z-10 max-w-5xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6 animate-pulse-subtle">
            <Building2 className="h-3.5 w-3.5" />
            <span>Sistem Informasi Terpadu Yayasan Al Wathoniyah Asshodriyah 9</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground font-heading leading-tight md:leading-tight mb-6">
            Kelola Seluruh Siklus Rapat &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
              Dokumentasi Nota Dinas Otomatis
            </span>
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Platform modern untuk perencanaan agenda, undangan peserta berdasar peran, presensi kehadiran real-time, hingga penerbitan draf nota dinas resmi secara instan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/rapat" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20 text-base h-12 px-6">
                <CalendarDays className="h-5 w-5" />
                <span>Buka Rapat Saya</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            {currentUser.globalRole === "ADMIN" ? (
              <Link href="/kelola" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-6">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span>Dashboard Pengelola</span>
                </Button>
              </Link>
            ) : (
              <Link href="/masuk" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-6">
                  <span>Masuk Akun</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-card border rounded-2xl p-4 shadow-sm text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary font-heading">
                {openCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Rapat Terbuka</p>
            </div>
            <div className="bg-card border rounded-2xl p-4 shadow-sm text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-600 font-heading">
                {ongoingCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Sedang Berlangsung</p>
            </div>
            <div className="bg-card border rounded-2xl p-4 shadow-sm text-center">
              <div className="text-2xl md:text-3xl font-bold text-emerald-600 font-heading">
                {completedCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Selesai &amp; Arsip</p>
            </div>
            <div className="bg-card border rounded-2xl p-4 shadow-sm text-center">
              <div className="text-2xl md:text-3xl font-bold text-foreground font-heading">
                100%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Digital &amp; Terdokumentasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 md:py-24 bg-background container max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-3">
            Fitur Utama RapatKita
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold font-heading">
            Dirancang Khusus untuk Ketertiban Administrasi Yayasan
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            Mengatasi kendala undangan manual, notulen tercecer, dan penulisan nota dinas yang lambat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/60 hover:border-primary/40">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <Users2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">Penetapan Peran Rapat</CardTitle>
              <CardDescription>
                Setiap peserta memiliki peran spesifik: Pimpinan Rapat, Moderator, Operator IT, atau Peserta Sidang.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span>Undangan terspesifikasi tanpa tumpang tindih</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span>Penetapan pimpinan sidang terstruktur</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 hover:border-primary/40">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                <Clock className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">Presensi Kehadiran Real-time</CardTitle>
              <CardDescription>
                Pencatatan presensi saat rapat berstatus Berlangsung dengan opsi Hadir, Izin, atau Tidak Hadir.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span>Form presensi aktif khusus saat rapat berjalan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span>Daftar hadir otomatis disalin ke lembar nota dinas</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 hover:border-primary/40">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">Draf Nota Dinas Otomatis</CardTitle>
              <CardDescription>
                Begitu rapat ditutup oleh Admin, sistem langsung menyusun lembar nota dinas resmi berformat kop yayasan.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span>Penomoran surat baku: ND/00X/YAW-9/...</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span>Editor TipTap &amp; Ekspor Cetak Standar A4</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Active Meetings Quick Section */}
      <section className="py-12 bg-muted/30 border-y">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold font-heading">
                Rapat Aktif &amp; Terbuka Saat Ini
              </h3>
              <p className="text-sm text-muted-foreground">
                Daftar agenda rapat terkini di lingkungan Yayasan Al Wathoniyah Asshodriyah 9
              </p>
            </div>
            <Link href="/rapat">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>Lihat Semua Rapat</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings
              .filter((m) => m.status === "OPEN" || m.status === "ONGOING")
              .slice(0, 4)
              .map((meeting) => (
                <Card key={meeting.id} className="hover:border-primary/40 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant={meeting.status === "ONGOING" ? "warning" : "info"}
                        pulse={meeting.status === "ONGOING"}
                      >
                        {meeting.status === "ONGOING" ? "Sedang Berlangsung" : "Terbuka"}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {meeting.tanggal}
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold mt-2 hover:text-primary transition-colors">
                      <Link href={`/rapat/${meeting.id}`}>{meeting.judul}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-2">
                    <p className="line-clamp-2">{meeting.deskripsi}</p>
                    <div className="pt-2 flex items-center justify-between text-xs border-t">
                      <span className="text-foreground font-medium flex items-center gap-1.5">
                        <Users2 className="h-3.5 w-3.5 text-primary" />
                        {meeting.attendees.length} Peserta Diundang
                      </span>
                      <Link href={`/rapat/${meeting.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-primary gap-1">
                          <span>Detail</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background container max-w-4xl mx-auto text-center px-4">
        <div className="rounded-3xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 md:p-12 shadow-sm text-center">
          <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold font-heading mb-3">
            Mulai Mengelola Rapat dengan RapatKita
          </h3>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Gunakan persona switcher untuk menguji langsung alur pembuatan jadwal, pencatatan kehadiran sidang, dan pencetakan nota dinas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/kelola/rapat/baru">
              <Button size="lg" className="gap-2">
                <span>Buat Agenda Rapat Baru</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/rapat">
              <Button variant="outline" size="lg">
                Masuk ke Rapat Saya
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
