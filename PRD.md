# 📋 RapatKita — Product Requirements Document (PRD)

---

## 1. Ringkasan & Tujuan Aplikasi

### Nama Aplikasi
**RapatKita** — Sistem Informasi Rapat & Dokumentasi Nota Dinas

### Penjelasan Singkat
**RapatKita** adalah platform digital untuk mengelola seluruh siklus rapat — mulai dari perencanaan jadwal, undangan peserta, pembagian lampiran, pencatatan kehadiran, hingga pembuatan **nota dinas secara otomatis** saat rapat selesai. Semua riwayat rapat tersimpan rapi dan aman dalam satu tempat.

### Masalah yang Diselesaikan
- ❌ Rapat sering tidak terdokumentasi dengan baik, sehingga tidak ada **history** yang bisa ditelusuri kembali.
- ❌ Proses undangan dan pembagian file rapat masih manual melalui chat / email sehingga mudah tercecer.
- ❌ Data peserta rapat tidak tercatat sistematis (siapa pimpinan, moderator, operator, dan peserta).
- ❌ Nota dinas dibuat manual setelah rapat, memakan waktu lama dan rentan kehilangan arsip.
- ❌ Tidak ada jejak aktivitas perubahan status rapat (open → berlangsung → selesai).

### Pengguna Aplikasi
| Tipe Pengguna | Kebutuhan Utama |
| :--- | :--- |
| **Admin Pengelola** | Membuat rapat, mengundang peserta, mengatur status rapat, mencatat kehadiran, mengelola lampiran, dan menyusun nota dinas. |
| **Pimpinan Rapat** | Melihat daftar rapat yang dipimpinnya, membuka bahan rapat, dan mengetahui hasil akhirnya. |
| **Moderator Rapat** | Mengkoordinasikan jalannya rapat, melihat daftar peserta dan lampiran. |
| **Operator Rapat** | Mengoperasikan perangkat dan membantu mendokumentasikan jalannya rapat. |
| **Peserta Rapat** | Menerima undangan, melihat detail/jadwal rapat, dan mengunggah file pendukung rapat. |

### Target Keberhasilan
- 🎯 100% rapat yang direncanakan memiliki arsip digital lengkap di RapatKita.
- 🎯 Waktu penyusunan nota dinas turun drastis karena draft dibuat otomatis oleh sistem.
- 🎯 Semua file dan lampiran rapat tersimpan di satu lokasi terpusat.
- 🎯 Kehadiran peserta rapat terdokumentasi secara akurat.
- 🎯 Admin dapat melihat seluruh riwayat rapat yang dikelolanya tanpa harus mencari arsip fisik.

---

## 2. Batasan Pembuatan Sistem (Versi Awal MVP)

### ✅ Yang Dikerjakan:
- Autentikasi dengan **Email & Password** melalui Clerk.
- Manajemen daftar **pengguna** dan **peran global** (Admin dan Pengguna Biasa).
- Pembuatan jadwal rapat oleh Admin, lengkap dengan pemilihan peserta beserta perannya di rapat (**Pimpinan Rapat**, **Moderator**, **Operator Rapat**, **Peserta**).
- Publikasi rapat dengan status **Open**.
- Halaman daftar rapat dengan **pencarian kata kunci** dan **filter rentang tanggal**.
- Halaman **detail rapat** berisi:
  - Judul, isi/agenda rapat, waktu, lokasi/tautan rapat.
  - Daftar peserta yang diundang beserta perannya.
  - Unggahan file rapat (PDF, Word, Excel, PowerPoint, gambar, video).
- Perubahan status rapat:
  - **Open** → otomatis menjadi **Sedang Berlangsung** saat waktu mulai rapat tiba.
  - **Sedang Berlangsung** → **Selesai** ketika Admin menutup rapat.
- Form pencatatan **kehadiran peserta** pada saat rapat berlangsung.
- Generate **draft Nota Dinas otomatis** ketika Admin menutup rapat.
- Admin dapat mengedit draft Nota Dinas hingga status **Final**.
- **Audit log** mencatat setiap perubahan status rapat beserta aktor dan waktunya.
- Hak akses riwayat rapat hanya untuk **Admin pengelola rapat tersebut**.

### ⛔ Yang Tidak Dikerjakan di Versi Awal:
- Pengiriman undangan otomatis melalui email / WhatsApp.
- Rapat berulang (recurring meeting).
- Voting / pengambilan keputusan online dalam rapat.
- Integrasi kalender eksternal (Google Calendar, Outlook).
- Tanda tangan digital / QR Code pada nota dinas.
- Modul ganti password mandiri (menggunakan bawaan Clerk).

---

## 3. Daftar Halaman & Struktur Menu (Pages & Routing)

### A. Public Area (Halaman Publik)
| Route | Nama Halaman | Deskripsi |
| :--- | :--- | :--- |
| `/` | Beranda | Landing page sederhana yang menjelaskan fitur RapatKita, dengan tombol **Masuk** dan **Daftar**. |
| `/masuk` | Masuk | Halaman login **Email & Password** milik Clerk. |
| `/daftar` | Daftar | Halaman registrasi akun milik Clerk. |

### B. Member / User Area (Setelah Login — Khusus Pengguna yang Diundang Rapat)
| Route | Nama Halaman | Deskripsi |
| :--- | :--- | :--- |
| `/rapat` | Daftar Rapat Saya | Menampilkan daftar rapat dengan status **Open** dan **Sedang Berlangsung** yang mengundang user tersebut. Dilengkapi kolom pencarian kata dan filter tanggal. |
| `/rapat/[rapatId]` | Detail Rapat | Detail rapat berisi judul, isi/agenda, waktu, lokasi/link, daftar peserta + peran, dan area unggah lampiran. |
| `/lampiran/[idLampiran]` | Unduh Lampiran | Endpoint internal untuk mengunduh lampiran dengan proteksi autentikasi dan izin akses. |

