import { db, isDatabaseConfigured } from "./index";
import { users, meetings, meetingAttendees, meetingAuditLogs } from "./schema";

export async function seedDatabase() {
  if (!isDatabaseConfigured || !db) {
    console.log("Database URL belum dikonfigurasi. Melewati seeding database.");
    return;
  }

  console.log("Memulai seeding database Yayasan Al Wathoniyah Asshodriyah 9...");

  try {
    // 1. Seed Users
    const seedUsers = [
      {
        id: "user_dewi_lestari",
        email: "dewi.lestari@asshodriyah9.sch.id",
        nama: "Dra. Hj. Dewi Lestari, M.Pd.",
        jabatan: "Ketua Dewan Pengurus Yayasan",
        globalRole: "ADMIN" as const,
        isActive: true,
      },
      {
        id: "user_rendra_pratama",
        email: "rendra.pratama@asshodriyah9.sch.id",
        nama: "H. Rendra Pratama, S.Kom.",
        jabatan: "Kepala Biro IT & Sistem Informasi",
        globalRole: "USER" as const,
        isActive: true,
      },
      {
        id: "user_salsabila_zahra",
        email: "salsabila.zahra@asshodriyah9.sch.id",
        nama: "Salsabila Zahra, S.E.",
        jabatan: "Bendahara Umum Yayasan",
        globalRole: "USER" as const,
        isActive: true,
      },
      {
        id: "user_hendra_wijaya",
        email: "hendra.wijaya@asshodriyah9.sch.id",
        nama: "Hendra Wijaya, S.Pd.",
        jabatan: "Kepala Satuan Pendidikan Formal",
        globalRole: "USER" as const,
        isActive: true,
      },
    ];

    for (const u of seedUsers) {
      await db.insert(users).values(u).onConflictDoNothing();
    }

    console.log("Seeding pengguna selesai.");

    // 2. Seed Example OPEN Meeting
    const meetingData = {
      judul: "Rapat Koordinasi Persiapan Tahun Ajaran Baru 2025/2026",
      deskripsi:
        "1. Penetapan kalender akademik yayasan.\n2. Alokasi jam mengajar guru.\n3. Kesiapan laboratorium dan sarana smart school.",
      tempat: "Aula Pertemuan Utama Lantai 2 Kampus Asshodriyah 9",
      linkRapat: "https://meet.google.com/yaw-persiapan-2025",
      tanggal: "2025-07-15",
      waktuMulai: new Date("2025-07-15T09:00:00.000Z"),
      waktuSelesai: new Date("2025-07-15T12:00:00.000Z"),
      status: "OPEN" as const,
      createdById: "user_dewi_lestari",
    };

    const [insertedMeeting] = await db.insert(meetings).values(meetingData).returning();

    if (insertedMeeting) {
      // 3. Seed Attendees
      await db.insert(meetingAttendees).values([
        {
          meetingId: insertedMeeting.id,
          userId: "user_dewi_lestari",
          peran: "PIMPINAN_RAPAT",
        },
        {
          meetingId: insertedMeeting.id,
          userId: "user_hendra_wijaya",
          peran: "MODERATOR",
        },
        {
          meetingId: insertedMeeting.id,
          userId: "user_rendra_pratama",
          peran: "OPERATOR",
        },
        {
          meetingId: insertedMeeting.id,
          userId: "user_salsabila_zahra",
          peran: "PESERTA",
        },
      ]);

      // 4. Seed Audit Log
      await db.insert(meetingAuditLogs).values({
        meetingId: insertedMeeting.id,
        actorId: "user_dewi_lestari",
        aksi: "PUBLIKASI",
        statusLama: "DRAFT",
        statusBaru: "OPEN",
        deskripsi: "Rapat dipublikasikan secara resmi oleh Admin Yayasan",
      });
    }

    console.log("Seeding database RapatKita berhasil diselesaikan!");
  } catch (error) {
    console.error("Kesalahan saat menjalankan seed:", error);
  }
}

seedDatabase().catch(console.error);

