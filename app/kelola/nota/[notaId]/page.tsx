"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMeeting } from "@/lib/meeting-context";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { formatTanggalIndonesia } from "@/lib/utils";
import {
  ArrowLeft,
  Printer,
  Save,
  CheckCircle2,
  Lock,
  Building2,
  AlertCircle,
} from "lucide-react";

export default function EditNotaDinasPage({
  params,
}: {
  params: Promise<{ notaId: string }>;
}) {
  const { notaId } = use(params);
  const { meetings, users, updateOfficeNote } = useMeeting();

  // Find meeting and note
  let foundMeeting = null;
  let foundNote = null;

  for (const m of meetings) {
    if (m.officeNote && m.officeNote.id === notaId) {
      foundMeeting = m;
      foundNote = m.officeNote;
      break;
    }
  }

  const [isiContent, setIsiContent] = useState(
    foundNote ? foundNote.isiFinal || foundNote.isiDraft : ""
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!foundNote || !foundMeeting) {
    return (
      <AdminLayout>
        <Card className="p-12 text-center border-dashed">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-xl font-bold">Nota Dinas Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Dokumen nota dinas dengan ID tersebut tidak tersedia.
          </p>
          <Link href="/kelola/rapat">
            <Button variant="outline" size="sm">
              Kembali ke Kelola Rapat
            </Button>
          </Link>
        </Card>
      </AdminLayout>
    );
  }

  const isFinal = foundNote.status === "FINAL";

  const handleSaveDraft = () => {
    updateOfficeNote(foundNote.id, {
      isiDraft: isiContent,
      status: "DRAFT",
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleFinalize = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin Menerbitkan Nota Dinas ini secara FINAL? Setelah berstatus Final, isi nota dinas akan terkunci dan tidak dapat diubah kembali."
      )
    ) {
      updateOfficeNote(foundNote.id, {
        isiFinal: isiContent,
        status: "FINAL",
      });
      alert("Nota Dinas resmi diterbitkan dan terkunci secara Final!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <Link href={`/kelola/rapat/${foundMeeting.id}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Detail Rapat</span>
            </Button>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={isFinal ? "success" : "warning"}
              className="text-xs px-2.5 py-1 uppercase font-bold"
            >
              {isFinal ? "Final Terbit (Terkunci)" : "Draf Kerja (Bisa Diedit)"}
            </Badge>

            {!isFinal && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  className="gap-1.5 text-xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaved ? "Tersimpan!" : "Simpan Draf"}</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleFinalize}
                  className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Terbitkan Final</span>
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs shadow-sm bg-background"
            >
              <Printer className="h-3.5 w-3.5 text-primary" />
              <span>Cetak / Unduh PDF</span>
            </Button>
          </div>
        </div>

        {/* Status Notice (If Final) */}
        {isFinal && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Nota Dinas ini telah berstatus <strong>FINAL</strong>. Dokumen telah terkunci secara sah dan siap dicetak atau diarsipkan.
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="h-7 text-xs gap-1 bg-background shrink-0"
            >
              <Printer className="h-3 w-3" />
              <span>Cetak Sekarang</span>
            </Button>
          </div>
        )}

        {/* OFFICIAL NOTA DINAS DOCUMENT (A4 PAPER) */}
        <div className="print-paper bg-card border rounded-2xl p-6 sm:p-12 shadow-md space-y-6 text-foreground font-sans">
          {/* 1. KOP SURAT RESMI YAYASAN */}
          <div className="text-center space-y-1 pb-4 relative">
            <div className="flex items-center justify-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-xs border border-border/60 shrink-0">
                <Image
                  src="/logo-yayasan.png"
                  alt="Logo Yayasan Al Wathoniyah Asshodriyah 9"
                  width={60}
                  height={60}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <div className="text-center">
                <h2 className="text-lg sm:text-2xl font-black uppercase font-heading tracking-wide text-foreground">
                  YAYASAN AL WATHONIYAH ASSHODRIYAH 9
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  BADAN PENYELENGGARA PENDIDIKAN DAN PONDOK PESANTREN TERPADU
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Jl. Penggilingan Raya No. 99, Cakung, Jakarta Timur — DKI Jakarta 13940
                </p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  Telp: (021) 480-1234 • Email: sekretariat@asshodriyah9.sch.id
                </p>
              </div>
            </div>

            {/* Double Border Line (Official standard in Indonesian letterhead) */}
            <div className="pt-4">
              <div className="border-b-2 border-foreground"></div>
              <div className="border-b border-foreground mt-[2px]"></div>
            </div>
          </div>

          {/* 2. TITLE & NUMBER */}
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wider font-heading underline underline-offset-4">
              NOTA DINAS
            </h1>
            <p className="text-xs sm:text-sm font-bold font-mono text-muted-foreground">
              Nomor: {foundNote.nomorSurat}
            </p>
          </div>

          {/* 3. METADATA TABLE */}
          <div className="border-y py-3 text-xs sm:text-sm space-y-2">
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 sm:col-span-2 font-bold text-foreground">Kepada</span>
              <span className="col-span-1 text-center font-bold">:</span>
              <span className="col-span-8 sm:col-span-9 text-foreground">
                Pengurus Yayasan &amp; Seluruh Peserta Terkait
              </span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 sm:col-span-2 font-bold text-foreground">Dari</span>
              <span className="col-span-1 text-center font-bold">:</span>
              <span className="col-span-8 sm:col-span-9 text-foreground">
                Pimpinan Rapat / Ketua Yayasan Al Wathoniyah Asshodriyah 9
              </span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 sm:col-span-2 font-bold text-foreground">Tanggal</span>
              <span className="col-span-1 text-center font-bold">:</span>
              <span className="col-span-8 sm:col-span-9 text-foreground">
                {formatTanggalIndonesia(foundMeeting.tanggal)}
              </span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 sm:col-span-2 font-bold text-foreground">Perihal</span>
              <span className="col-span-1 text-center font-bold">:</span>
              <span className="col-span-8 sm:col-span-9 font-bold text-foreground">
                {foundNote.perihal}
              </span>
            </div>
          </div>

          {/* 4. DAFTAR HADIR PESERTA SIDANG */}
          <div className="space-y-2 text-xs sm:text-sm">
            <h3 className="font-bold uppercase tracking-wider text-xs border-b pb-1 text-foreground">
              A. Rekapitulasi Daftar Hadir Peserta:
            </h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="p-2 w-10 text-center">No</th>
                    <th className="p-2">Nama Lengkap &amp; Jabatan</th>
                    <th className="p-2">Peran Sidang</th>
                    <th className="p-2 text-center">Keterangan Presensi</th>
                  </tr>
                </thead>
                <tbody>
                  {foundMeeting.attendees.map((att, idx) => {
                    const u = users.find((usr) => usr.id === att.userId);
                    return (
                      <tr key={att.id} className="border-b last:border-0">
                        <td className="p-2 text-center font-mono">{idx + 1}</td>
                        <td className="p-2">
                          <p className="font-bold">{u?.nama || "Peserta"}</p>
                          <p className="text-[10px] text-muted-foreground">{u?.jabatan}</p>
                        </td>
                        <td className="p-2 font-medium">{att.peran.replace("_", " ")}</td>
                        <td className="p-2 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              att.kehadiran === "HADIR"
                                ? "bg-emerald-100 text-emerald-800"
                                : att.kehadiran === "IZIN"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {att.kehadiran || "Tercatat"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. ISI RISALAH HASIL RAPAT (TIPTAP EDITOR OR FORMATTED VIEW) */}
          <div className="space-y-2 text-xs sm:text-sm pt-2">
            <h3 className="font-bold uppercase tracking-wider text-xs border-b pb-1 text-foreground">
              B. Risalah Keputusan &amp; Hasil Musyawarah Rapat:
            </h3>

            {isFinal ? (
              <div
                className="p-4 sm:p-6 rounded-xl border bg-muted/10 leading-relaxed text-sm prose prose-sm max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: isiContent }}
              />
            ) : (
              <div className="space-y-1.5">
                <p className="text-[11px] text-muted-foreground italic no-print">
                  Gunakan toolbar editor di bawah untuk menyunting poin keputusan rapat sebelum diterbitkan secara Final.
                </p>
                <TipTapEditor
                  content={isiContent}
                  onChange={(val) => setIsiContent(val)}
                  editable={!isFinal}
                />
              </div>
            )}
          </div>

          {/* 6. PENUTUP DAN TANDA TANGAN RESMI */}
          <div className="pt-8 grid grid-cols-2 text-xs sm:text-sm">
            <div>
              <p className="text-muted-foreground text-xs">
                Tembusan:
              </p>
              <ol className="list-decimal pl-4 text-[11px] text-muted-foreground space-y-0.5 mt-1">
                <li>Arsip Sekretariat Yayasan</li>
                <li>Bagian Keuangan &amp; Sarpras</li>
                <li>Kepala Satuan Pendidikan</li>
              </ol>
            </div>

            <div className="text-center space-y-12">
              <div>
                <p className="text-xs text-muted-foreground">Jakarta, {formatTanggalIndonesia(new Date())}</p>
                <p className="font-bold text-foreground">Pimpinan Sidang / Ketua Yayasan,</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-foreground underline font-heading">
                  Dra. Hj. Dewi Lestari, M.Pd.
                </p>
                <p className="text-[10px] text-muted-foreground">
                  NIPY: 19780412 200301 2 009
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
