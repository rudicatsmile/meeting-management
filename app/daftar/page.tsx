"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMeeting } from "@/lib/meeting-context";
import { Mail, Lock, User as UserIcon, Briefcase, ArrowRight } from "lucide-react";

export default function DaftarPage() {
  const router = useRouter();
  const { setCurrentUser } = useMeeting();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = nama
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

    const newUser = {
      id: `user-${Date.now()}`,
      nama,
      email,
      jabatan: jabatan || "Staff Satuan Pendidikan",
      globalRole: "USER" as const,
      initials: initials || "US",
      isActive: true,
    };

    setCurrentUser(newUser);
    alert(`Pendaftaran berhasil! Selamat datang, ${nama}. Anda masuk sebagai Peserta.`);
    router.push("/rapat");
  };

  return (
    <PublicLayout>
      <div className="container max-w-md mx-auto py-12 px-4">
        <Card className="border shadow-lg">
          <CardHeader className="text-center space-y-1 pb-4">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md border border-border/60 mb-2">
              <Image
                src="/logo-yayasan.png"
                alt="Logo Yayasan Al Wathoniyah Asshodriyah 9"
                width={56}
                height={56}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold font-heading">
              Daftar Akun Baru
            </CardTitle>
            <CardDescription className="text-xs">
              Bergabung dengan RapatKita — Yayasan Al Wathoniyah Asshodriyah 9
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Nama Lengkap &amp; Gelar</span>
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Email Resmi Yayasan</span>
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
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Jabatan / Unit Kerja</span>
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: Guru Bidang Studi / Staff TU"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Kata Sandi</span>
                </label>
                <Input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2 mt-4">
                <span>Daftar Akun</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground pt-2">
              Sudah memiliki akun?{" "}
              <Link href="/masuk" className="text-primary font-semibold hover:underline">
                Masuk di sini
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
