"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMeeting } from "@/lib/meeting-context";
import { formatTanggalIndonesia, formatWaktuIndonesia } from "@/lib/utils";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Video,
  ArrowRight,
  CalendarDays,
  FileUp,
} from "lucide-react";

export default function DaftarRapatSayaPage() {
  const { meetings, currentUser } = useMeeting();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "ONGOING">("ALL");
  const [dateFilter, setDateFilter] = useState("");

  // Filter meetings:
  // Must invite current user (or if admin, show relevant meetings)
  // Must be status OPEN or ONGOING
  const userMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      // Must be OPEN or ONGOING for user view
      if (meeting.status !== "OPEN" && meeting.status !== "ONGOING") {
        return false;
      }

      // Check if invited or creator
      const isInvited = meeting.attendees.some(
        (att) => att.userId === currentUser.id
      );
      const isCreator = meeting.createdById === currentUser.id;

      if (!isInvited && !isCreator && currentUser.globalRole !== "ADMIN") {
        return false;
      }

      // Filter status
      if (statusFilter !== "ALL" && meeting.status !== statusFilter) {
        return false;
      }

      // Filter date
      if (dateFilter && meeting.tanggal !== dateFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchJudul = meeting.judul.toLowerCase().includes(q);
        const matchDeskripsi = meeting.deskripsi.toLowerCase().includes(q);
        const matchTempat = (meeting.tempat || "").toLowerCase().includes(q);
        return matchJudul || matchDeskripsi || matchTempat;
      }

      return true;
    });
  }, [meetings, currentUser, searchQuery, statusFilter, dateFilter]);

  const getRoleLabel = (meetingId: string) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    if (!meeting) return null;
    const att = meeting.attendees.find((a) => a.userId === currentUser.id);
    if (!att) {
      if (meeting.createdById === currentUser.id) return "Pembuat Rapat (Admin)";
      return "Tamu Undangan";
    }
    switch (att.peran) {
      case "PIMPINAN_RAPAT":
        return "Pimpinan Rapat";
      case "MODERATOR":
        return "Moderator";
      case "OPERATOR":
        return "Operator Rapat";
      case "PESERTA":
        return "Peserta Rapat";
      default:
        return att.peran;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-foreground">
              Daftar Rapat Saya
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Rapat terbuka dan sedang berlangsung yang mengundang Anda di Yayasan Al Wathoniyah Asshodriyah 9
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-3 py-1">
              {userMeetings.length} Rapat Tersedia
            </Badge>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <Card className="border shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari judul agenda atau ruangan rapat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Date Filter */}
            <div className="relative md:col-span-3">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 md:col-span-4 justify-start md:justify-end overflow-x-auto">
              <Button
                variant={statusFilter === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("ALL")}
                className="text-xs h-9 px-3"
              >
                Semua
              </Button>
              <Button
                variant={statusFilter === "ONGOING" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("ONGOING")}
                className="text-xs h-9 px-3 gap-1.5"
              >
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                Berlangsung
              </Button>
              <Button
                variant={statusFilter === "OPEN" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("OPEN")}
                className="text-xs h-9 px-3"
              >
                Terbuka
              </Button>

              {(searchQuery || dateFilter || statusFilter !== "ALL") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setDateFilter("");
                    setStatusFilter("ALL");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground h-9"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Meeting Cards List */}
        {userMeetings.length === 0 ? (
          <Card className="border-dashed p-12 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold font-heading text-foreground">
              Tidak Ada Rapat Aktif
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
              Saat ini tidak ada agenda rapat terbuka atau berlangsung yang mengundang akun{" "}
              <strong>{currentUser.nama}</strong>. Jika Anda pengelola yayasan, buka panel kelola rapat untuk membuat rapat baru.
            </p>
            {currentUser.globalRole === "ADMIN" && (
              <div className="mt-6">
                <Link href="/kelola/rapat/baru">
                  <Button className="gap-2">
                    <span>Buat Rapat Baru Sekarang</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userMeetings.map((meeting) => {
              const roleName = getRoleLabel(meeting.id);
              const isOngoing = meeting.status === "ONGOING";

              return (
                <Card
                  key={meeting.id}
                  className={`border transition-all flex flex-col justify-between ${
                    isOngoing
                      ? "border-amber-400 bg-amber-50/10 shadow-md"
                      : "hover:border-primary/40"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant={isOngoing ? "warning" : "info"}
                        pulse={isOngoing}
                        className="text-xs font-semibold"
                      >
                        {isOngoing ? "Sedang Berlangsung" : "Terbuka (Open)"}
                      </Badge>
                      {roleName && (
                        <Badge variant="outline" className="text-[11px] bg-background">
                          Peran: {roleName}
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="text-lg font-bold mt-2.5 hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/rapat/${meeting.id}`}>{meeting.judul}</Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 text-xs text-muted-foreground flex-1 flex flex-col justify-between">
                    <p className="line-clamp-2 leading-relaxed text-foreground/80">
                      {meeting.deskripsi}
                    </p>

                    <div className="space-y-2 pt-2 border-t text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-medium text-foreground">
                          {formatTanggalIndonesia(meeting.tanggal)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>
                          {formatWaktuIndonesia(meeting.waktuMulai)} —{" "}
                          {formatWaktuIndonesia(meeting.waktuSelesai)}
                        </span>
                      </div>

                      {meeting.tempat && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="truncate">{meeting.tempat}</span>
                        </div>
                      )}

                      {meeting.linkRapat && (
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <Video className="h-3.5 w-3.5 shrink-0" />
                          <a
                            href={meeting.linkRapat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate underline"
                          >
                            Tautan Pertemuan Virtual
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <FileUp className="h-3 w-3" />
                        {meeting.attachments.length} Berkas Lampiran
                      </span>

                      <Link href={`/rapat/${meeting.id}`}>
                        <Button
                          size="sm"
                          variant={isOngoing ? "default" : "outline"}
                          className="gap-1.5 text-xs font-semibold h-8"
                        >
                          <span>Buka Detail &amp; Upload</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