### C. Admin Area (Hanya Admin Pengelola Rapat)
| Route | Nama Halaman | Deskripsi |
| :--- | :--- | :--- |
| `/kelola` | Dashboard Admin | Ringkasan jumlah rapat aktif, rapat selesai, total peserta, dan notifikasi rapat hari ini. |
| `/kelola/rapat` | Kelola Rapat | Tabel seluruh rapat (Draft, Open, Berlangsung, Selesai). Dari sini Admin dapat melihat **riwayat rapat**. |
| `/kelola/rapat/baru` | Tambah Rapat | Form pembuatan rapat baru: judul, isi rapat, tanggal, jam, lokasi/link, dan pemilihan peserta + peran. |
| `/kelola/rapat/[rapatId]` | Detail Kelola Rapat | Halaman pengelolaan rapat dengan tab: Info, Peserta & Kehadiran, Lampiran, Nota Dinas, dan Log Aktivitas. |
| `/kelola/user` | Kelola Pengguna | Daftar pengguna aplikasi, atur peran global Admin/User, dan nonaktifkan pengguna. |
| `/kelola/nota/[notaId]` | Edit Nota Dinas | Halaman untuk mengedit draft nota dinas dan memfinalkannya. |

---

## 4. Pedoman UI/UX & Design System

Seluruh halaman wajib mengikuti **Standard Eduwebmu Design** berikut agar tampilan konsisten, modern, dan responsif.

### 🎨 Skema Warna
| Token | Warna HSL | Penggunaan |
| :--- | :--- | :--- |
| `primary` | `HSL(222, 89%, 55%)` | Tombol utama, link aktif, aksen biru. |
| `primary-foreground` | `HSL(0, 0%, 100%)` | Teks di atas tombol primary. |
| `secondary` | `HSL(214, 95%, 93%)` | Background tombol sekunder / badge lembut. |
| `background` | `HSL(0, 0%, 100%)` | Latar utama halaman. |
| `muted` | `HSL(210, 40%, 96%)` | Latar area tabel, sidebar, section netral. |
| `card` | `HSL(0, 0%, 100%)` | Kartu konten. |
| `success` | `HSL(142, 71%, 45%)` | Status **Selesai** / sukses. |
| `warning` | `HSL(38, 92%, 50%)` | Status **Berlangsung** / perhatian. |
| `info` | `HSL(222, 89%, 55%)` | Status **Open** / informasi. |
| `destructive` | `HSL(0, 84%, 60%)` | Tombol hapus / status bahaya. |
| `border` | `HSL(214, 32%, 91%)` | Garis tepi kartu dan tabel. |

> Tips implementasi: definisikan semua token sebagai **CSS Variables** pada file `app/globals.css`, lalu panggil melalui fungsi warna Tailwind `hsl(var(--primary))`.

### 🔤 Tipografi
- **Heading / Judul**: Gunakan font **Plus Jakarta Sans** dengan variasi `sans-serif`, bold `700`/`800`.
- **Body / Teks Umum**: Gunakan font **Inter**, regular `400`, medium `500`, semibold `600`.
- **Ukuran Heading**: `text-3xl` untuk judul halaman, `text-xl` untuk judul kartu.
- **Ukuran Body**: `text-sm`/`text-base` untuk konten utama.
- **Mono**: Opsional gunakan **JetBrains Mono** untuk nomor agenda / kode.

### 🧩 Aturan Komponen
- **Kartu**: Menggunakan `Card`, `CardHeader`, `CardTitle`, `CardContent` dari **shadcn/ui**.
- **Sudut membulat**: `rounded-xl` pada kartu, `rounded-lg` pada input/tombol.
- **Shadow**: `shadow-sm` untuk kartu biasa, berubah menjadi `shadow-md` saat `hover`.
- **Tombol Utama**: Variasi `default` / `secondary` / `outline` / `ghost` / `destructive`.
- **Badge Status**: Menggunakan badge bulat kecil (`rounded-full`) dengan warna sesuai status.
- **Tabel**: Menggunakan `Table` shadcn/ui, `text-sm`, `whitespace-nowrap` pada kolom aksi.
- **Form**: `Input`, `Textarea`, `Select`, `Calendar` (date picker) dari shadcn/ui.
- **Ikon**: Gunakan **Lucide Icons** (`CalendarDays`, `Users`, `FileUp`, `Clock`, `CheckCircle2`, dll).

### 🖥️ Nuansa & Vibe
- **Clean & Modern**: Banyak *whitespace*, tidak terlalu ramai.
- **Interaktif**: Micro-animation pada tombol, badge status berdenyut halus saat rapat **Sedang Berlangsung**.
- **Profesional**: Gaya visual cocok untuk perkantoran/instansi pemerintahan.
- **Responsif sempurna**: Semua tabel berubah menjadi kartu pada layar kecil, sidebar berubah menjadi drawer.

---

## 5. Pembagian Hak Akses Pengguna

| Menu / Halaman | Publik (Tanpa Login) | Pengguna Terdaftar / Diundang | Admin Pengelola Rapat |
| :--- | :---: | :---: | :---: |
| Halaman Beranda `/` | ✅ | ✅ | ✅ |
| Halaman Daftar Rapat `/rapat` | ❌ | ✅ *(hanya rapat status Open & Berlangsung yang mengundangnya)* | ✅ |
| Detail Rapat `/rapat/[rapatId]` | ❌ | ✅ *(jika diundang & status Open/Berlangsung)* | ✅ *(jika admin pengelola rapat tsb)* |
| Upload Lampiran | ❌ | ✅ *(saat status Open/Berlangsung)* | ✅ |
| Pencatatan Kehadiran | ❌ | ❌ | ✅ |
| Kelola Rapat `/kelola/rapat` | ❌ | ❌ | ✅ |
| Lihat Riwayat Rapat Selesai | ❌ | ❌ | ✅ *(khusus rapat yang dikelolanya)* |
| Edit & Finalisasi Nota Dinas | ❌ | ❌ | ✅ |
| Kelola Pengguna `/kelola/user` | ❌ | ❌ | ✅ *(khusus admin utama)* |
| Audit Log Perubahan Status | ❌ | ❌ | ✅ |

