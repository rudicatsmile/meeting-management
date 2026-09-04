"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db, isDatabaseConfigured } from "@/app/db";
import {
  meetings,
  meetingAttendees,
  meetingAuditLogs,
  officeNotes,
} from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { toRoman } from "@/lib/utils";

// Zod validation schemas
const createMeetingSchema = z.object({
  judul: z.string().min(3, "Judul rapat minimal 3 karakter"),
  deskripsi: z.string().min(5, "Agenda rapat minimal 5 karakter"),
  tempat: z.string().optional(),
  linkRapat: z.string().optional(),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  waktuMulai: z.string(),
  waktuSelesai: z.string(),
  createdById: z.string(),
  isPublishNow: z.boolean().default(false),
  attendees: z
    .array(
      z.object({
        userId: z.string(),
        peran: z.enum(["PIMPINAN_RAPAT", "MODERATOR", "OPERATOR", "PESERTA"]),
      })
    )
    .min(1, "Minimal harus ada 1 peserta"),
});

export async function createMeetingAction(formData: z.infer<typeof createMeetingSchema>) {
  const validated = createMeetingSchema.parse(formData);

  if (!isDatabaseConfigured || !db) {
    return {
      success: true,
      message: "Database belum terhubung. Operasi dicatat secara lokal.",
    };
  }

  const status = validated.isPublishNow ? "OPEN" : "DRAFT";

  // Insert meeting
  const [newMeeting] = await db
    .insert(meetings)
    .values({
      judul: validated.judul,
      deskripsi: validated.deskripsi,
      tempat: validated.tempat || null,
      linkRapat: validated.linkRapat || null,
      tanggal: validated.tanggal,
      waktuMulai: new Date(validated.waktuMulai),
      waktuSelesai: new Date(validated.waktuSelesai),
      status,
      createdById: validated.createdById,
    })
    .returning();

  // Insert attendees
  if (validated.attendees.length > 0) {
    await db.insert(meetingAttendees).values(
      validated.attendees.map((att) => ({
        meetingId: newMeeting.id,
        userId: att.userId,
        peran: att.peran,
      }))
    );
  }

  // Record audit log
  await db.insert(meetingAuditLogs).values({
    meetingId: newMeeting.id,
    actorId: validated.createdById,
    aksi: validated.isPublishNow ? "PUBLIKASI" : "PEMBUATAN_DRAF",
    statusLama: "DRAFT",
    statusBaru: status,
    deskripsi: validated.isPublishNow
      ? "Rapat langsung dipublikasikan oleh Admin Pengelola Yayasan"
      : "Rapat dibuat oleh Admin Pengelola Yayasan dalam status Draf",
  });

  revalidatePath("/kelola/rapat");
  revalidatePath("/rapat");

  return { success: true, meeting: newMeeting };
}

export async function publishMeetingAction(meetingId: string, actorId: string) {
  if (!isDatabaseConfigured || !db) {
    return { success: true, message: "Mode simulasi lokal." };
  }

  await db
    .update(meetings)
    .set({ status: "OPEN", updatedAt: new Date() })
    .where(eq(meetings.id, meetingId));

  await db.insert(meetingAuditLogs).values({
    meetingId,
    actorId,
    aksi: "PUBLIKASI",
    statusLama: "DRAFT",
    statusBaru: "OPEN",
    deskripsi: "Rapat resmi dipublikasikan untuk seluruh peserta",
  });

  revalidatePath(`/kelola/rapat/${meetingId}`);
  revalidatePath("/kelola/rapat");
  revalidatePath("/rapat");

  return { success: true };
}

export async function startMeetingAction(meetingId: string, actorId: string) {
  if (!isDatabaseConfigured || !db) {
    return { success: true, message: "Mode simulasi lokal." };
  }

  await db
    .update(meetings)
    .set({ status: "ONGOING", updatedAt: new Date() })
    .where(eq(meetings.id, meetingId));

  await db.insert(meetingAuditLogs).values({
    meetingId,
    actorId,
    aksi: "MULAI_RAPAT",
    statusLama: "OPEN",
    statusBaru: "ONGOING",
    deskripsi: "Rapat dimulai dan presensi kehadiran diaktifkan",
  });

  revalidatePath(`/kelola/rapat/${meetingId}`);
  revalidatePath("/kelola/rapat");
  revalidatePath("/rapat");

  return { success: true };
}

