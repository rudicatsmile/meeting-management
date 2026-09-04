"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMeeting } from "@/lib/meeting-context";
import { formatTanggalIndonesia, formatWaktuIndonesia } from "@/lib/utils";
import {
  Search,
  PlusCircle,
  FileText,
  Users,
  Eye,
} from "lucide-react";

type StatusTab = "ALL" | "DRAFT" | "OPEN" | "ONGOING" | "COMPLETED";

export default function KelolaRapatPage() {
  const { meetings, currentUser } = useMeeting();
  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      // Tab filter
      if (activeTab !== "ALL" && meeting.status !== activeTab) {
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
  }, [meetings, activeTab, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="draft">Draf</Badge>;
      case "OPEN":
        return <Badge variant="info">Terbuka</Badge>;
      case "ONGOING":
        return (
          <Badge variant="warning" pulse>
            Berlangsung
          </Badge>
        );
      case "COMPLETED":
        return <Badge variant="success">Selesai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
              Daftar Seluruh Rapat
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola siklus agenda, publikasi, catatan kehadiran, dan nota dinas Yayasan Al Wathoniyah Asshodriyah 9
            </p>
          </div>

          <Link href="/kelola/rapat/baru">
            <Button className="gap-2 shadow-sm">
              <PlusCircle className="h-4 w-4" />
              <span>Buat Rapat Baru</span>
            </Button>
          </Link>
        </div>

        {/* Tab Filters and Search */}
        <Card className="border shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tab Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <Button
                variant={activeTab === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("ALL")}
                className="text-xs h-9 px-3"
              >
                Semua ({meetings.length})
              </Button>
              <Button
                variant={activeTab === "OPEN" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("OPEN")}
                className="text-xs h-9 px-3"
              >
                Terbuka ({meetings.filter((m) => m.status === "OPEN").length})
              </Button>
              <Button
                variant={activeTab === "ONGOING" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("ONGOING")}
                className="text-xs h-9 px-3 gap-1.5"
              >
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
                Berlangsung ({meetings.filter((m) => m.status === "ONGOING").length})
              </Button>
              <Button
                variant={activeTab === "COMPLETED" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("COMPLETED")}
                className="text-xs h-9 px-3"
              >
                Riwayat Selesai ({meetings.filter((m) => m.status === "COMPLETED").length})
              </Button>
              <Button
                variant={activeTab === "DRAFT" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("DRAFT")}
                className="text-xs h-9 px-3"
              >
                Draf ({meetings.filter((m) => m.status === "DRAFT").length})
              </Button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari judul atau ruangan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Meeting Table */}
        <Card className="border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[340px]">Judul Rapat &amp; Lokasi</TableHead>
                <TableHead>Jadwal Pelaksanaan</TableHead>
                <TableHead>Peserta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nota Dinas</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Tidak ada rapat yang sesuai dengan kriteria filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMeetings.map((meeting) => (
                  <TableRow key={meeting.id} className="hover:bg-muted/30">
                    <TableCell className="align-top py-3.5">
                      <div className="space-y-1">
                        <Link
                          href={`/kelola/rapat/${meeting.id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors text-sm line-clamp-2"
                        >
                          {meeting.judul}
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {meeting.tempat || (meeting.linkRapat ? "Pertemuan Virtual" : "Tempat belum diatur")}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="align-top py-3.5 whitespace-nowrap text-xs">
                      <p className="font-semibold text-foreground">
                        {formatTanggalIndonesia(meeting.tanggal)}
                      </p>
                      <p className="text-muted-foreground">
                        {formatWaktuIndonesia(meeting.waktuMulai)}
                      </p>
                    </TableCell>

                    <TableCell className="align-top py-3.5 whitespace-nowrap text-xs">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        {meeting.attendees.length} Peserta
                      </span>
                    </TableCell>

                    <TableCell className="align-top py-3.5 whitespace-nowrap text-xs">
                      {getStatusBadge(meeting.status)}
                    </TableCell>

                    <TableCell className="align-top py-3.5 whitespace-nowrap text-xs">
                      {meeting.officeNote ? (
                        <div className="space-y-0.5">
                          <Badge
                            variant={meeting.officeNote.status === "FINAL" ? "success" : "warning"}
                            className="text-[10px]"
                          >
                            {meeting.officeNote.status === "FINAL" ? "Final Terbit" : "Draf Otomatis"}
                          </Badge>
                          <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[130px]">
                            {meeting.officeNote.nomorSurat}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">—</span>
                      )}
                    </TableCell>

                    <TableCell className="align-top py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/kelola/rapat/${meeting.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span>Kelola</span>
                          </Button>
                        </Link>

                        {meeting.officeNote && (
                          <Link href={`/kelola/nota/${meeting.officeNote.id}`}>
                            <Button
                              variant={meeting.officeNote.status === "FINAL" ? "secondary" : "default"}
                              size="sm"
                              className="h-8 text-xs gap-1"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Nota Dinas</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
