"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Aplikasi RapatKita mengalami error runtime:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full border shadow-xl text-center p-8 space-y-6">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-foreground">
            Terjadi Kendala Sistem
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sistem mendeteksi kendala saat memproses permintaan Anda. Silakan coba muat ulang komponen atau kembali ke halaman utama.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted-foreground bg-muted p-1.5 rounded">
              Kode Error: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => reset()}
            className="gap-2 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Coba Lagi</span>
          </Button>

          <Link href="/">
            <Button className="w-full sm:w-auto gap-2 text-xs">
              <Home className="h-3.5 w-3.5" />
              <span>Halaman Utama</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
