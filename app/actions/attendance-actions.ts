"use server";

import { revalidatePath } from "next/cache";
import { db, isDatabaseConfigured } from "@/app/db";
import { meetingAttendees, meetings } from "@/app/db/schema";
import { eq } from "drizzle-orm";

interface AttendanceRecordInput {
  attendeeId: string;
  kehadiran: "HADIR" | "TIDAK_HADIR" | "IZIN" | null;
}

export async function saveAttendanceAction(
  meetingId: string,
  records: AttendanceRecordInput[]
) {
  if (!isDatabaseConfigured || !db) {
    return { success: true, message: "Mode simulasi lokal." };
  }

  // Verify meeting is ONGOING
  const [meeting] = await db
    .select({ status: meetings.status })
    .from(meetings)
    .where(eq(meetings.id, meetingId));

  if (!meeting || meeting.status !== "ONGOING") {
    throw new Error(
      "Presensi hanya dapat dicatat saat rapat berstatus Sedang Berlangsung (ONGOING)."
    );
  }

  // Update records
  for (const rec of records) {
    if (rec.kehadiran) {
      await db
        .update(meetingAttendees)
        .set({
          kehadiran: rec.kehadiran,
          updatedAt: new Date(),
        })
        .where(eq(meetingAttendees.id, rec.attendeeId));
    }
  }

  revalidatePath(`/kelola/rapat/${meetingId}`);
  return { success: true };
}
