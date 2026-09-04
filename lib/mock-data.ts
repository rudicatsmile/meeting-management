export type GlobalRole = "ADMIN" | "USER";

export type MeetingStatus = "DRAFT" | "OPEN" | "ONGOING" | "COMPLETED";

export type AttendeeRole =
  | "PIMPINAN_RAPAT"
  | "MODERATOR"
  | "OPERATOR"
  | "PESERTA";

export type AttendanceStatus = "HADIR" | "TIDAK_HADIR" | "IZIN" | null;

export interface User {
  id: string;
  nama: string;
  email: string;
  jabatan: string;
  globalRole: GlobalRole;
  avatarUrl?: string;
  initials: string;
  isActive: boolean;
}

export interface MeetingAttendee {
  id: string;
  meetingId: string;
  userId: string;
  peran: AttendeeRole;
  kehadiran: AttendanceStatus;
  user?: User;
}

export interface MeetingAttachment {
  id: string;
  meetingId: string;
  uploadedById: string;
  uploadedByName: string;
  namaFileAsli: string;
  urlBerkas: string;
  mimeType: string;
  ukuranByte: number;
  createdAt: string;
  storageType: "BUNNY_STORAGE" | "BUNNY_STREAM";
  videoIdBunny?: string;
}

export interface MeetingAuditLog {
  id: string;
  meetingId: string;
  actorId: string;
  actorName: string;
  aksi: string;
  statusLama: string;
  statusBaru: string;
  deskripsi?: string;
  createdAt: string;
}

export interface OfficeNote {
  id: string;
  meetingId: string;
  nomorSurat: string;
  perihal: string;
  isiDraft: string;
  isiFinal?: string;
  status: "DRAFT" | "FINAL";
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  judul: string;
  deskripsi: string;
  tempat?: string;
  linkRapat?: string;
  tanggal: string; // YYYY-MM-DD
  waktuMulai: string; // ISO string
  waktuSelesai: string; // ISO string
  status: MeetingStatus;
  ringkasanHasil?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  attendees: MeetingAttendee[];
  attachments: MeetingAttachment[];
  auditLogs: MeetingAuditLog[];
  officeNote?: OfficeNote;
}