export async function closeMeetingAndGenerateNoteAction(
  meetingId: string,
  actorId: string,
  ringkasanHasil: string
) {
  if (ringkasanHasil.trim().length < 10) {
    throw new Error("Ringkasan hasil rapat minimal 10 karakter.");
  }

  if (!isDatabaseConfigured || !db) {
    return { success: true, message: "Mode simulasi lokal." };
  }

  // 1. Fetch meeting and existing completed notes count
  const meeting = await db.query.meetings.findFirst({
    where: eq(meetings.id, meetingId),
    with: {
      attendees: true,
    },
  });

  if (!meeting) {
    throw new Error("Rapat tidak ditemukan.");
  }

  const now = new Date();
  const romanMonth = toRoman(now.getMonth() + 1);
  const year = now.getFullYear();

  // Count notes for numbering: ND/00X/YAW-9/ROMAN/YEAR
  const allNotes = await db.select().from(officeNotes);
  const padded = String(allNotes.length + 1).padStart(3, "0");
  const nomorSurat = `ND/${padded}/YAW-9/${romanMonth}/${year}`;

  const initialDraft = `
<h2>NOTULEN & HASIL KEPUTUSAN RAPAT</h2>
<p>Pada hari ini, diselenggarakan <strong>${meeting.judul}</strong> bertempat di <strong>${
    meeting.tempat || "Ruang Rapat Virtual"
  }</strong>.</p>
<h3>I. Hasil Musyawarah & Risalah:</h3>
<p>${ringkasanHasil.replace(/\n/g, "<br/>")}</p>
<h3>II. Penutup:</h3>
<p>Demikian nota dinas dan risalah hasil rapat ini dibuat secara resmi untuk menjadi pedoman pelaksanaan tugas Yayasan Al Wathoniyah Asshodriyah 9.</p>
  `.trim();

  // 2. Transaction: update meeting status to COMPLETED and insert office note
  await db
    .update(meetings)
    .set({
      status: "COMPLETED",
      ringkasanHasil,
      updatedAt: now,
    })
    .where(eq(meetings.id, meetingId));

  const [newNote] = await db
    .insert(officeNotes)
    .values({
      meetingId,
      nomorSurat,
      perihal: meeting.judul,
      isiDraft: initialDraft,
      status: "DRAFT",
      createdById: actorId,
    })
    .returning();

  // 3. Insert audit log
  await db.insert(meetingAuditLogs).values({
    meetingId,
    actorId,
    aksi: "PENUTUPAN",
    statusLama: meeting.status,
    statusBaru: "COMPLETED",
    deskripsi: `Rapat ditutup oleh Admin Pengelola. Draf Nota Dinas ${nomorSurat} dibuat otomatis.`,
  });

  revalidatePath(`/kelola/rapat/${meetingId}`);
  revalidatePath("/kelola/rapat");
  revalidatePath("/rapat");

  return { success: true, note: newNote };
}

export async function ensureMeetingStatusAction(meetingId: string) {
  if (!isDatabaseConfigured || !db) return;

  const meeting = await db.query.meetings.findFirst({
    where: eq(meetings.id, meetingId),
  });

  if (!meeting) return;

  const now = new Date();
  if (meeting.status === "OPEN" && new Date(meeting.waktuMulai) <= now) {
    await db
      .update(meetings)
      .set({ status: "ONGOING", updatedAt: now })
      .where(eq(meetings.id, meetingId));

    await db.insert(meetingAuditLogs).values({
      meetingId,
      actorId: "system",
      aksi: "MULAI_OTOMATIS",
      statusLama: "OPEN",
      statusBaru: "ONGOING",
      deskripsi: "Waktu mulai rapat tiba, status berubah otomatis menjadi Sedang Berlangsung",
    });

    revalidatePath(`/kelola/rapat/${meetingId}`);
    revalidatePath("/rapat");
  }
}