> Catatan: Peran **Pimpinan Rapat**, **Moderator**, **Operator Rapat**, dan **Peserta** adalah peran di dalam rapat. Peran ini menentukan label peserta, tetapi untuk hak akses teknis aplikasi, yang membedakan adalah **Admin Pengelola Rapat** dan **Pengguna Biasa**.

---

## 6. Alur Kerja dan Fitur Utama

### A. Manajemen Akun & Pengguna

- **Cara Kerja**:
  1. Pengguna mendaftar menggunakan **Email & Password** melalui Clerk.
  2. Akun baru otomatis memiliki peran global **User** biasa.
  3. Admin dapat mengubah peran User menjadi **Admin** dari halaman `/kelola/user`.
  4. Admin juga dapat mengisi data profil seperti nama lengkap dan jabatan.

- **Aturan Sistem**:
  - Email harus unik dan valid.
  - Data user disinkronisasi dari Clerk ke tabel `users` menggunakan **Clerk Webhook**.
  - Minimal ada satu Admin utama yang tidak dapat dihapus.

---

### B. Admin Membuat Rencana Rapat

- **Cara Kerja**:
  1. Admin membuka halaman `/kelola/rapat/baru`.
  2. Admin mengisi:
     - Judul rapat.
     - Isi/agenda rapat.
     - Tanggal dan jam mulai-selesai.
     - Tempat rapat fisik **atau** tautan rapat online.
     - Memilih daftar user yang diundang dari daftar pengguna aplikasi.
  3. Untuk setiap user yang dipilih, Admin menentukan perannya:
     - **Pimpinan Rapat**
     - **Moderator**
     - **Operator Rapat**
     - **Peserta**
  4. Klik **Simpan Draft**.
  5. Status rapat saat ini adalah `DRAFT`. Setelah yakin, Admin klik **Publikasikan** → status menjadi `OPEN`.

- **Aturan Sistem**:
  - Rapat minimal memiliki 1 peserta.
  - Jam selesai harus lebih lambat dari jam mulai.
  - Setiap user hanya boleh dipilih satu peran dalam rapat yang sama.
  - Saat status sudah `OPEN`, data jadwal dan peserta **tidak dapat diubah** untuk menjaga integritas undangan.
  - Perubahan status `DRAFT → OPEN` wajib dicatat di audit log.

---

### C. User yang Diundang Melihat & Mengupload File

- **Cara Kerja**:
  1. User diundang login lalu melihat daftar rapat di `/rapat`.
  2. Daftar hanya menampilkan rapat yang mengundang user tersebut dengan status **Open** atau **Sedang Berlangsung**.
  3. User menekan tombol **Detail** pada salah satu rapat.
  4. Halaman detail menampilkan:
     - Judul dan isi/agenda rapat.
     - Waktu dan lokasi / tautan rapat.
     - Daftar peserta yang diundang beserta badge perannya.
  5. User dapat mengunggah file pendukung melalui area **Upload Lampiran**.

- **Aturan Sistem**:
  - File yang diizinkan:
    - Dokumen: `PDF`, `DOC`, `DOCX`, `XLS`, `XLSX`, `PPT`, `PPTX`.
    - Gambar: `JPG`, `JPEG`, `PNG`, `WEBP`.
    - Video: `MP4`, `MOV`, `WEBM`.
  - Batas ukuran:
    - Dokumen: maksimal **25 MB**.
    - Gambar: maksimal **10 MB**.
    - Video: maksimal **500 MB**.
  - Jika rapat sudah berstatus **Selesai**, pengguna non-admin tidak dapat mengakses halaman detail maupun mengunduh lampiran.

---

### D. Perubahan Status Rapat

Rapat memiliki 4 status:

| Status Internal | Label di UI | Warna Badge |
| :--- | :--- | :--- |
| `DRAFT` | Draf | Slate |
| `OPEN` | Open / Dibuka | Blue |
| `ONGOING` | Sedang Berlangsung | Amber |
| `COMPLETED` | Selesai | Emerald |

- **Cara Kerja**:
  1. **DRAFT → OPEN**: Admin menekan tombol **Publikasikan Rapat**.
  2. **OPEN → ONGOING**: Dijalankan otomatis oleh sistem ketika waktu `waktuMulai` sudah terlewati dan status masih `OPEN`. Sistem akan memperbarui status di database dan mencatat audit log.
  3. **ONGOING → COMPLETED**: Admin menekan tombol **Akhiri Rapat & Generate Nota Dinas**.
  4. Saat halaman daftar/detail rapat diakses, sistem memanggil fungsi `updateStatusIfTimeReached()` untuk memastikan rapat yang waktunya sudah tiba otomatis berstatus `ONGOING`.

- **Aturan Sistem**:
  - Setiap perubahan status **wajib** dicatat ke tabel `meeting_audit_logs`.
  - Hanya Admin pengelola rapat yang dapat menutup rapat.
  - Rapat yang sudah `COMPLETED` tidak dapat dikembalikan ke status `OPEN` / `ONGOING`.

---

### E. Pencatatan Kehadiran Saat Rapat Berlangsung

- **Cara Kerja**:
  1. Admin membuka halaman kelola rapat pada tab **Peserta & Kehadiran**.
  2. Jika status rapat `ONGOING`, form kehadiran aktif.
  3. Admin menandai setiap peserta sebagai:
     - ✅ Hadir
     - ❌ Tidak Hadir
     - 🕓 Izin / Terlambat *(opsional)*
  4. Klik **Simpan Kehadiran**.