export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    nama: "Dra. Hj. Dewi Lestari, M.Pd.",
    email: "dewi.lestari@asshodriyah9.sch.id",
    jabatan: "Ketua Dewan Pengurus Yayasan",
    globalRole: "ADMIN",
    initials: "DL",
    isActive: true,
  },
  {
    id: "user-2",
    nama: "H. Rendra Pratama, S.Kom.",
    email: "rendra.pratama@asshodriyah9.sch.id",
    jabatan: "Kepala Biro IT & Sistem Informasi",
    globalRole: "USER",
    initials: "RP",
    isActive: true,
  },
  {
    id: "user-3",
    nama: "Salsabila Zahra, S.E.",
    email: "salsabila.zahra@asshodriyah9.sch.id",
    jabatan: "Bendahara Umum Yayasan",
    globalRole: "USER",
    initials: "SZ",
    isActive: true,
  },
  {
    id: "user-4",
    nama: "Hendra Wijaya, S.Pd.",
    email: "hendra.wijaya@asshodriyah9.sch.id",
    jabatan: "Kepala Satuan Pendidikan Formal",
    globalRole: "USER",
    initials: "HW",
    isActive: true,
  },
  {
    id: "user-5",
    nama: "Maya Kurniawati, S.Ag.",
    email: "maya.kurnia@asshodriyah9.sch.id",
    jabatan: "Sekretariat & Tata Usaha Yayasan",
    globalRole: "USER",
    initials: "MK",
    isActive: true,
  },
  {
    id: "user-6",
    nama: "Ahmad Fauzi, M.Pd.",
    email: "ahmad.fauzi@asshodriyah9.sch.id",
    jabatan: "Wakil Kepala Bidang Kurikulum & Pesantren",
    globalRole: "USER",
    initials: "AF",
    isActive: true,
  },
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "meet-1",
    judul: "Rapat Koordinasi Persiapan Tahun Ajaran Baru 2025/2026",
    deskripsi:
      "Agenda Rapat Pembahasan:\n1. Pemaparan dan penetapan kalender akademik yayasan tahun 2025/2026.\n2. Alokasi pembagian beban jam mengajar dan penetapan wali asrama/kelas.\n3. Kesiapan fasilitas laboratorium digital dan sarana pembelajaran terpadu.\n4. Sosialisasi program pembinaan karakter santri berasrama.",
    tempat: "Ruang Pertemuan Utama Lantai 2 Kampus Asshodriyah 9",
    linkRapat: "https://meet.google.com/yaw-persiapan-2025",
    tanggal: "2025-07-15",
    waktuMulai: "2025-07-15T09:00:00.000Z",
    waktuSelesai: "2025-07-15T12:00:00.000Z",
    status: "OPEN",
    createdById: "user-1",
    createdAt: "2025-07-01T08:00:00.000Z",
    updatedAt: "2025-07-01T08:30:00.000Z",
    attendees: [
      {
        id: "att-1",
        meetingId: "meet-1",
        userId: "user-1",
        peran: "PIMPINAN_RAPAT",
        kehadiran: null,
      },
      {
        id: "att-2",
        meetingId: "meet-1",
        userId: "user-4",
        peran: "MODERATOR",
        kehadiran: null,
      },
      {
        id: "att-3",
        meetingId: "meet-1",
        userId: "user-2",
        peran: "OPERATOR",
        kehadiran: null,
      },
      {
        id: "att-4",
        meetingId: "meet-1",
        userId: "user-3",
        peran: "PESERTA",
        kehadiran: null,
      },
      {
        id: "att-5",
        meetingId: "meet-1",
        userId: "user-5",
        peran: "PESERTA",
        kehadiran: null,
      },
      {
        id: "att-6",
        meetingId: "meet-1",
        userId: "user-6",
        peran: "PESERTA",
        kehadiran: null,
      },
    ],
    attachments: [
      {
        id: "attc-1",
        meetingId: "meet-1",
        uploadedById: "user-1",
        uploadedByName: "Dra. Hj. Dewi Lestari, M.Pd.",
        namaFileAsli: "Draf_Kalender_Akademik_2025_2026.pdf",
        urlBerkas: "#",
        mimeType: "application/pdf",
        ukuranByte: 2450000,
        createdAt: "2025-07-01T08:35:00.000Z",
        storageType: "BUNNY_STORAGE",
      },
      {
        id: "attc-2",
        meetingId: "meet-1",
        uploadedById: "user-2",
        uploadedByName: "H. Rendra Pratama, S.Kom.",
        namaFileAsli: "Rencana_Distribusi_Jaringan_SmartClass.docx",
        urlBerkas: "#",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ukuranByte: 1200000,
        createdAt: "2025-07-02T10:15:00.000Z",
        storageType: "BUNNY_STORAGE",
      },
    ],
    auditLogs: [
      {
        id: "log-1",
        meetingId: "meet-1",
        actorId: "user-1",
        actorName: "Dra. Hj. Dewi Lestari, M.Pd.",
        aksi: "PEMBUATAN_DRAF",
        statusLama: "DRAFT",
        statusBaru: "DRAFT",
        deskripsi: "Rapat dibuat oleh Admin Yayasan dalam status Draf",
        createdAt: "2025-07-01T08:00:00.000Z",
      },
      {
        id: "log-2",
        meetingId: "meet-1",
        actorId: "user-1",
        actorName: "Dra. Hj. Dewi Lestari, M.Pd.",
        aksi: "PUBLIKASI",
        statusLama: "DRAFT",
        statusBaru: "OPEN",
        deskripsi: "Rapat resmi dipublikasikan untuk seluruh peserta yang diundang",
        createdAt: "2025-07-01T08:30:00.000Z",
      },
    ],
  },
  {
    id: "meet-2",
    judul: "Evaluasi Anggaran Sarana & Prasarana Yayasan Triwulan I",
    deskripsi:
      "Agenda Rapat Pembahasan:\n1. Laporan realisasi belanja operasional sarana gedung triwulan I.\n2. Usulan pengadaan tambahan fasilitas pendingin ruangan kelas dan asrama putri.\n3. Audit berkala pemeliharaan genset darurat dan instalasi kelistrikan.\n4. Persetujuan reposisi pagu anggaran untuk triwulan II.",
    tempat: "Ruang Rapat Pimpinan Gedung Yayasan Lt. 1",
    linkRapat: "",
    tanggal: "2025-04-10",
    waktuMulai: "2025-04-10T08:30:00.000Z",
    waktuSelesai: "2025-04-10T11:30:00.000Z",
    status: "ONGOING",
    createdById: "user-1",
    createdAt: "2025-04-01T09:00:00.000Z",
    updatedAt: "2025-04-10T08:30:00.000Z",
    attendees: [
      {
        id: "att-21",
        meetingId: "meet-2",
        userId: "user-1",
        peran: "PIMPINAN_RAPAT",
        kehadiran: "HADIR",
      },
      {
        id: "att-22",
        meetingId: "meet-2",
        userId: "user-3",
        peran: "MODERATOR",
        kehadiran: "HADIR",
      },
      {
        id: "att-23",
        meetingId: "meet-2",
        userId: "user-2",
        peran: "OPERATOR",
        kehadiran: "HADIR",
      },
      {
        id: "att-24",
        meetingId: "meet-2",
        userId: "user-4",
        peran: "PESERTA",
        kehadiran: "IZIN",
      },
      {
        id: "att-25",
        meetingId: "meet-2",
        userId: "user-5",
        peran: "PESERTA",
        kehadiran: "HADIR",
      },
    ],
    attachments: [
      {
        id: "attc-21",
        meetingId: "meet-2",
        uploadedById: "user-3",
        uploadedByName: "Salsabila Zahra, S.E.",
        namaFileAsli: "Laporan_Keuangan_Sarpras_TW1_2025.xlsx",
        urlBerkas: "#",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ukuranByte: 980000,
        createdAt: "2025-04-08T14:00:00.000Z",
        storageType: "BUNNY_STORAGE",
      },
    ],
    auditLogs: [
      {
        id: "log-21",
        meetingId: "meet-2",
        actorId: "user-1",
        actorName: "Dra. Hj. Dewi Lestari, M.Pd.",
        aksi: "PUBLIKASI",
        statusLama: "DRAFT",
        statusBaru: "OPEN",
        deskripsi: "Rapat dipublikasikan",
        createdAt: "2025-04-01T09:00:00.000Z",
      },
      {
        id: "log-22",
        meetingId: "meet-2",
        actorId: "system",
        actorName: "Sistem Otomatis",
        aksi: "MULAI_OTOMATIS",
        statusLama: "OPEN",
        statusBaru: "ONGOING",
        deskripsi: "Waktu mulai rapat tiba, status berubah otomatis menjadi Sedang Berlangsung",
        createdAt: "2025-04-10T08:30:00.000Z",
      },
    ],
  },
  {
    id: "meet-3",
    judul: "Rapat Pleno Penetapan Kebijakan Beasiswa Santri & Siswa Berprestasi 2025",
    deskripsi:
      "Agenda Rapat Pembahasan:\n1. Pemaparan hasil uji seleksi dan verifikasi berkas penerima beasiswa prestasi.\n2. Verifikasi faktual kondisi ekonomi keluarga santri yatim dhuafa.\n3. Penetapan kuota beasiswa bebas biaya pendidikan penuh dan parsial.\n4. Persetujuan penerbitan nota dinas penetapan penerima bantuan yayasan.",
    tempat: "Ruang Sidang Utama Yayasan Al Wathoniyah Asshodriyah 9",
    linkRapat: "",
    tanggal: "2025-03-20",
    waktuMulai: "2025-03-20T13:30:00.000Z",
    waktuSelesai: "2025-03-20T16:00:00.000Z",
    status: "COMPLETED",
    ringkasanHasil:
      "Rapat pleno secara mufakat menetapkan 75 penerima beasiswa tahun ajaran 2025/2026. Sebanyak 45 santri berhak atas pembebasan SPP 100% berdasarkan prestasi tahfidz dan akademik, serta 30 santri yatim berhak atas potongan SPP 50%. Bagian Keuangan dan Administrasi ditugaskan mengeksekusi SK penetapan efektif April 2025.",
    createdById: "user-1",
    createdAt: "2025-03-10T10:00:00.000Z",
    updatedAt: "2025-03-20T16:15:00.000Z",
    attendees: [
      {
        id: "att-31",
        meetingId: "meet-3",
        userId: "user-1",
        peran: "PIMPINAN_RAPAT",
        kehadiran: "HADIR",
      },
      {
        id: "att-32",
        meetingId: "meet-3",
        userId: "user-4",
        peran: "MODERATOR",
        kehadiran: "HADIR",
      },
      {
        id: "att-33",
        meetingId: "meet-3",
        userId: "user-2",
        peran: "OPERATOR",
        kehadiran: "HADIR",
      },
      {
        id: "att-34",
        meetingId: "meet-3",
        userId: "user-3",
        peran: "PESERTA",
        kehadiran: "HADIR",
      },
      {
        id: "att-35",
        meetingId: "meet-3",
        userId: "user-5",
        peran: "PESERTA",
        kehadiran: "HADIR",
      },
      {
        id: "att-36",
        meetingId: "meet-3",
        userId: "user-6",
        peran: "PESERTA",
        kehadiran: "HADIR",
      },
    ],
    attachments: [
      {
        id: "attc-31",
        meetingId: "meet-3",
        uploadedById: "user-4",
        uploadedByName: "Hendra Wijaya, S.Pd.",
        namaFileAsli: "Daftar_Calon_Penerima_Beasiswa_Tahfidz.pdf",
        urlBerkas: "#",
        mimeType: "application/pdf",
        ukuranByte: 1840000,
        createdAt: "2025-03-18T09:00:00.000Z",
        storageType: "BUNNY_STORAGE",
      },
    ],
    auditLogs: [
      {
        id: "log-31",
        meetingId: "meet-3",
        actorId: "user-1",
        actorName: "Dra. Hj. Dewi Lestari, M.Pd.",
        aksi: "PUBLIKASI",
        statusLama: "DRAFT",
        statusBaru: "OPEN",
        deskripsi: "Rapat dipublikasikan",
        createdAt: "2025-03-10T10:00:00.000Z",
      },
      {
        id: "log-32",
        meetingId: "meet-3",
        actorId: "system",
        actorName: "Sistem Otomatis",
        aksi: "MULAI_OTOMATIS",
        statusLama: "OPEN",
        statusBaru: "ONGOING",
        deskripsi: "Rapat dimulai otomatis",
        createdAt: "2025-03-20T13:30:00.000Z",
      },
      {
        id: "log-33",
        meetingId: "meet-3",
        actorId: "user-1",
        actorName: "Dra. Hj. Dewi Lestari, M.Pd.",
        aksi: "PENUTUPAN",
        statusLama: "ONGOING",
        statusBaru: "COMPLETED",
        deskripsi: "Rapat ditutup oleh Pimpinan Yayasan dan Draf Nota Dinas diterbitkan otomatis",
        createdAt: "2025-03-20T16:00:00.000Z",
      },
    ],
    officeNote: {
      id: "note-3",
      meetingId: "meet-3",
      nomorSurat: "ND/003/YAW-9/III/2025",
      perihal: "Penetapan Kuota dan Penerima Beasiswa Santri & Siswa Yayasan Tahun 2025",
      status: "FINAL",
      isiDraft: "",
      isiFinal: `<h2>HASIL RAPAT & KEPUTUSAN PLENO:</h2><p>Berdasarkan musyawarah mufakat pada Rapat Pleno Yayasan Al Wathoniyah Asshodriyah 9 tanggal 20 Maret 2025, diputuskan hal-hal sebagai berikut:</p><ol><li><strong>Penetapan Kuota Beasiswa:</strong> Total penerima beasiswa pendidikan yayasan disepakati sebanyak 75 santri/siswa berprestasi dan afirmasi.</li><li><strong>Rincian Skema:</strong> Sebanyak 45 santri tahfidz 5 juz ke atas memperoleh beasiswa penuh (bebas SPP 100%), dan 30 santri yatim dhuafa memperoleh keringanan SPP 50%.</li><li><strong>Pelaksanaan Administratif:</strong> Seluruh pembebasan biaya berlaku aktif mulai semester ganjil 2025/2026 di bawah koordinasi Bagian Keuangan dan Tata Usaha.</li></ol><p>Demikian nota dinas ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagai dasar hukum dan acuan administrasi pelaksanaan program.</p>`,
      createdById: "user-1",
      createdAt: "2025-03-20T16:00:00.000Z",
      updatedAt: "2025-03-20T16:30:00.000Z",
    },
  },
  {
    id: "meet-4",
    judul: "Rencana Kerja Sama Pengembangan Kurikulum Digital & Smart School",
    deskripsi:
      "Agenda Rapat Pembahasan:\n1. Eksplorasi proposal kemitraan institusi teknologi pembelajaran.\n2. Analisis kebutuhan infrastruktur komputasi kelas dan studio multimedia yayasan.\n3. Perumusan kerangka kerja pelatihan guru dan ustaz dalam pembuatan konten pembelajaran digital.",
    tempat: "Ruang Diskusi IT Center Asshodriyah 9",
    tanggal: "2025-08-05",
    waktuMulai: "2025-08-05T10:00:00.000Z",
    waktuSelesai: "2025-08-05T12:00:00.000Z",
    status: "DRAFT",
    createdById: "user-1",
    createdAt: "2025-07-05T11:00:00.000Z",
    updatedAt: "2025-07-05T11:00:00.000Z",
    attendees: [
      {
        id: "att-41",
        meetingId: "meet-4",
        userId: "user-1",
        peran: "PIMPINAN_RAPAT",
        kehadiran: null,
      },
      {
        id: "att-42",
        meetingId: "meet-4",
        userId: "user-2",
        peran: "MODERATOR",
        kehadiran: null,
      },
    ],
    attachments: [],
    auditLogs: [
      {
        id: "log-41",
        meetingId: "meet-4",
        actorId: "user-1",
        actorName: "Dra. Hj. Dewi Lestari, M.Pd.",
        aksi: "PEMBUATAN_DRAF",
        statusLama: "DRAFT",
        statusBaru: "DRAFT",
        deskripsi: "Draf awal rencana kerja sama dibuat",
        createdAt: "2025-07-05T11:00:00.000Z",
      },
    ],
  },
];
