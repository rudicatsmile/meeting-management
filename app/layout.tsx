import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { MeetingProvider } from "@/lib/meeting-context";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RapatKita — Sistem Informasi Rapat & Nota Dinas | Yayasan Al Wathoniyah Asshodriyah 9",
  description:
    "Platform digital manajemen siklus rapat, pencatatan kehadiran, lampiran berkas, dan penerbitan nota dinas otomatis untuk Yayasan Al Wathoniyah Asshodriyah 9.",
  keywords: [
    "RapatKita",
    "Manajemen Rapat",
    "Nota Dinas Otomatis",
    "Yayasan Al Wathoniyah Asshodriyah 9",
    "Sistem Rapat Yayasan",
  ],
  authors: [{ name: "Yayasan Al Wathoniyah Asshodriyah 9" }],
  icons: {
    icon: [
      { url: "/logo-yayasan.png", type: "image/png" },
    ],
    shortcut: "/logo-yayasan.png",
    apple: "/logo-yayasan.png",
  },
  openGraph: {
    title: "RapatKita — Sistem Informasi Rapat & Nota Dinas Yayasan",
    description:
      "Kelola rapat terpusat, presensi kehadiran, hingga dokumentasi nota dinas resmi otomatis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <MeetingProvider>{children}</MeetingProvider>
      </body>
    </html>
  );
}