- **Aturan Sistem**:
  - Kehadiran hanya dapat diisi oleh **Admin pengelola rapat**.
  - Kehadiran hanya dapat diisi ketika status rapat `ONGOING`.
  - Data kehadiran tersimpan pada tabel `meeting_attendees` ber-relation ke user dan rapat.

---

### F. Penutupan Rapat & Generate Otomatis Nota Dinas

- **Cara Kerja**:
  1. Saat rapat selesai, Admin mengisi ringkasan hasil rapat pada field **Hasil Rapat / Risalah** di halaman kelola rapat.
  2. Admin menekan tombol **Akhiri Rapat & Buat Draft Nota Dinas**.
  3. Sistem melakukan transaksi database:
     - Mengubah status rapat dari `ONGOING` menjadi `COMPLETED`.
     - Membuat catatan audit log.
     - Membuat **draft nota dinas** baru di tabel `office_notes`.
  4. Isi draft nota dinas dibuat otomatis dari:
     - Nomor urut nota dinas.
     - Judul rapat.
     - Tanggal rapat.
     - Daftar hadir yang sudah dicatat.
     - Ringkasan hasil rapat dari input Admin.
  5. Admin membuka halaman `/kelola/nota/[notaId]` untuk mengedit dan menyempurnakan isi nota dinas.
  6. Jika sudah selesai, Admin menekan **Terbitkan Final**.
  7. Nota dinas terkunci dan dapat dicetak / diarsipkan.

- **Aturan Sistem**:
  - Setiap rapat hanya memiliki **satu nota dinas final**.
  - Nomor nota dinas dibuat otomatis dengan format:
    - `ND/{no}/RAPATKITA/{BULAN_ROMawi}/{TAHUN}`
    - Contoh: `ND/005/RAPATKITA/III/2025`
  - Saat status nota dinas masih `DRAFT`, Admin dapat mengedit.
  - Setelah **Final**, isi nota dinas tidak dapat diubah kembali.
  - Generate draft nota dinas **tidak akan berhasil** jika belum ada ringkasan hasil rapat minimal 10 karakter.
  - Jika peserta tidak memiliki data kehadiran, sistem tetap membuat daftar hadir dengan keterangan `-`.

---

### G. Riwayat Rapat & Audit Log

- **Cara Kerja**:
  1. Admin membuka halaman `/kelola/rapat`.
  2. Admin dapat memilih filter status **Selesai** untuk melihat riwayat rapat yang sudah ditutup.
  3. Halaman riwayat hanya menampilkan rapat yang dibuat/dikelola oleh Admin yang sedang login.
  4. Admin dapat membuka detail rapat dan melihat seluruh lampiran tanpa dibatasi waktu.
  5. Tab **Log Aktivitas** menampilkan seluruh perubahan status:
     - Siapa yang mengubah.
     - Dari status apa ke status apa.
     - Kapan perubahan terjadi.

- **Aturan Sistem**:
  - User biasa **tidak dapat** mengakses riwayat rapat setelah rapat selesai.
  - Admin **tidak dapat** melihat riwayat rapat milik Admin lain.
  - Audit log bersifat `append-only`; tidak ada fitur hapus/edit log.

---

## 7. Alur Navigasi & Arsitektur Layout

### Arsitektur Layout Persisten

- **Public Layout**:  
  - `Header` berisi logo RapatKita di kiri dan tombol **Masuk** di kanan.
  - `Footer` berisi copyright dan kontak.
  - Berlaku untuk halaman `/`, `/masuk`, `/daftar`.

- **App Layout (User)**:  
  - `Sidebar` di kiri: menu **Rapat Saya**, **Profil**, **Keluar**.
  - `Header` atas berisi avatar user dan menu dropdown.
  - Berlaku untuk `/rapat` dan `/rapat/[rapatId]`.

- **Dashboard Layout (Admin)**:  
  - `Sidebar` di kiri dengan menu:
    - Dashboard
    - Kelola Rapat
    - Riwayat Selesai *(bisa berupa filter status di halaman kelola rapat)*
    - Kelola Pengguna
    - Nota Dinas
  - Sidebar menyusut menjadi *drawer* di layar mobile.

### Bagan Alur Utama Aplikasi

```mermaid
flowchart TD
    A[Pengunjung] --> B[Halaman Beranda]
    B --> C[Login / Daftar]
    C --> D{Global Role?}
    
    D -- User --> E[Daftar Rapat Saya]
    D -- Admin --> F[Dashboard Admin]

    E --> G[Detail Rapat /rapat/id]
    G --> H[Upload Lampiran]
    G --> I[Lihat Peserta & Peran]

    F --> J[Kelola Rapat]
    J --> K[Tambah Rapat Baru]
    J --> L[Detail Kelola Rapat]
    L --> M[Publikasikan -> OPEN]
    M --> N[Otomatis -> Sedang Berlangsung]
    N --> O[Catat Kehadiran]
    O --> P[Akhiri & Generate Nota Dinas]
    P --> Q[Draft Nota Dinas]
    Q --> R[Edit Draft]
    R --> S[Final]
    S --> T[Riwayat Selesai]
```

### Bagan State Machine Status Rapat

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Admin membuat rapat
    DRAFT --> OPEN : Admin publikasikan
    OPEN --> ONGOING : Waktu mulai tiba
    ONGOING --> COMPLETED : Admin tutup rapat
    COMPLETED --> [*]
