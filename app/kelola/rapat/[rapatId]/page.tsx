"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMeeting } from "@/lib/meeting-context";
import { formatTanggalIndonesia, formatWaktuIndonesia } from "@/lib/utils";
import { AttendanceStatus } from "@/lib/mock-data";
import {
  ArrowLeft,
  MapPin,
  Video,
  FileText,
  Users2,
  FileUp,
  History,
  Send,
  Play,
  CheckCircle,
  FileCheck2,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function DetailKelolaRapatPage({
  params,
}: {
  params: Promise<{ rapatId: string }>;
}) {
  const { rapatId } = use(params);
  const router = useRouter();
  const {
    getMeetingById,
    users,
    currentUser,
    updateMeetingStatus,
    saveAttendance,
    closeMeetingAndGenerateNote,
    addAttachment,
    deleteAttachment,
  } = useMeeting();

  const meeting = getMeetingById(rapatId);

  // Attendance local state for editing
  const [attendanceRecords, setAttendanceRecords] = useState<
    { attendeeId: string; kehadiran: AttendanceStatus }[]
  >([]);

  // Dialog state for closing meeting
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [ringkasanInput, setRingkasanInput] = useState("");
  const [closeError, setCloseError] = useState("");

  // Upload local state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize attendance records when meeting is loaded
  React.useEffect(() => {
    if (meeting) {
      setAttendanceRecords(
        meeting.attendees.map((a) => ({
          attendeeId: a.id,
          kehadiran: a.kehadiran,
        }))
      );
    }
  }, [meeting]);

  if (!meeting) {
    return (
      <AdminLayout>
        <Card className="p-12 text-center border-dashed">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-xl font-bold">Rapat Tidak Ditemukan</h2>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Rapat tidak terdaftar di sistem pengelola.
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

  const handlePublish = () => {
    if (confirm("Publikasikan rapat ini? Status akan berubah menjadi OPEN.")) {
      updateMeetingStatus(meeting.id, "OPEN", "Rapat dipublikasikan oleh Admin Pengelola");
    }
  };

  const handleStartMeeting = () => {
    if (confirm("Mulai rapat sekarang? Status akan berubah menjadi ONGOING dan form presensi aktif.")) {
      updateMeetingStatus(meeting.id, "ONGOING", "Rapat dimulai oleh Admin Pengelola");
    }
  };

  const handleSaveAttendance = () => {
    saveAttendance(meeting.id, attendanceRecords);
    alert("Daftar kehadiran peserta berhasil disimpan!");
  };

  const handleCloseMeetingSubmit = () => {
    if (!ringkasanInput.trim() || ringkasanInput.trim().length < 10) {
      setCloseError("Ringkasan risalah hasil rapat wajib diisi minimal 10 karakter.");
      return;
    }

    const note = closeMeetingAndGenerateNote(meeting.id, ringkasanInput.trim());
    setIsCloseModalOpen(false);

    if (note) {
      alert("Rapat resmi ditutup! Draf Nota Dinas berhasil disusun otomatis.");
      router.push(`/kelola/nota/${note.id}`);
    }
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsUploading(true);
    setTimeout(() => {
      addAttachment(meeting.id, {
        namaFileAsli: selectedFile.name,
        mimeType: selectedFile.type || "application/octet-stream",
        ukuranByte: selectedFile.size || 500000,
        storageType: selectedFile.type.startsWith("video") ? "BUNNY_STREAM" : "BUNNY_STORAGE",
      });
      setSelectedFile(null);
      setIsUploading(false);
    }, 500);
  };

  const isDraft = meeting.status === "DRAFT";
  const isOpen = meeting.status === "OPEN";
  const isOngoing = meeting.status === "ONGOING";
  const isCompleted = meeting.status === "COMPLETED";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Navigation Back & Status Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/kelola/rapat">
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Tabel Rapat</span>
            </Button>
          </Link>

          {/* Action Lifecycle Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isDraft && (
              <Button onClick={handlePublish} className="gap-1.5 text-xs h-8">
                <Send className="h-3.5 w-3.5" />
                <span>Publikasikan Rapat</span>
              </Button>
            )}

            {isOpen && (
              <Button
                onClick={handleStartMeeting}
                className="gap-1.5 text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Mulai Rapat (Set ONGOING)</span>
              </Button>
            )}

            {isOngoing && (
              <Button
                onClick={() => {
                  setRingkasanInput(meeting.ringkasanHasil || "");
                  setIsCloseModalOpen(true);
                }}
                className="gap-1.5 text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Akhiri Rapat &amp; Susun Nota Dinas</span>
              </Button>
            )}

            {isCompleted && meeting.officeNote && (
              <Link href={`/kelola/nota/${meeting.officeNote.id}`}>
                <Button size="sm" className="gap-1.5 text-xs h-8">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Buka Nota Dinas</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Meeting Hero Banner */}
        <Card className="border shadow-sm overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-primary/10 via-background to-background border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    isOngoing
                      ? "warning"
                      : isOpen
                      ? "info"
                      : isCompleted
                      ? "success"
                      : "draft"
                  }
                  pulse={isOngoing}
                  className="text-xs uppercase font-bold"
                >
                  {isOngoing
                    ? "Sedang Berlangsung"
                    : isOpen
                    ? "Terbuka"
                    : isCompleted
                    ? "Selesai"
                    : "Draf"}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {meeting.id}
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold font-heading text-foreground">
                {meeting.judul}
              </h1>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  {formatTanggalIndonesia(meeting.tanggal)}
                </p>
                <p>
                  {formatWaktuIndonesia(meeting.waktuMulai)} —{" "}
                  {formatWaktuIndonesia(meeting.waktuSelesai)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Multi-Tab Navigation */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="info" className="gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              <span>Info</span>
            </TabsTrigger>
            <TabsTrigger value="peserta" className="gap-1.5 text-xs">
              <Users2 className="h-3.5 w-3.5" />
              <span>Presensi ({meeting.attendees.length})</span>
            </TabsTrigger>
            <TabsTrigger value="lampiran" className="gap-1.5 text-xs">
              <FileUp className="h-3.5 w-3.5" />
              <span>Lampiran ({meeting.attachments.length})</span>
            </TabsTrigger>
            <TabsTrigger value="nota" className="gap-1.5 text-xs">
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Nota Dinas</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-1.5 text-xs">
              <History className="h-3.5 w-3.5" />
              <span>Audit Log</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: INFO & AGENDA */}
          <TabsContent value="info" className="space-y-6 pt-2">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">Agenda &amp; Rincian Pertemuan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-muted/40 text-sm leading-relaxed whitespace-pre-line text-foreground/90 font-normal">
                  {meeting.deskripsi}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl border space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>Tempat / Ruangan Fisik:</span>
                    </p>
                    <p className="font-semibold text-foreground text-sm">
                      {meeting.tempat || "Tidak ada ruangan fisik (online murni)"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border space-y-1">
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5 text-primary" />
                      <span>Tautan Video Virtual:</span>
                    </p>
                    {meeting.linkRapat ? (
                      <a
                        href={meeting.linkRapat}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary underline text-sm truncate block"
                      >
                        {meeting.linkRapat}
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm">Tidak ada tautan online</p>
                    )}
                  </div>
                </div>

                {meeting.ringkasanHasil && (
                  <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/30 space-y-1.5">
                    <p className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Ringkasan Risalah / Hasil Rapat Final:</span>
                    </p>
                    <p className="text-xs text-emerald-900/90 leading-relaxed whitespace-pre-line">
                      {meeting.ringkasanHasil}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: PESERTA & PRESENSI */}
          <TabsContent value="peserta" className="space-y-6 pt-2">
            <Card className="border shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold">
                    Pencatatan Kehadiran Peserta
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {isOngoing
                      ? "Sidang sedang berlangsung. Tandai presensi setiap anggota dan klik Simpan Kehadiran."
                      : isCompleted
                      ? "Rapat telah selesai. Data presensi telah terekam dan terkunci pada Nota Dinas."
                      : "Presensi aktif setelah status rapat diubah menjadi Sedang Berlangsung (ONGOING)."}
                  </CardDescription>
                </div>

                {isOngoing && (
                  <Button onClick={handleSaveAttendance} size="sm" className="gap-1.5 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Simpan Kehadiran</span>
                  </Button>
                )}
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {meeting.attendees.map((att) => {
                    const u = users.find((usr) => usr.id === att.userId);
                    const currentStatus =
                      attendanceRecords.find((r) => r.attendeeId === att.id)?.kehadiran || null;

                    return (
                      <div
                        key={att.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border bg-card hover:bg-muted/20 gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {u?.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground truncate">{u?.nama}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{u?.jabatan}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <Badge variant="outline" className="text-[10px]">
                            {att.peran.replace("_", " ")}
                          </Badge>

                          {/* Attendance Radio Buttons */}
                          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
                            <button
                              type="button"
                              disabled={!isOngoing}
                              onClick={() =>
                                setAttendanceRecords((prev) =>
                                  prev.map((r) =>
                                    r.attendeeId === att.id ? { ...r, kehadiran: "HADIR" } : r
                                  )
                                )
                              }
                              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                                currentStatus === "HADIR"
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "text-muted-foreground hover:text-foreground"
                              } ${!isOngoing ? "opacity-75 cursor-default" : ""}`}
                            >
                              Hadir
                            </button>

                            <button
                              type="button"
                              disabled={!isOngoing}
                              onClick={() =>
                                setAttendanceRecords((prev) =>
                                  prev.map((r) =>
                                    r.attendeeId === att.id ? { ...r, kehadiran: "IZIN" } : r
                                  )
                                )
                              }
                              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                                currentStatus === "IZIN"
                                  ? "bg-amber-600 text-white shadow-sm"
                                  : "text-muted-foreground hover:text-foreground"
                              } ${!isOngoing ? "opacity-75 cursor-default" : ""}`}
                            >
                              Izin
                            </button>

                            <button
                              type="button"
                              disabled={!isOngoing}
                              onClick={() =>
                                setAttendanceRecords((prev) =>
                                  prev.map((r) =>
                                    r.attendeeId === att.id ? { ...r, kehadiran: "TIDAK_HADIR" } : r
                                  )
                                )
                              }
                              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                                currentStatus === "TIDAK_HADIR"
                                  ? "bg-destructive text-white shadow-sm"
                                  : "text-muted-foreground hover:text-foreground"
                              } ${!isOngoing ? "opacity-75 cursor-default" : ""}`}
                            >
                              Tidak Hadir
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: LAMPIRAN */}
          <TabsContent value="lampiran" className="space-y-6 pt-2">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">Manajemen Berkas Lampiran</CardTitle>
                <CardDescription className="text-xs">
                  Seluruh dokumen, paparan, dan rekaman video yang tersimpan di Bunny Storage &amp; Stream
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Upload Form */}
                <form
                  onSubmit={handleUploadFile}
                  className="p-4 rounded-xl border border-dashed bg-muted/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  <input
                    type="file"
                    onChange={(e) =>
                      setSelectedFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground cursor-pointer flex-1"
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
                </form>

                {meeting.attachments.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    Belum ada lampiran berkas yang diunggah.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {meeting.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-xl border bg-card text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-5 w-5 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {file.namaFileAsli}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Diunggah oleh {file.uploadedByName} • Tipe: {file.storageType}
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm(`Hapus lampiran "${file.namaFileAsli}"?`)) {
                                deleteAttachment(meeting.id, file.id);
                              }
                            }}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: NOTA DINAS */}
          <TabsContent value="nota" className="space-y-6 pt-2">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold">Nota Dinas Resmi Yayasan</CardTitle>
                <CardDescription className="text-xs">
                  Dokumentasi penetapan keputusan hasil rapat dan lembar presensi resmi
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {meeting.officeNote ? (
                  <div className="p-6 rounded-2xl border bg-muted/20 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                      <div>
                        <Badge
                          variant={meeting.officeNote.status === "FINAL" ? "success" : "warning"}
                          className="text-xs uppercase font-bold"
                        >
                          {meeting.officeNote.status === "FINAL" ? "Final Terbit" : "Draf Otomatis"}
                        </Badge>
                        <h3 className="text-lg font-bold font-mono text-foreground mt-1">
                          Nomor: {meeting.officeNote.nomorSurat}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Perihal: {meeting.officeNote.perihal}
                        </p>
                      </div>

                      <Link href={`/kelola/nota/${meeting.officeNote.id}`}>
                        <Button className="gap-2 shadow-sm">
                          <FileText className="h-4 w-4" />
                          <span>
                            {meeting.officeNote.status === "FINAL"
                              ? "Lihat & Cetak Nota Dinas"
                              : "Buka Editor & Finalisasi"}
                          </span>
                        </Button>
                      </Link>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <p>
                        Dibuat pada:{" "}
                        <strong>{new Date(meeting.officeNote.createdAt).toLocaleString("id-ID")}</strong>
                      </p>
                      <p className="mt-1">
                        Status saat ini:{" "}
                        <span className="font-semibold text-foreground">
                          {meeting.officeNote.status === "FINAL"
                            ? "Telah Diterbitkan (Isi Terkunci & Siap Cetak A4)"
                            : "Draf Kerja (Dapat Diedit Admin)"}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border-dashed rounded-2xl border text-xs text-muted-foreground space-y-3">
                    <FileCheck2 className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="font-semibold text-foreground text-sm">
                      Draf Nota Dinas Belum Dibuat
                    </p>
                    <p className="max-w-md mx-auto leading-relaxed">
                      Draf nota dinas resmi akan otomatis dibuat saat Admin mengklik tombol{" "}
                      <strong>&ldquo;Akhiri Rapat &amp; Susun Nota Dinas&rdquo;</strong> ketika rapat berstatus{" "}
                      <strong>Sedang Berlangsung (ONGOING)</strong>.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: AUDIT LOG */}
          <TabsContent value="audit" className="space-y-6 pt-2">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  <span>Jejak Aktivitas &amp; Audit Log</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Rekaman seluruh perubahan status rapat secara kronologis (bersifat append-only)
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="relative pl-6 border-l-2 border-primary/20 space-y-6 my-2">
                  {meeting.auditLogs.map((log) => (
                    <div key={log.id} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background"></span>

                      <div className="p-3.5 rounded-xl border bg-card text-xs space-y-1 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-foreground">
                            {log.aksi.replace(/_/g, " ")}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {new Date(log.createdAt).toLocaleString("id-ID")}
                          </span>
                        </div>

                        <p className="text-muted-foreground">
                          {log.deskripsi || `Perubahan status: ${log.statusLama} → ${log.statusBaru}`}
                        </p>

                        <div className="pt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground border-t">
                          <span>Aktor: <strong>{log.actorName}</strong></span>
                          <span>•</span>
                          <Badge variant="outline" className="text-[9px] py-0 px-1.5">
                            {log.statusLama} → {log.statusBaru}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* MODAL DIALOG: TUTUP RAPAT & BUAT DRAF NOTA DINAS */}
        <Dialog open={isCloseModalOpen} onOpenChange={setIsCloseModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Akhiri Rapat &amp; Terbitkan Draf Nota Dinas
              </DialogTitle>
              <DialogDescription className="text-xs">
                Masukkan risalah ringkasan kesepakatan rapat. Sistem akan otomatis menyusun dokumen nota dinas resmi dengan format nomor baku yayasan.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <label className="text-xs font-semibold text-foreground">
                Ringkasan Risalah / Keputusan Rapat <span className="text-destructive">*</span>
              </label>
              <Textarea
                rows={6}
                placeholder="Contoh: Rapat menyepakati penambahan anggaran sarpras sebesar 15% untuk peremajaan laboratorium, serta menugaskan biro IT menyelesaikan instalasi selambatnya akhir bulan..."
                value={ringkasanInput}
                onChange={(e) => setRingkasanInput(e.target.value)}
                className="text-xs leading-relaxed"
              />
              {closeError && (
                <p className="text-xs text-destructive font-medium">{closeError}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCloseModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleCloseMeetingSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Simpan &amp; Buat Nota Dinas</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
