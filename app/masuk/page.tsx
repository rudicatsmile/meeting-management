"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMeeting } from "@/lib/meeting-context";
import { ShieldCheck, User as UserIcon, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";

export default function MasukPage() {
  const router = useRouter();
  const { users, setCurrentUser } = useMeeting();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Match user by email if exists, otherwise login as admin
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setCurrentUser(foundUser);
      router.push(foundUser.globalRole === "ADMIN" ? "/kelola" : "/rapat");
    } else {
      // Default to admin
      setCurrentUser(users[0]);
      router.push("/kelola");
    }
  };

  const handleQuickLogin = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      router.push(user.globalRole === "ADMIN" ? "/kelola" : "/rapat");
    }
  };

  return (
    <PublicLayout>
      <div className="container max-w-md mx-auto py-12 px-4">
        <Card className="border shadow-lg">
          <CardHeader className="text-center space-y-1 pb-4">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold mb-2">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold font-heading">
              Masuk ke RapatKita
            </CardTitle>
            <CardDescription className="text-xs">
              Sistem Informasi Rapat — Yayasan Al Wathoniyah Asshodriyah 9
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Quick Login for Testing */}
            <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/20 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Simulasi Masuk Cepat (Tahap 1 Demo):</span>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("user-1")}
                  className="w-full text-left p-2 rounded-lg bg-background border hover:border-primary/50 flex items-center justify-between text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary">
                        Dra. Hj. Dewi Lestari, M.Pd.
                      </p>
                      <p className="text-[10px] text-muted-foreground">Admin Pengelola Yayasan</p>
                    </div>
                  </div>
                  <Badge variant="default" className="text-[9px] px-1.5 py-0 h-4 uppercase">
                    Admin
                  </Badge>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin("user-2")}
                  className="w-full text-left p-2 rounded-lg bg-background border hover:border-primary/50 flex items-center justify-between text-xs transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary">
                        H. Rendra Pratama, S.Kom.
                      </p>
                      <p className="text-[10px] text-muted-foreground">Kepala IT / Peserta</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 uppercase">
                    Peserta
                  </Badge>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground text-[10px]">
                  atau masuk manual (Clerk Mode)
                </span>
              </div>
            </div>

            {/* Standard Form */}
            <form onSubmit={handleStandardLogin} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Email Akun Yayasan</span>
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
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Kata Sandi</span>
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2">
                <span>Masuk Aplikasi</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground pt-2">
              Belum memiliki akun?{" "}
              <Link href="/daftar" className="text-primary font-semibold hover:underline">
                Daftar sekarang
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