```

---

## 8. Kebutuhan Non-Fungsional (SEO, Keamanan, & Performa)

### 🔍 SEO
- Halaman publik (`/`, `/masuk`, `/daftar`) wajib memiliki `<title>`, meta description, dan Open Graph tag.
- Halaman internal menggunakan meta robots `noindex` agar tidak terindeks Google.
- Judul halaman dinamis mengikuti data rapat, contoh: `Rapat Evaluasi Kinerja — RapatKita`.

### 🔐 Keamanan
- Autentikasi dilakukan oleh **Clerk** dengan proteksi bawaan terhadap brute force.
- Semua route di bawah `/rapat`, `/kelola`, dan API lampiran dilindungi middleware.
- Validasi izin dilakukan di sisi server, bukan hanya client.
- Saat upload file, wajib memeriksa **MIME type** dan **ekstensi file**.
- Nama file disimpan ulang menggunakan UUID agar tidak ada path traversal.
- Input dari form divalidasi menggunakan **Zod** dan di-sanitasi untuk mencegah XSS.
- Seluruh Server Actions menggunakan proteksi CSRF bawaan Next.js.
- Lampiran rapat hanya dapat diunduh melalui endpoint ber-izinkan, bukan akses publik langsung ke CDN.

### ⚡ Performa
- Daftar rapat menggunakan **pagination** (10 data per halaman).
- Gunakan **optimistic update** untuk aksi upload dan perubahan status.
- Optimasi gambar dengan komponen `<Image>` Next.js.
- Data rapat `OPEN` yang sering diakses publik boleh di-cache pendek (`revalidate = 60`). 
- Video melalui **Bunny Stream** agar tidak membebani server aplikasi.
- Lazy load komponen berat seperti text editor nota dinas.

---

## 9. Panduan Bahasa, Copywriting, & Data Dummy

### Gaya Bahasa
- **Formal namun hangat**: Menggunakan sapaan "Anda" dan "Kami".
- Singkat, padat, tidak bertele-tele.
- Istilah teknis yang muncul tetap dalam Bahasa Indonesia, kecuali nama teknis seperti *Dashboard*, *Upload*, *Status*.

### Format Notifikasi / Label
- Tombol: **Publikasikan**, **Akhiri Rapat**, **Simpan Kehadiran**, **Terbitkan Final**.
- Status: `Draf`, `Open`, `Sedang Berlangsung`, `Selesai`.
- Empty state: *"Belum ada rapat. Silakan hubungi admin untuk diundang rapat."*

### 📁 Instruksi Data Dummy

> **DILARANG KERAS menggunakan "Lorem Ipsum".**  
> Seluruh data dummy wajib berbahasa Indonesia dan relevan dengan dunia perkantoran/instansi.

Beberapa contoh data dummy yang dapat dipakai:

**Data User**
| Nama | Email | Jabatan | Peran Global |
| :--- | :--- | :--- | :--- |
| Ir. Dewi Lestari, M.M. | dewi.lestari@kantor.id | Kepala Bagian Umum | Admin |
| Rendra Pratama | rendra.pratama@kantor.id | Staff Perencanaan | User |
| Salsabila Zahra | salsabila.zahra@kantor.id | Staff Keuangan | User |
| Hendra Wijaya | hendra.wijaya@kantor.id | Sekretaris | User |
| Maya Kurnia | maya.kurnia@kantor.id | Operator IT | User |

**Contoh Rapat**
- Judul: `Rapat Evaluasi Kinerja Triwulan I 2025`
- Isi/Agenda:
  ```
  1. Pembukaan oleh pimpinan rapat;
  2. Evaluasi capaian program kerja Januari - Maret 2025;
  3. Pembahasan kendala lapangan;
  4. Penetapan target Triwulan II 2025.
  ```
- Lokasi: `Ruang Rapat Utama Lt. 2` atau link meet.
- Peserta:
  - Dewi Lestari → **Pimpinan Rapat**
  - Rendra Pratama → **Peserta**
  - Salsabila Zahra → **Peserta**
  - Hendra Wijaya → **Moderator**
  - Maya Kurnia → **Operator Rapat**

**Contoh Nota Dinas Draft Otomatis**

> **NOTA DINAS**  
> Nomor: ND/001/RAPATKITA/III/2025  
> Perihal: Rapat Evaluasi Kinerja Triwulan I 2025  
>  
> Sehubungan dengan akan dilaksanakannya ...  
>  
> Daftar Hadir:  
> 1. Ir. Dewi Lestari, M.M. — Hadir  
> 2. Rendra Pratama — Hadir  
>  
> Hasil Rapat:  
> 1. Disepakati bahwa capaian program kerja Triwulan I mencapai 85%.  
> 2. ...  
>  
> Demikian nota dinas ini dibuat untuk dipergunakan sebagaimana mestinya.

---

## 10. Fondasi Teknis (Untuk Tim Pengembang / Programmer & AI)

### 🧱 Tech Stack
| Kebutuhan | Teknologi |
| :--- | :--- |
| **Framework** | Next.js 15 — App Router |
| **Bahasa** | TypeScript |
| **UI Library** | Tailwind CSS + shadcn/ui |
| **Ikon** | Lucide React |
| **Autentikasi** | Clerk (Email & Password) |
| **Database** | Neon PostgreSQL |
| **ORM** | Drizzle ORM |
| **Storage & CDN** | Bunny Storage + Bunny Stream |
| **Validasi** | Zod + React Hook Form |
| **Text Editor** | TipTap (untuk edit nota dinas) |
| **Deployment** | Vercel / VPS dengan Docker |

### 🗄️ Struktur Skema Database (Drizzle ORM)

```typescript
// app/db/schema.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  integer,
  boolean,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/* ---------------------------------------------
   Tabel Pengguna / User
   Disinkronkan dari Clerk melalui Webhook
--------------------------------------------- */
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(), // Clerk User ID
    email: text("email").notNull().unique(),
    nama: text("nama").notNull(),
    jabatan: text("jabatan"),
    globalRole: text("global_role", {
      enum: ["ADMIN", "USER"],
    })
      .notNull()
      .default("USER"),
    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("users_email_idx").on(table.email)]
);

