"use client";

import React from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMeeting } from "@/lib/meeting-context";
import { formatTanggalIndonesia, formatWaktuIndonesia } from "@/lib/utils";
import {
  CalendarDays,
  Clock,
  Users,
  PlusCircle,
  ArrowRight,
  FileCheck2,
  Building2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { meetings, users, currentUser } = useMeeting();

  // Statistics
  const draftMeetings = meetings.filter((m) => m.status === "DRAFT");
  const openMeetings = meetings.filter((m) => m.status === "OPEN");
  const ongoingMeetings = meetings.filter((m) => m.status === "ONGOING");
  const completedMeetings = meetings.filter((m) => m.status === "COMPLETED");

  const totalAttendeesCount = meetings.reduce(
    (acc, m) => acc + m.attendees.length,
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <Building2 className="h-3.5 w-3.5" />
              <span>Yayasan Al Wathoniyah Asshodriyah 9</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
              Dashboard Pengelola Rapat
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Selamat datang kembali, <strong>{currentUser.nama}</strong>. Berikut ikhtisar agenda rapat dan nota dinas yayasan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/kelola/rapat/baru">
              <Button className="gap-2 shadow-sm">
                <PlusCircle className="h-4 w-4" />
                <span>Buat Jadwal Rapat Baru</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Key Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border shadow-sm hover:border-primary/40 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Rapat Terbuka (Open)
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarDays className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-foreground">
                {openMeetings.length}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-blue-600 font-semibold">Siap dilaksanakan</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm border-amber-300 bg-amber-50/20 hover:border-amber-400 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-amber-800">
                Sedang Berlangsung
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="h-4 w-4 animate-spin" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-amber-700">
                {ongoingMeetings.length}
              </div>
              <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                Presensi &amp; Sidang Aktif
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:border-primary/40 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Rapat Selesai (Arsip)
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-foreground">
                {completedMeetings.length}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Nota dinas &amp; risalah tersimpan
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:border-primary/40 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Anggota Yayasan
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-heading text-foreground">
                {users.length}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {totalAttendeesCount} akumulasi undangan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ongoing Action Banner (If any) */}
        {ongoingMeetings.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
                  Perhatian: Terdapat {ongoingMeetings.length} Rapat Sedang Berlangsung
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Buka tab presensi untuk menandai kehadiran peserta atau tutup rapat untuk menerbitkan draf nota dinas.
                </p>
              </div>
            </div>
            <Link href={`/kelola/rapat/${ongoingMeetings[0].id}`}>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 text-xs">
                <span>Kelola Rapat Berlangsung</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        )}

        {/* Grid: Latest Meetings & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main: Active & Upcoming Meetings Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-heading text-foreground">
                Agenda Rapat Aktif Terkini
              </h2>
              <Link href="/kelola/rapat">
                <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                  <span>Lihat Seluruh Rapat</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {meetings.slice(0, 5).map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 rounded-xl border bg-card hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          meeting.status === "ONGOING"
                            ? "warning"
                            : meeting.status === "OPEN"
                            ? "info"
                            : meeting.status === "COMPLETED"
                            ? "success"
                            : "draft"
                        }
                        pulse={meeting.status === "ONGOING"}
                        className="text-[10px] uppercase font-bold"
                      >
                        {meeting.status === "ONGOING"
                          ? "Berlangsung"
                          : meeting.status === "OPEN"
                          ? "Terbuka"
                          : meeting.status === "COMPLETED"
                          ? "Selesai"
                          : "Draf"}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {meeting.tanggal}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate">
                      <Link href={`/kelola/rapat/${meeting.id}`}>
                        {meeting.judul}
                      </Link>
                    </h4>

                    <p className="text-xs text-muted-foreground flex items-center gap-3">
                      <span>{formatWaktuIndonesia(meeting.waktuMulai)}</span>
                      <span>•</span>
                      <span>{meeting.attendees.length} Peserta</span>
                      {meeting.tempat && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px]">{meeting.tempat}</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link href={`/kelola/rapat/${meeting.id}`}>
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                        <span>Kelola</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side: Quick Summary & Statuses */}
          <div className="space-y-6">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">Ringkasan Status Rapat</CardTitle>
                <CardDescription className="text-xs">
                  Distribusi siklus hidup rapat yayasan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border">
                  <span className="font-semibold text-slate-700">Draf (Belum Publikasi)</span>
                  <Badge variant="draft">{draftMeetings.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="font-semibold text-blue-800">Terbuka (Siap Sidang)</span>
                  <Badge variant="info">{openMeetings.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="font-semibold text-amber-800">Sedang Berlangsung</span>
                  <Badge variant="warning">{ongoingMeetings.length}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-semibold text-emerald-800">Selesai &amp; Nota Dinas</span>
                  <Badge variant="success">{completedMeetings.length}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm bg-gradient-to-br from-primary/5 via-background to-background">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Pedoman RapatKita</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  1. Rapat yang dipublikasikan menjadi <strong>OPEN</strong> tidak dapat diubah jadwalnya demi integritas undangan.
                </p>
                <p>
                  2. Presensi kehadiran dibuka saat status <strong>ONGOING</strong>.
                </p>
                <p>
                  3. Saat rapat ditutup, sistem menerbitkan <strong>draf Nota Dinas</strong> dengan penomoran resmi yayasan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
