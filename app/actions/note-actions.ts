"use server";

import { revalidatePath } from "next/cache";
import { db, isDatabaseConfigured } from "@/app/db";
import { officeNotes } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function saveOfficeNoteDraftAction(noteId: string, isiDraft: string) {
  if (!isDatabaseConfigured || !db) {
    return { success: true, message: "Mode simulasi lokal." };
  }

  // Check if already final
  const [existing] = await db
    .select({ status: officeNotes.status, meetingId: officeNotes.meetingId })
    .from(officeNotes)
    .where(eq(officeNotes.id, noteId));

  if (!existing) {
    throw new Error("Nota dinas tidak ditemukan.");
  }

  if (existing.status === "FINAL") {
    throw new Error("Nota dinas telah berstatus FINAL dan tidak dapat diedit kembali.");
  }

  await db
    .update(officeNotes)
    .set({
      isiDraft,
      updatedAt: new Date(),
    })
    .where(eq(officeNotes.id, noteId));

  revalidatePath(`/kelola/nota/${noteId}`);
  revalidatePath(`/kelola/rapat/${existing.meetingId}`);

  return { success: true };
}

export async function finalizeOfficeNoteAction(noteId: string, isiFinal: string) {
  if (!isDatabaseConfigured || !db) {
    return { success: true, message: "Mode simulasi lokal." };
  }

  const [existing] = await db
    .select({ meetingId: officeNotes.meetingId })
    .from(officeNotes)
    .where(eq(officeNotes.id, noteId));

  if (!existing) {
    throw new Error("Nota dinas tidak ditemukan.");
  }

  await db
    .update(officeNotes)
    .set({
      isiFinal,
      status: "FINAL",
      updatedAt: new Date(),
    })
    .where(eq(officeNotes.id, noteId));

  revalidatePath(`/kelola/nota/${noteId}`);
  revalidatePath(`/kelola/rapat/${existing.meetingId}`);

  return { success: true };
}