/* ---------------------------------------------
   Tabel Rapat / Meeting
--------------------------------------------- */
export const meetings = pgTable(
  "meetings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    judul: text("judul").notNull(),
    deskripsi: text("deskripsi").notNull(), // Isi / agenda rapat
    tempat: text("tempat"), // Ruangan fisik
    linkRapat: text("link_rapat"), // Link online meeting
    tanggal: date("tanggal").notNull(),
    waktuMulai: timestamp("waktu_mulai").notNull(),
    waktuSelesai: timestamp("waktu_selesai").notNull(),
    status: text("status", {
      enum: ["DRAFT", "OPEN", "ONGOING", "COMPLETED"],
    })
      .notNull()
      .default("DRAFT"),
    ringkasanHasil: text("ringkasan_hasil"), // Risalah / hasil rapat
    createdById: text("created_by_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("meetings_tanggal_idx").on(table.tanggal),
    index("meetings_status_idx").on(table.status),
    index("meetings_judul_search_idx").on(table.judul),
  ]
);

/* ---------------------------------------------
   Tabel Peserta Rapat + Peran + Kehadiran
--------------------------------------------- */
export const meetingAttendees = pgTable(
  "meeting_attendees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    peran: text("peran", {
      enum: ["PIMPINAN_RAPAT", "MODERATOR", "OPERATOR", "PESERTA"],
    })
      .notNull()
      .default("PESERTA"),
    kehadiran: text("kehadiran", {
      enum: ["HADIR", "TIDAK_HADIR", "IZIN"],
    }), // Null = belum dicatat
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueAttendee: uniqueIndex("meeting_attendee_unique").on(
      table.meetingId,
      table.userId
    ),
  })
);

/* ---------------------------------------------
   Tabel Lampiran Rapat
--------------------------------------------- */
export const meetingAttachments = pgTable(
  "meeting_attachments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    uploadedById: text("uploaded_by_id")
      .notNull()
      .references(() => users.id),
    namaFileAsli: text("nama_file_asli").notNull(),
    urlBerkas: text("url_berkas"),
    videoIdBunny: text("video_id_bunny"), // Jika video diunggah ke Bunny Stream
    storageType: text("storage_type", {
      enum: ["BUNNY_STORAGE", "BUNNY_STREAM"],
    })
      .notNull()
      .default("BUNNY_STORAGE"),
    mimeType: text("mime_type").notNull(),
    ukuranByte: integer("ukuran_byte").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("attachment_meeting_idx").on(table.meetingId)]
);

/* ---------------------------------------------
   Tabel Audit Log Perubahan Status Rapat
--------------------------------------------- */
export const meetingAuditLogs = pgTable(
  "meeting_audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    actorId: text("actor_id")
      .notNull()
      .references(() => users.id),
    aksi: text("aksi").notNull(), // Contoh: "PUBLIKASI", "MULAI_OTOMATIS", "PENUTUPAN"
    statusLama: text("status_lama").notNull(),
    statusBaru: text("status_baru").notNull(),
    deskripsi: text("deskripsi"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("audit_log_meeting_idx").on(table.meetingId)]
);

/* ---------------------------------------------
   Tabel Nota Dinas
--------------------------------------------- */
export const officeNotes = pgTable(
  "office_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    meetingId: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" })
      .unique(),
    nomorSurat: text("nomor_surat").notNull(),
    perihal: text("perihal").notNull(),
    isiDraft: text("isi_draft").notNull(), // Draft yang bisa diedit admin
    isiFinal: text("isi_final"), // Isi final terkunci
    status: text("status", {
      enum: ["DRAFT", "FINAL"],
    })
      .notNull()
      .default("DRAFT"),
    createdById: text("created_by_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("office_notes_meeting_idx").on(table.meetingId)]
);
```

### 🔌 Alur Upload File & Bunny

- **Dokumen & Gambar**
  1. Client meminta *signed URL* / langsung upload ke **Bunny Storage** melalui Server Action.
  2. File disimpan di folder: `rapat/{meetingId}/{uuid}/{nama-file}`.
  3. Metadata disimpan ke tabel `meeting_attachments`.
  4. URL akses tidak diarahkan langsung ke CDN publik. Seluruh permintaan unduh melalui rute `/lampiran/[idLampiran]` yang memeriksa sesi dan izin.

- **Video**
  1. Video diunggah ke **Bunny Stream API** menggunakan `libraryId`.
  2. Sistem menerima `videoId` dari Bunny Stream.
  3. Metadata disimpan di tabel `meeting_attachments` dengan `storageType = BUNNY_STREAM`.
  4. Pemutaran video menggunakan `<iframe>` / player dari Bunny Stream.

### 🔐 Variabel Lingkungan (`.env.example`)

```env
# --- Next.js ---
NEXT_PUBLIC_APP_URL=http://localhost:3000

# --- Clerk Auth ---
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/masuk
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/daftar
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/rapat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/rapat
CLERK_WEBHOOK_SECRET=

# --- Database (Neon PostgreSQL) ---
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# --- Bunny Storage (dokumen/gambar) ---
BUNNY_STORAGE_ZONE_NAME=
BUNNY_STORAGE_API_KEY=
BUNNY_STORAGE_ENDPOINT=ny.storage.bunnycdn.com
NEXT_PUBLIC_BUNNY_CDN_PULL_ZONE=https://your-pull-zone.b-cdn.net

