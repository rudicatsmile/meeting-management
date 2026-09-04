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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMeeting } from "@/lib/meeting-context";
import { createUserAction, deleteUserAction } from "@/app/actions/user-actions";
import {
  Shield,
  ShieldCheck,
  User,
  Search,
  UserPlus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Mail,
  Briefcase,
  User as UserIcon,
} from "lucide-react";

export default function KelolaPenggunaPage() {
  const { users, currentUser, meetings, toggleUserRole, toggleUserActive, addUser, deleteUser } =
    useMeeting();
  const [searchQuery, setSearchQuery] = useState("");

  // Add User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [globalRole, setGlobalRole] = useState<"ADMIN" | "USER">("USER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

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

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!nama.trim() || !email.trim() || !jabatan.trim()) {
      setFormError("Seluruh kolom wajib diisi.");
      return;
    }

    // Check duplicate email in local state
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setFormError(`Email ${email} sudah terdaftar di sistem.`);
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Update Context
      const created = addUser({
        nama: nama.trim(),
        email: email.trim(),
        jabatan: jabatan.trim(),
        globalRole,
      });

      // 2. Call Server Action to sync with Neon PostgreSQL if active
      try {
        await createUserAction({
          id: created.id,
          nama: nama.trim(),
          email: email.trim(),
          jabatan: jabatan.trim(),
          globalRole,
        });
      } catch (serverErr) {
        console.log("Server action sync note:", serverErr);
      }

      // Reset form
      setNama("");
      setEmail("");
      setJabatan("");
      setGlobalRole("USER");
      setIsAddUserOpen(false);

      alert(`Pengguna "${created.nama}" berhasil ditambahkan ke sistem yayasan!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan pengguna.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userToDelete: { id: string; nama: string }) => {
    // 1. Safety check
    if (userToDelete.id === "user-1") {
      alert("Ibu Dra. Hj. Dewi Lestari adalah Admin Utama Yayasan dan dilindungi dari penghapusan.");
      return;
    }

    if (currentUser && userToDelete.id === currentUser.id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.");
      return;
    }

    // 2. Check if user has meeting history
    const hasHistory = meetings.some(
      (m) =>
        m.createdById === userToDelete.id ||
        m.attendees.some((a) => a.userId === userToDelete.id)
    );

    if (hasHistory) {
      alert(
        `⚠️ PENGHAPUSAN DICEGAH DEMI INTEGRITAS DATA:\n\n${userToDelete.nama} sudah pernah memiliki riwayat keikutsertaan atau pembuatan rapat yayasan.\n\nUntuk menjaga keaslian arsip notulen dan risalah sidang, akun tidak dapat dihapus permanen. Silakan gunakan tombol "Nonaktifkan" di sebelah kanan sebagai gantinya.`
      );
      return;
    }

    // 3. Confirm permanent deletion if no meeting history
    if (
      !confirm(
        `Pengguna "${userToDelete.nama}" belum memiliki riwayat rapat.\n\nApakah Anda yakin ingin menghapus akun ini secara permanen dari sistem?`
      )
    ) {
      return;
    }

    const res = deleteUser(userToDelete.id);
    if (!res.success) {
      alert(res.message || "Gagal menghapus pengguna.");
      return;
    }

    try {
      await deleteUserAction(userToDelete.id);
    } catch (e) {
      console.log("Sync deletion note:", e);
    }
    alert(`Pengguna "${userToDelete.nama}" telah berhasil dihapus secara permanen.`);
  };

  if (!currentUser) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
              Kelola Pengguna Yayasan
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Atur hak akses global pengelola dan daftar pegawai Yayasan Al Wathoniyah Asshodriyah 9
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => {
                setFormError("");
                setIsAddUserOpen(true);
              }}
              className="gap-2 shadow-sm text-xs h-9"
            >
              <UserPlus className="h-4 w-4" />
              <span>Tambah Pengguna</span>
            </Button>
            <Badge variant="outline" className="text-xs px-3 py-1 h-9 flex items-center">
              {users.length} Akun
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
              Terhubung ke database Neon PostgreSQL &amp; sinkronisasi akun
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
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-28 text-center text-muted-foreground text-xs">
                    Tidak ada pengguna yang cocok dengan pencarian.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.globalRole === "ADMIN";
                  const isPrimaryAdmin = user.id === "user-1";
                  const isCurrentUser = user.id === currentUser.id;

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
                            <p className="font-bold text-foreground text-xs">
                              {user.nama}
                              {isCurrentUser && " (Anda)"}
                            </p>
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
                          {/* Toggle Role Button */}
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

                          {/* Toggle Active Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPrimaryAdmin}
                            onClick={() => handleToggleActive(user.id, user.isActive)}
                            className={`h-8 text-xs ${
                              user.isActive
                                ? "text-muted-foreground hover:text-foreground"
                                : "text-emerald-600 font-semibold"
                            }`}
                            title={user.isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                          >
                            {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                          </Button>

                          {/* Delete User Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPrimaryAdmin || isCurrentUser}
                            onClick={() => handleDeleteUser({ id: user.id, nama: user.nama })}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 disabled:opacity-30"
                            title={
                              isPrimaryAdmin
                                ? "Admin Utama dilindungi dari penghapusan"
                                : isCurrentUser
                                ? "Tidak dapat menghapus akun Anda sendiri"
                                : "Hapus Pengguna"
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>

        {/* MODAL DIALOG: TAMBAH PENGGUNA BARU */}
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <span>Tambah Pengguna Baru</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Daftarkan pimpinan, guru, atau staf baru Yayasan Al Wathoniyah Asshodriyah 9.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 py-2">
              {formError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-primary" />
                  <span>Nama Lengkap (dengan Gelar) <span className="text-destructive">*</span></span>
                </label>
                <Input
                  placeholder="Contoh: Drs. H. Ahmad Subarjo, M.Pd."
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span>Email Resmi Yayasan <span className="text-destructive">*</span></span>
                </label>
                <Input
                  type="email"
                  placeholder="nama@asshodriyah9.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                  <span>Jabatan / Unit Kerja <span className="text-destructive">*</span></span>
                </label>
                <Input
                  placeholder="Contoh: Kepala Bagian Sarana & Prasarana"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span>Peran Global Sistem</span>
                </label>
                <select
                  value={globalRole}
                  onChange={(e) => setGlobalRole(e.target.value as "ADMIN" | "USER")}
                  className="w-full h-10 px-3 rounded-lg border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="USER">Pengguna Biasa (Akses Rapat Saya &amp; Unggah Lampiran)</option>
                  <option value="ADMIN">Admin Pengelola (Akses Penuh Kelola Rapat &amp; Nota Dinas)</option>
                </select>
              </div>

              <DialogFooter className="pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="gap-1.5 shadow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isSubmitting ? "Menyimpan..." : "Simpan Pengguna"}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
