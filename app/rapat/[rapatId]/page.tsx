"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMeeting } from "@/lib/meeting-context";
import { formatTanggalIndonesia, formatWaktuIndonesia } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  ArrowLeft,
  Users2,
  FileUp,
  Download,
  FileText,
  FileSpreadsheet,
  FileVideo,
  FileImage,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Lock,
} from "lucide-react";

export default function DetailRapatPesertaPage({
  params,
}: {
  params: Promise<{ rapatId: string }>;
}) {
  const { rapatId } = use(params);
  const { getMeetingById, users, currentUser, addAttachment, deleteAttachment } = useMeeting();
  const meeting = getMeetingById(rapatId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!meeting) {
    return (
      <AppLayout>
        <Card className="p-12 text-center border-dashed">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-xl font-bold">Rapat Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Rapat dengan ID tersebut tidak tersedia di sistem Yayasan.
          </p>
          <Link href="/rapat">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Daftar Rapat</span>
            </Button>
          </Link>
        </Card>
      </AppLayout>
    );
  }

  // Access check per PRD Bab 5:
  // "Jika rapat berstatus Selesai, pengguna non-admin tidak dapat mengakses halaman detail maupun mengunduh lampiran"
  const isCompleted = meeting.status === "COMPLETED";
  const isAdmin = currentUser.globalRole === "ADMIN";

  if (isCompleted && !isAdmin) {
    return (
      <AppLayout>
        <Card className="max-w-lg mx-auto p-8 text-center border shadow-md space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold font-heading">Rapat Telah Selesai</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sesuai tata tertib PRD RapatKita, rapat yang telah ditutup dan berstatus{" "}
            <strong>Selesai (COMPLETED)</strong> diarsipkan secara tertutup. Akses arsip riwayat hanya dapat dibuka oleh Admin Pengelola Yayasan.
          </p>
          <div className="pt-2">
            <Link href="/rapat">
              <Button variant="outline" className="gap-2 w-full">
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Daftar Rapat Aktif</span>
              </Button>
            </Link>
          </div>
        </Card>
      </AppLayout>
    );
  }

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setTimeout(() => {
      addAttachment(meeting.id, {
        namaFileAsli: selectedFile.name,
        mimeType: selectedFile.type || "application/octet-stream",
        ukuranByte: selectedFile.size || 1024 * 500,
        storageType: selectedFile.type.startsWith("video") ? "BUNNY_STREAM" : "BUNNY_STORAGE",
      });

      setSelectedFile(null);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 600);
  };

  const getFileIcon = (mime: string) => {
    if (mime.includes("pdf") || mime.includes("word") || mime.includes("document")) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    }
    if (mime.includes("sheet") || mime.includes("excel") || mime.includes("csv")) {
      return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
    }
    if (mime.includes("image")) {
      return <FileImage className="h-4 w-4 text-amber-500" />;
    }
    if (mime.includes("video")) {
      return <FileVideo className="h-4 w-4 text-purple-500" />;
    }
    return <FileText className="h-4 w-4 text-primary" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "PIMPINAN_RAPAT":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "MODERATOR":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "OPERATOR":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "PIMPINAN_RAPAT":
        return "Pimpinan Rapat";
      case "MODERATOR":
        return "Moderator";
      case "OPERATOR":
        return "Operator Rapat";
      case "PESERTA":
        return "Peserta";
      default:
        return role;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link href="/rapat">
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Daftar Rapat</span>
            </Button>
          </Link>

          {isAdmin && (
            <Link href={`/kelola/rapat/${meeting.id}`}>
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <span>Buka Panel Kelola Admin</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>

        {/* Header Hero Card */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant={meeting.status === "ONGOING" ? "warning" : "info"}
                  pulse={meeting.status === "ONGOING"}
                  className="text-xs font-semibold px-3 py-1"
                >
                  {meeting.status === "ONGOING"
                    ? "Sedang Berlangsung"
                    : meeting.status === "OPEN"
                    ? "Terbuka (Open)"
                    : meeting.status}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {meeting.id}
                </span>
              </div>
            </div>

            <h1 className="text-xl md:text-3xl font-extrabold font-heading text-foreground">
              {meeting.judul}
            </h1>
          </div>

          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs border-b bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-muted-foreground text-[11px]">Tanggal Pelaksanaan</p>
                <p className="font-semibold text-foreground text-sm">
                  {formatTanggalIndonesia(meeting.tanggal)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-muted-foreground text-[11px]">Waktu Sidang</p>
                <p className="font-semibold text-foreground text-sm">
                  {formatWaktuIndonesia(meeting.waktuMulai)} — {formatWaktuIndonesia(meeting.waktuSelesai)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:col-span-2 md:col-span-1">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {meeting.linkRapat ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-[11px]">Tempat / Tautan</p>
                {meeting.tempat && (
                  <p className="font-semibold text-foreground truncate">{meeting.tempat}</p>
                )}
                {meeting.linkRapat && (
                  <a
                    href={meeting.linkRapat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold underline flex items-center gap-1 text-xs truncate mt-0.5"
                  >
                    <span>Masuk Google Meet / Zoom</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Agenda & Attachments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agenda Card */}
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Agenda &amp; Pokok Pembahasan Rapat</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed whitespace-pre-line text-foreground/90 font-normal">
                {meeting.deskripsi}
              </CardContent>
            </Card>

            {/* Attachments & Upload Card */}
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <FileUp className="h-4 w-4 text-primary" />
                    <span>Lampiran &amp; Berkas Pendukung</span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Dokumen materi, paparan slide, dan lembar kerja rapat yayasan
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {meeting.attachments.length} Berkas
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Upload Form (Active when OPEN or ONGOING) */}
                <form
                  onSubmit={handleSimulatedUpload}
                  className="p-4 rounded-xl border border-dashed bg-muted/30 space-y-3"
                >
                  <p className="text-xs font-semibold text-foreground">
                    Unggah Berkas Tambahan (PDF, Word, Excel, PPT, Gambar, Video):
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) =>
                        setSelectedFile(e.target.files ? e.target.files[0] : null)
                      }
                      className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer flex-1"
                      required
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!selectedFile || isUploading}
                      className="gap-1.5 text-xs shrink-0"
                    >
                      <FileUp className="h-3.5 w-3.5" />
                      <span>{isUploading ? "Mengunggah..." : "Unggah Berkas"}</span>
                    </Button>
                  </div>
                  {uploadSuccess && (
                    <div className="text-xs text-success flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Berkas berhasil diunggah ke repositori rapat!</span>
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    Batas ukuran: Dokumen maks. 25MB, Gambar maks. 10MB, Video maks. 500MB (Bunny Stream).
                  </p>
                </form>

                {/* File List */}
                {meeting.attachments.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    Belum ada berkas lampiran yang diunggah untuk rapat ini.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {meeting.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-xl border bg-background hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            {getFileIcon(file.mimeType)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {file.namaFileAsli}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {formatFileSize(file.ukuranByte)} • Diunggah oleh{" "}
                              <strong>{file.uploadedByName}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Link href={`/lampiran/${file.id}`}>
                            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                              <Download className="h-3.5 w-3.5" />
                              <span>Unduh</span>
                            </Button>
                          </Link>

                          {(file.uploadedById === currentUser.id || isAdmin) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm(`Hapus berkas "${file.namaFileAsli}"?`)) {
                                  deleteAttachment(meeting.id, file.id);
                                }
                              }}
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column: Attendees & Roles */}
          <div className="space-y-6">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-primary" />
                  <span>Daftar Peserta &amp; Peran</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {meeting.attendees.length} anggota yayasan diundang
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {meeting.attendees.map((att) => {
                  const u = users.find((usr) => usr.id === att.userId);
                  const isCurrent = att.userId === currentUser.id;

                  return (
                    <div
                      key={att.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                        isCurrent ? "bg-primary/5 border-primary/30" : "bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-[10px] font-bold bg-muted text-foreground">
                            {u?.initials || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {u?.nama || "Peserta"}
                            {isCurrent && " (Anda)"}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {u?.jabatan}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRoleBadgeVariant(
                            att.peran
                          )}`}
                        >
                          {getRoleLabel(att.peran)}
                        </span>
                        {att.kehadiran && (
                          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                            ✓ {att.kehadiran}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