# --- Bunny Stream (video) ---
BUNNY_STREAM_API_KEY=
BUNNY_STREAM_LIBRARY_ID=
BUNNY_STREAM_HOST=video.bunnycdn.com
BUNNY_STREAM_PULL_ZONE=https://iframe.mediadelivery.net
```

---

## 11. Tahapan Pengerjaan & Task Breakdown (Actionable Work Breakdown Structure)

> Mode Eksekusi: **PHASE** — Setiap Fase dikerjakan tuntas dalam satu putaran, lalu berhenti dan menunggu konfirmasi user sebelum lanjut ke Fase berikutnya.

---

### Tahap 1: Fondasi Proyek, UI/UX & Seluruh Halaman (Dummy Data)

*Tujuan: Membangun seluruh tampilan RapatKita lengkap dan responsif menggunakan data dummy, tanpa perlu menunggu backend.*

- [ ] **Task 1.1 (Foundations & Design System)**:  
  Setup project Next.js 15 App Router + TypeScript, Tailwind CSS, install shadcn/ui, Lucide, dan font **Plus Jakarta Sans** + **Inter**. Definisikan CSS variables warna sesuai Bab 4.

- [ ] **Task 1.2 (Base UI Components & Icon Set)**:  
  Install dan konfigurasi komponen dasar: `Button`, `Card`, `Input`, `Textarea`, `Select`, `Badge`, `Table`, `Dialog`, `Tabs`, `Calendar`, `Dropdown Menu`, `Avatar`, `Toast`.

- [ ] **Task 1.3 (Mock Data Library)**:  
  Buat data dummy di folder `lib/mock-data.ts` berisi contoh user, meeting, peserta, lampiran, audit log, dan nota dinas — **WAJIB bahasa Indonesia** sesuai Bab 9.

- [ ] **Task 1.4 (Public Layout & Auth Pages)**:  
  Buat route `/` (Beranda), `/masuk`, `/daftar`. Halaman masukkan/daftar boleh berupa placeholder visual yang nanti diganti Clerk, namun **dilarang kosong**.

- [ ] **Task 1.5 (App Layout + Sidebar)**:  
  Buat `RootLayout`, lalu layout area login dengan sidebar responsif berisi menu **Rapat Saya**, **Dashboard Admin** (jika role admin), dan **Keluar**.

- [ ] **Task 1.6 (Halaman Daftar Rapat `/rapat`)**:  
  Bangun halaman daftar rapat yang berisi kartu rapat, **search bar** pencarian judul, **filter rentang tanggal**, **filter status**, dan tombol **Detail**. Gunakan data dummy.

- [ ] **Task 1.7 (Halaman Detail Rapat `/rapat/[rapatId]`)**:  
  Bangun halaman detail untuk user: header judul, info waktu/tempat, isi agenda, daftar peserta dengan badge peran, area upload lampiran, dan list file lampiran.

- [ ] **Task 1.8 (Halaman Admin Dashboard `/kelola`)**:  
  Bangun dashboard admin dengan kartu statistik: jumlah rapat open, berlangsung, selesai, total peserta, dan daftar rapat hari ini.

- [ ] **Task 1.9 (Halaman Kelola Rapat `/kelola/rapat`)**:  
  Bangun tabel seluruh rapat + filter status + tab **Riwayat Selesai** (hanya untuk admin pengelola).

- [ ] **Task 1.10 (Form Tambah Rapat `/kelola/rapat/baru`)**:  
  Bangun form multi-bagian:
  - Bagian 1: Informasi rapat (judul, deskripsi, waktu, lokasi/link rapat).
  - Bagian 2: Pilih user + pilih peran (`Pimpinan Rapat`, `Moderator`, `Operator Rapat`, `Peserta`).
  - Bagian 3: Tombol **Simpan Draft** dan **Publikasikan**.

- [ ] **Task 1.11 (Halaman Detail Kelola Rapat `/kelola/rapat/[rapatId]`)**:  
  Bangun halaman dengan tabs:
  - `Info`
  - `Peserta & Kehadiran`
  - `Lampiran`
  - `Nota Dinas`
  - `Log Aktivitas`  
  Sertakan tombol aksi perubahan status (Publikasikan / Akhiri Rapat).

- [ ] **Task 1.12 (Halaman Edit Nota Dinas `/kelola/nota/[notaId]`)**:  
  Bangun halaman editor nota dinas dengan preview terformat, tombol **Simpan Draft** dan **Terbitkan Final**.

- [ ] **Task 1.13 (Halaman Kelola Pengguna `/kelola/user`)**:  
  Bangun tabel daftar user, kolom nama/email/jabatan/peran global, tombol ubah peran Admin/User, serta status aktif/nonaktif.

---

### Tahap 2: Database, Autentikasi, Backend & Integrasi Data Dinamis

*Tujuan: Menghidupkan RapatKita dengan database PostgreSQL, autentikasi Clerk, dan seluruh operasi backend.*

- [ ] **Task 2.1 (Buat Database Schema & Migrations)**:  
  Salin skema `schema.ts` dari Bab 10 ke project. Sesuaikan konfigurasi Drizzle, create database di Neon, dan jalankan migrasi pertama.

- [ ] **Task 2.2 (Buat Seed Data Awal)**:  
  Buat script `seed.ts` untuk mengisi data user dummy dan satu rapat contoh berstatus `OPEN` dengan peserta beserta perannya.

- [ ] **Task 2.3 (Integrasi Clerk Authentication)**:  
  Setup Clerk Provider, halaman `/masuk`, `/daftar`, environment variables, serta middleware untuk proteksi route `/rapat` dan `/kelola`.

- [ ] **Task 2.4 (Clerk Webhook Sinkronisasi User)**:  
  Buat route `/api/webhooks/clerk` yang otomatis membuat data user di tabel `users` saat user baru mendaftar di Clerk.

- [ ] **Task 2.5 (Server Actions - Manajemen Meeting)**:  
  Buat server actions:
  - `createMeeting`
  - `updateMeeting`
  - `publishMeeting`
  - `closeMeetingAndGenerateNote`

- [ ] **Task 2.6 (Server Actions - Peserta & Kehadiran)**:  
  Buat server actions untuk:
  - Menambah/mengubah peserta rapat beserta perannya.
  - Menyimpan kehadiran peserta.

- [ ] **Task 2.7 (Server Actions - Lampiran & Bunny Storage)**:  
  Buat server actions:
  - `uploadAttachment` — mendukung dokumen/gambar ke **Bunny Storage** dan video ke **Bunny Stream**.
  - `deleteAttachment`
  - Rute `/lampiran/[idLampiran]` untuk unduhan ber-izin.

- [ ] **Task 2.8 (Server Actions - Nota Dinas)**:  
  Buat server actions:
  - `saveOfficeNoteDraft`
  - `finalizeOfficeNote`
  Serta helper pembuatan nomor surat otomatis.

- [ ] **Task 2.9 (Logika Perubahan Status Otomatis)**:  
  Buat fungsi `ensureMeetingStatus()` yang mengubah `OPEN` → `ONGOING` ketika `waktuMulai` sudah lewat. Panggil fungsi ini saat mengakses halaman daftar dan detail rapat. Catat audit log.

- [ ] **Task 2.10 (Audit Log Service)**:  
  Buat helper `createAuditLog()` yang merekam semua perubahan status ke tabel `meeting_audit_logs`.

- [ ] **Task 2.11 (Dinamisasi Semua Halaman)**:  
  Ganti seluruh data dummy di Fase 1 dengan data asli dari database. Pastikan:
  - List `/rapat` hanya menampilkan user yang diundang + status `OPEN`/`ONGOING`.
  - Detail rapat user disembunyikan setelah status `COMPLETED`.
  - Admin hanya melihat riwayat rapat yang `createdById` miliknya.

---

### Tahap 3: Penyempurnaan, Keamanan, SEO, Testing & Deployment

*Tujuan: Mempersiapkan aplikasi agar siap production dan benar-benar layak digunakan.*

- [ ] **Task 3.1 (Non-Functional Requirements & SEO)**:  
  Implementasi metadata dinamis, sitemap, robots, meta noindex untuk halaman internal, serta optimalisasi gambar.

- [ ] **Task 3.2 (Hardening Keamanan)**:  
  Terapkan validasi Zod di semua Server Actions, sanitasi input, batas ukuran file, proteksi CSRF, dan pemeriksaan MIME type.

- [ ] **Task 3.3 (Error Handling & Empty State)**:  
  Pastikan semua halaman memiliki empty state dan error state yang ramah pengguna.

- [ ] **Task 3.4 (End-to-End Testing Alur Utama)**:  
  Uji alur:
  1. Admin daftar/login.
  2. Admin membuat rapat dengan peserta & peran.
  3. Admin mempublikasikan rapat.
  4. User login dan melihat rapat di `/rapat`.
  5. User upload lampiran.
  6. Waktu mulai dilewati → status berubah `ONGOING`.
  7. Admin mencatat kehadiran.
  8. Admin menutup rapat → muncul draft nota dinas.
  9. Admin mengedit dan finalisasi nota dinas.
  10. Admin melihat riwayat rapat selesai.

- [ ] **Task 3.5 (Production Build & Deployment)**:  
  Setup `.env.production`, jalankan `npm run build`, perbaiki seluruh error, lalu deploy ke Vercel / Docker VPS.

---

## 12. Master Starter Prompt (Siap Coding untuk AI Agent)

Salin prompt berikut ke AI Coding Assistant (Google Antigravity, Cursor, Claude Code, GitHub Copilot, Roo Code, dll.) untuk memulai pengerjaan:

```markdown
Halo! Kamu berperan sebagai Senior Fullstack Architect dan Lead Developer.

