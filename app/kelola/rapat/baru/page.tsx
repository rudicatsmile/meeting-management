"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMeeting } from "@/lib/meeting-context";
import { AttendeeRole } from "@/lib/mock-data";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  FileText,
  Users,
  Plus,
  Trash2,
  Send,
  Save,
  AlertCircle,
} from "lucide-react";

interface SelectedAttendeeState {
  userId: string;
  peran: AttendeeRole;
}

export default function TambahRapatBaruPage() {
  const router = useRouter();
  const { users, currentUser, createMeeting } = useMeeting();

  // Form states
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("09:00");
  const [jamSelesai, setJamSelesai] = useState("12:00");
  const [tempat, setTempat] = useState("");
  const [linkRapat, setLinkRapat] = useState("");

  // Attendees state (default includes current user as PIMPINAN_RAPAT)
  const [selectedAttendees, setSelectedAttendees] = useState<SelectedAttendeeState[]>([
    { userId: currentUser.id, peran: "PIMPINAN_RAPAT" },
  ]);

  const [errorMessage, setErrorMessage] = useState("");

  const handleAddAttendee = (userId: string) => {
    if (selectedAttendees.some((a) => a.userId === userId)) return;
    setSelectedAttendees([...selectedAttendees, { userId, peran: "PESERTA" }]);
  };

  const handleRemoveAttendee = (userId: string) => {
    setSelectedAttendees(selectedAttendees.filter((a) => a.userId !== userId));
  };

  const handleChangeRole = (userId: string, newRole: AttendeeRole) => {
    setSelectedAttendees(
      selectedAttendees.map((a) => (a.userId === userId ? { ...a, peran: newRole } : a))
    );
  };

  const handleSubmit = (isPublish: boolean) => {
    setErrorMessage("");

    if (!judul.trim()) {
      setErrorMessage("Judul rapat wajib diisi.");
      return;
    }
    if (!deskripsi.trim()) {
      setErrorMessage("Agenda dan pembahasan rapat wajib diisi.");
      return;
    }
    if (!tanggal) {
      setErrorMessage("Tanggal pelaksanaan rapat wajib dipilih.");
      return;
    }
    if (jamSelesai <= jamMulai) {
      setErrorMessage("Jam selesai rapat harus lebih lambat dari jam mulai.");
      return;
    }
    if (selectedAttendees.length === 0) {
      setErrorMessage("Minimal harus ada 1 peserta yang diundang ke dalam rapat.");
      return;
    }

    // Build ISO timestamp
    const waktuMulaiISO = new Date(`${tanggal}T${jamMulai}:00`).toISOString();
    const waktuSelesaiISO = new Date(`${tanggal}T${jamSelesai}:00`).toISOString();

    const created = createMeeting(
      {
        judul,
        deskripsi,
        tanggal,
        waktuMulai: waktuMulaiISO,
        waktuSelesai: waktuSelesaiISO,
        tempat: tempat.trim() || undefined,
        linkRapat: linkRapat.trim() || undefined,
        status: isPublish ? "OPEN" : "DRAFT",
        createdById: currentUser.id,
        attendees: selectedAttendees.map((att, idx) => ({
          id: `att-${Date.now()}-${idx}`,
          meetingId: "",
          userId: att.userId,
          peran: att.peran,
          kehadiran: null,
        })),
      },
      isPublish
    );

    alert(
      isPublish
        ? `Rapat "${judul}" berhasil dibuat dan langsung dipublikasikan (OPEN)!`
        : `Rapat "${judul}" berhasil disimpan sebagai DRAF!`
    );

    router.push(`/kelola/rapat/${created.id}`);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link href="/kelola/rapat">
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Kelola Rapat</span>
            </Button>
          </Link>
          <Badge variant="outline" className="text-xs">
            Form Rapat Baru
          </Badge>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
            Tambah Rencana Rapat Baru
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Susun jadwal sidang yayasan, tentukan peran pimpinan dan peserta, lalu publikasikan.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Meeting Information */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>1. Informasi Pokok Rapat</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Judul, agenda pembahasan, dan lokasi sidang
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Judul Rapat <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Contoh: Rapat Koordinasi Penilaian Akhir Semester Yayasan 2025"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Isi / Agenda Rapat <span className="text-destructive">*</span>
              </label>
              <Textarea
                placeholder="Tuliskan butir-butir agenda yang akan dibahas..."
                rows={5}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Tanggal <span className="text-destructive">*</span></span>
                </label>
                <Input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Jam Mulai</span>
                </label>
                <Input
                  type="time"
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Jam Selesai</span>
                </label>
                <Input
                  type="time"
                  value={jamSelesai}
                  onChange={(e) => setJamSelesai(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>Tempat Fisik (Opsional)</span>
                </label>
                <Input
                  placeholder="Contoh: Ruang Rapat Pimpinan Lt. 2"
                  value={tempat}
                  onChange={(e) => setTempat(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5 text-primary" />
                  <span>Tautan Video Virtual (Opsional)</span>
                </label>
                <Input
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  value={linkRapat}
                  onChange={(e) => setLinkRapat(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Attendees Selection & Role Assignment */}
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>2. Peserta &amp; Penugasan Peran</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Pilih anggota yayasan dan tentukan peran sidang (Pimpinan, Moderator, Operator, Peserta)
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {selectedAttendees.length} Peserta Terpilih
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Selected Attendees List */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground">Daftar Peserta Terundang:</p>
              {selectedAttendees.map((att) => {
                const u = users.find((usr) => usr.id === att.userId);
                return (
                  <div
                    key={att.userId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border bg-muted/20 gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {u?.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{u?.nama}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{u?.jabatan}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={att.peran}
                        onChange={(e) =>
                          handleChangeRole(att.userId, e.target.value as AttendeeRole)
                        }
                        className="h-8 px-2 rounded-lg border bg-background text-xs font-medium"
                      >
                        <option value="PIMPINAN_RAPAT">Pimpinan Rapat</option>
                        <option value="MODERATOR">Moderator</option>
                        <option value="OPERATOR">Operator Rapat</option>
                        <option value="PESERTA">Peserta</option>
                      </select>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAttendee(att.userId)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add from Remaining Users */}
            <div className="pt-3 border-t">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Tambahkan Anggota Lainnya:
              </p>
              <div className="flex flex-wrap gap-2">
                {users
                  .filter((u) => !selectedAttendees.some((a) => a.userId === u.id))
                  .map((u) => (
                    <Button
                      key={u.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddAttendee(u.id)}
                      className="text-xs gap-1.5 h-8 bg-background"
                    >
                      <Plus className="h-3 w-3" />
                      <span>{u.nama.split(",")[0]}</span>
                    </Button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Action Submission */}
        <div className="p-4 rounded-2xl border bg-card shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            <p className="font-semibold text-foreground">Konfirmasi Pembuatan Jadwal</p>
            <p>
              Status <strong>Publikasikan</strong> akan langsung membuka rapat bagi peserta terundang di menu &ldquo;Rapat Saya&rdquo;.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit(false)}
              className="gap-2 text-xs flex-1 sm:flex-initial"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Simpan Draf</span>
            </Button>

            <Button
              type="button"
              onClick={() => handleSubmit(true)}
              className="gap-2 text-xs flex-1 sm:flex-initial shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Publikasikan Rapat</span>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
