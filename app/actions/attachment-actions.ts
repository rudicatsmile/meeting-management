"use server";

import { revalidatePath } from "next/cache";
import { db, isDatabaseConfigured } from "@/app/db";
import { meetingAttachments } from "@/app/db/schema";
import { eq } from "drizzle-orm";

interface AttachmentInput {
  meetingId: string;
  uploadedById: string;
  namaFileAsli: string;
  mimeType: string;
  ukuranByte: number;
  urlBerkas?: string;
  videoIdBunny?: string;
  storageType?: "BUNNY_STORAGE" | "BUNNY_STREAM";
}

export async function createAttachmentMetadataAction(data: AttachmentInput) {
  // Validate sizes according to PRD Section 6.C
  const maxDocSize = 25 * 1024 * 1024; // 25 MB
  const maxImageSize = 10 * 1024 * 1024; // 10 MB
  const maxVideoSize = 500 * 1024 * 1024; // 500 MB

  if (data.mimeType.startsWith("image/") && data.ukuranByte > maxImageSize) {
    throw new Error("Ukuran gambar melebihi batas maksimal 10 MB.");
  }
  if (data.mimeType.startsWith("video/") && data.ukuranByte > maxVideoSize) {
    throw new Error("Ukuran video melebihi batas maksimal 500 MB.");
  }
  if (
    !data.mimeType.startsWith("image/") &&
    !data.mimeType.startsWith("video/") &&
    data.ukuranByte > maxDocSize
  ) {
    throw new Error("Ukuran dokumen melebihi batas maksimal 25 MB.");
  }

  if (!isDatabaseConfigured || !db) {
    return { success: true, message: "Mode simulasi lokal." };
  }

  const [newAttachment] = await db
    .insert(meetingAttachments)
    .values({
      meetingId: data.meetingId,
      uploadedById: data.uploadedById,
      namaFileAsli: data.namaFileAsli,
      urlBerkas: data.urlBerkas || null,
      videoIdBunny: data.videoIdBunny || null,
      storageType: data.storageType || "BUNNY_STORAGE",
      mimeType: data.mimeType,
      ukuranByte: data.ukuranByte,
    })
    .returning();

  revalidatePath(`/rapat/${data.meetingId}`);
  revalidatePath(`/kelola/rapat/${data.meetingId}`);

  return { success: true, attachment: newAttachment };
}

export async function deleteAttachmentAction(attachmentId: string, meetingId: string) {
  if (!isDatabaseConfigured || !db) {
    return { success: true, message: "Mode simulasi lokal." };
  }

  await db.delete(meetingAttachments).where(eq(meetingAttachments.id, attachmentId));

  revalidatePath(`/rapat/${meetingId}`);
  revalidatePath(`/kelola/rapat/${meetingId}`);

  return { success: true };
}
