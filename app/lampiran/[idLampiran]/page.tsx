"use client";

import React, { use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMeeting } from "@/lib/meeting-context";
import {
  FileText,
  Download,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  User,
} from "lucide-react";

export default function UnduhLampiranPage({
  params,
}: {
  params: Promise<{ idLampiran: string }>;
}) {
  const { idLampiran } = use(params);
  const { meetings, currentUser } = useMeeting();

  // Find attachment across all meetings
  let foundAttachment = null;
  let parentMeeting = null;

  for (const m of meetings) {
    const att = m.attachments.find((a) => a.id === idLampiran);
    if (att) {
      foundAttachment = att;
      parentMeeting = m;
      break;
    }
  }

  if (!foundAttachment || !parentMeeting) {
    return (
      <AppLayout>
        <Card className="max-w-md mx-auto p-8 text-center border-dashed">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold">Berkas Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Lampiran dengan ID tersebut telah dihapus atau tidak pernah terdaftar.
          </p>
          <Link href="/rapat">
            <Button variant="outline" size="sm">
              Kembali ke Halaman Rapat
            </Button>
          </Link>
        </Card>
      </AppLayout>
    );
  }

  // Access check per PRD Bab 5:
  // Non-admin cannot download if meeting is COMPLETED
  const isCompleted = parentMeeting.status === "COMPLETED";
  const isAdmin = currentUser.globalRole === "ADMIN";

  if (isCompleted && !isAdmin) {
    return (
      <AppLayout>
        <Card className="max-w-md mx-auto p-8 text-center border">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <h2 className="text-lg font-bold">Akses Berkas Dibatasi</h2>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Rapat <strong>{parentMeeting.judul}</strong> telah selesai dan diarsipkan.
            Sesuai aturan keamanan PRD RapatKita, berkas lampiran rapat selesai hanya dapat diakses oleh Admin Pengelola Yayasan.
          </p>
          <div className="mt-6">
            <Link href="/rapat">
              <Button variant="outline" size="sm">
                Kembali ke Rapat Aktif
              </Button>
            </Link>
          </div>
        </Card>
      </AppLayout>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDownload = () => {
    // Generate a dummy blob download for testing
    const dummyContent = `Dokumen Resmi: ${foundAttachment.namaFileAsli}\nInstansi: Yayasan Al Wathoniyah Asshodriyah 9\nRapat: ${parentMeeting.judul}\nDiunduh oleh: ${currentUser.nama}\nWaktu: ${new Date().toLocaleString("id-ID")}`;
    const blob = new Blob([dummyContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = foundAttachment.namaFileAsli;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href={`/rapat/${parentMeeting.id}`}>
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Detail Rapat</span>
          </Button>
        </Link>

        <Card className="border shadow-md">
          <CardHeader className="text-center pb-2">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <FileText className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl font-bold font-heading">
              Unduh Lampiran Berkas Rapat
            </CardTitle>
            <CardDescription className="text-xs">
              Pemeriksaan Izin Akses &amp; Integritas Data Terverifikasi
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <div className="p-4 rounded-xl border bg-muted/40 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Nama Berkas:</span>
                <span className="font-bold text-foreground truncate max-w-[280px]">
                  {foundAttachment.namaFileAsli}
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Ukuran Berkas:</span>
                <span className="font-semibold text-foreground">
                  {formatFileSize(foundAttachment.ukuranByte)}
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Tipe Penyimpanan:</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {foundAttachment.storageType}
                </Badge>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Pengunggah:</span>
                <span className="font-medium text-foreground flex items-center gap-1.5">
                  <User className="h-3 w-3 text-primary" />
                  {foundAttachment.uploadedByName}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rapat Terkait:</span>
                <span className="font-medium text-foreground text-right truncate max-w-[260px]">
                  {parentMeeting.judul}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Akses diizinkan untuk <strong>{currentUser.nama}</strong>. Berkas dilindungi dari akses publik tanpa sesi.
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleDownload} className="gap-2 shadow-sm">
                <Download className="h-4 w-4" />
                <span>Mulai Mengunduh Berkas</span>
              </Button>

              <Link href={`/rapat/${parentMeeting.id}`}>
                <Button variant="outline">Kembali ke Rapat</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
