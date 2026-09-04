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
  (table) => [
    uniqueIndex("meeting_attendee_unique").on(
      table.meetingId,
      table.userId
    ),
  ]
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

export type UserTable = typeof users.$inferSelect;
export type NewUserTable = typeof users.$inferInsert;
export type MeetingTable = typeof meetings.$inferSelect;
export type NewMeetingTable = typeof meetings.$inferInsert;
export type MeetingAttendeeTable = typeof meetingAttendees.$inferSelect;
export type MeetingAttachmentTable = typeof meetingAttachments.$inferSelect;
export type MeetingAuditLogTable = typeof meetingAuditLogs.$inferSelect;
export type OfficeNoteTable = typeof officeNotes.$inferSelect;