Saya ingin membangun aplikasi **RapatKita** — Sistem Informasi Rapat & Dokumentasi Nota Dinas,
berdasarkan dokumen PRD yang telah saya siapkan.

Silakan baca file @PRD.md secara menyeluruh sebelum mulai bekerja.

ATURAN EKSEKUSI (MODE PHASE — WAJIB DIPATUHI):

1. Pahami seluruh dokumen PRD: tech stack, skema database, design system, dan daftar task di Bab 11.
2. Eksekusi **Tahap 1 secara penuh dan tuntas dalam satu putaran kerja** tanpa berhenti di tengah-tengah.
   Tahap 1 adalah: Fondasi Proyek, UI/UX, Design System, dan seluruh halaman frontend menggunakan data dummy.
3. Selama Tahap 1, JANGAN membuat database asli, JANGAN integrasi Clerk asli, dan JANGAN membuat backend/API.
   Gunakan data dummy berbahasa Indonesia di folder `lib/mock-data.ts`.
4. Setelah Tahap 1 selesai, BERHENTI dan laporkan:
   - Ringkasan halaman apa saja yang sudah dibuat.
   - Daftar file penting yang berubah/dibuat.
   - Screenshot/deskripsi singkat hasil UI.
   Lalu TUNGGU konfirmasi saya sebelum melanjutkan ke Tahap 2.
5. Saat saya memberikan konfirmasi, lanjutkan mengerjakan Tahap 2 (Database, Clerk, Backend, Data Dinamis)
   secara tuntas dalam satu putaran kerja.
6. Terakhir, setelah konfirmasi dari saya, kerjakan Tahap 3 (Keamanan, SEO, Testing, Deployment).

ATURAN KODE:
- Patuhi Tech Stack: Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM, Neon PostgreSQL.
- Patuhi Pedoman UI/UX Design System pada Bab 4 PRD.
- JANGAN gunakan "Lorem Ipsum".
- JANGAN membuat halaman placeholder kosong.
- Gunakan Bahasa Indonesia untuk seluruh teks yang tampil di antarmuka.

Jika kamu sudah memahami dan siap mengeksekusi, berikan ringkasan singkat pemahamanmu
tentang aplikasi RapatKita, lalu segera mulai kerjakan seluruh Task di Tahap 1.
```

---

**📞 Catatan Akhir**  
Dokumen PRD ini adalah sumber kebenaran tunggal (*single source of truth*) selama proses pengembangan.  
Setiap keputusan teknis, desain antarmuka, maupun alur bisnis harus merujuk pada dokumen ini agar hasil akhir **RapatKita** benar-benar sesuai kebutuhan dan siap dipakai baik oleh admin maupun peserta rapat.

**Selamat membangun RapatKita! 🚀**