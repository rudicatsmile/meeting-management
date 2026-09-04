"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMeeting } from "@/lib/meeting-context";
import {
  Shield,
  ShieldCheck,
  User,
  Search,
} from "lucide-react";

export default function KelolaPenggunaPage() {
  const { users, toggleUserRole, toggleUserActive } = useMeeting();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.nama.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.jabatan.toLowerCase().includes(q)
    );
  });

  const handleToggleRole = (userId: string, currentRole: string) => {
    if (userId === "user-1") {
      alert("Ibu Dra. Hj. Dewi Lestari adalah Admin Utama Yayasan dan tidak dapat diubah perannya.");
      return;
    }
    const newRole = currentRole === "ADMIN" ? "User Biasa" : "Admin";
    if (confirm(`Ubah peran pengguna ini menjadi ${newRole}?`)) {
      toggleUserRole(userId);
    }
  };

  const handleToggleActive = (userId: string, currentActive: boolean) => {
    if (userId === "user-1") {
      alert("Ibu Dra. Hj. Dewi Lestari adalah Admin Utama Yayasan dan tidak dapat dinonaktifkan.");
      return;
    }
    const action = currentActive ? "menonaktifkan" : "mengaktifkan";
    if (confirm(`Apakah Anda yakin ingin ${action} akun pengguna ini?`)) {
      toggleUserActive(userId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
              Kelola Pengguna Yayasan
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Atur hak akses global pengelola dan daftar pegawai Yayasan Al Wathoniyah Asshodriyah 9
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs px-3 py-1">
              {users.length} Akun Terdaftar
            </Badge>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border shadow-sm p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, email, atau jabatan pegawai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Sinkronisasi otomatis melalui Clerk Webhook pada Tahap 2
            </p>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama &amp; Inisial</TableHead>
                <TableHead>Email Resmi</TableHead>
                <TableHead>Jabatan / Unit</TableHead>
                <TableHead>Peran Global</TableHead>
                <TableHead>Status Akun</TableHead>
                <TableHead className="text-right">Aksi Kelola</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const isAdmin = user.globalRole === "ADMIN";
                const isPrimaryAdmin = user.id === "user-1";

                return (
                  <TableRow key={user.id} className="hover:bg-muted/30">
                    <TableCell className="align-middle py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-primary/20">
                          <AvatarFallback
                            className={
                              isAdmin
                                ? "bg-primary text-primary-foreground font-bold text-xs"
                                : "bg-muted text-foreground text-xs"
                            }
                          >
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-foreground text-xs">{user.nama}</p>
                          {isPrimaryAdmin && (
                            <span className="text-[10px] text-primary font-semibold">
                              (Admin Utama)
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="align-middle py-3 text-xs font-mono text-muted-foreground">
                      {user.email}
                    </TableCell>

                    <TableCell className="align-middle py-3 text-xs text-foreground font-medium">
                      {user.jabatan}
                    </TableCell>

                    <TableCell className="align-middle py-3 text-xs">
                      <Badge
                        variant={isAdmin ? "default" : "secondary"}
                        className="text-[10px] gap-1 font-semibold uppercase"
                      >
                        {isAdmin ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        <span>{isAdmin ? "Admin" : "Pengguna"}</span>
                      </Badge>
                    </TableCell>

                    <TableCell className="align-middle py-3 text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {user.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </TableCell>

                    <TableCell className="align-middle py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPrimaryAdmin}
                          onClick={() => handleToggleRole(user.id, user.globalRole)}
                          className="h-8 text-xs gap-1"
                          title="Ganti Peran Global Admin / Pengguna Biasa"
                        >
                          <Shield className="h-3 w-3 text-primary" />
                          <span>{isAdmin ? "Jadikan User" : "Jadikan Admin"}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isPrimaryAdmin}
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          className={`h-8 text-xs ${
                            user.isActive ? "text-destructive hover:bg-destructive/10" : "text-success"
                          }`}
                        >
                          {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
