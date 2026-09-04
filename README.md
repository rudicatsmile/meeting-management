# 📋 RapatKita — Sistem Informasi Rapat & Dokumentasi Nota Dinas
**Yayasan Al Wathoniyah Asshodriyah 9**

Platform digital modern berbasis web untuk mengelola seluruh siklus rapat yayasan — mulai dari perencanaan jadwal, undangan peserta berbasis peran, presensi kehadiran, hingga pembuatan **nota dinas secara otomatis** dan terarsip digital.

---

## 🚀 Fitur Utama

- 🏛️ **Identitas & Tata Kelola Instansi**: Disesuaikan khusus untuk lingkungan Yayasan Al Wathoniyah Asshodriyah 9 dengan kop surat resmi garis ganda.
- 👥 **Alokasi Peran Rapat**: Penugasan spesifik untuk setiap peserta (*Pimpinan Rapat*, *Moderator*, *Operator Rapat*, dan *Peserta*).
- ⏱️ **Siklus Hidup Rapat Dinamis**:
  - `DRAFT`: Perumusan agenda internal pengelola.
  - `OPEN`: Publikasi resmi ke area &ldquo;Rapat Saya&rdquo; peserta terundang.
  - `ONGOING`: Sidang berlangsung, form presensi aktif dengan tanda denyut (*pulsing indicator*).
  - `COMPLETED`: Penutupan rapat oleh pimpinan yang memicu pembuatan otomatis Nota Dinas resmi.
- 📝 **Nota Dinas Otomatis & Editor TipTap**: Penomoran surat baku `ND/{nomor}/YAW-9/{romawi}/{tahun}`, rekapitulasi kehadiran otomatis, editor WYSIWYG TipTap, penguncian status `FINAL`, serta mode **Cetak Standar A4 / PDF**.
- 🛡️ **Audit Log Kronologis**: Setiap perubahan status tercatat secara *append-only* (siapa aktor, waktu, dan status sebelum/sesudahnya).
- 🔍 **SEO & Privasi**: Dilengkapi `sitemap.xml` dan `robots.txt` dengan pembatasan privasi (`Disallow`) untuk data rapat internal.
- 🐳 **Docker Ready**: Dilengkapi multi-stage `Dockerfile` untuk kemudahan deployment ke server VPS.

---

## 🧱 Teknologi (Tech Stack)

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v3.4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Rich Text Editor**: [TipTap](https://tiptap.dev/)
- **Database**: [Neon Serverless PostgreSQL](https://neon.tech/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) + Drizzle Kit
- **Autentikasi**: [Clerk Authentication](https://clerk.com/)
- **Validasi**: [Zod](https://zod.dev/)

---

## 🛠️ Memulai (Getting Started)

### 1. Clone Repositori & Pasang Dependensi
```bash
git clone https://github.com/rudicatsmile/meeting-management.git
cd meeting-management
npm install
```

### 2. Konfigurasi Lingkungan (`.env.local`)
Salin file `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan variabel dengan koneksi Neon dan Clerk Anda:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Neon PostgreSQL
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Clerk Authentication (Opsional / Tahap 2)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

### 3. Migrasi & Seeding Database
```bash
# Buat tabel di database Neon
npm run db:push

# Isi data awal pengurus yayasan dan rapat contoh
npm run db:seed
```

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di peramban Anda.

---

## 📜 Perintah CLI yang Tersedia

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Next.js development server |
| `npm run build` | Menjalankan kompilasi produksi aplikasi |
| `npm run start` | Menjalankan server dalam mode produksi |
| `npm run db:push` | Sinkronisasi skema Drizzle langsung ke Neon PostgreSQL |
| `npm run db:generate` | Membuat berkas migrasi SQL baru di folder `./drizzle` |
| `npm run db:seed` | Menjalankan script pengisian data awal yayasan |
| `npm run db:studio` | Membuka Drizzle Studio (Visual Database GUI) di browser |

---

## 📄 Lisensi
Hak Cipta &copy; Yayasan Al Wathoniyah Asshodriyah 9. Seluruh hak cipta dilindungi undang-undang.
