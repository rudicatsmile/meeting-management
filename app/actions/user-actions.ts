"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db, isDatabaseConfigured } from "@/app/db";
import { users, meetings, meetingAttendees } from "@/app/db/schema";
import { eq } from "drizzle-orm";

const userSchema = z.object({
  id: z.string().optional(),
  nama: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  jabatan: z.string().min(2, "Jabatan / unit kerja wajib diisi"),
  globalRole: z.enum(["ADMIN", "USER"]).default("USER"),
});

export async function createUserAction(formData: z.infer<typeof userSchema>) {
  const validated = userSchema.parse(formData);

  if (!isDatabaseConfigured || !db) {
    return {
      success: true,
      message: "Database belum dikonfigurasi. Disimpan pada simulasi lokal.",
    };
  }

  // Check email uniqueness
  const [existingEmail] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, validated.email));

  if (existingEmail) {
    throw new Error(`Email ${validated.email} sudah terdaftar di sistem.`);
  }

  const newId = validated.id || `user_${Date.now()}`;

  const [newUser] = await db
    .insert(users)
    .values({
      id: newId,
      nama: validated.nama,
      email: validated.email,
      jabatan: validated.jabatan,
      globalRole: validated.globalRole,
      isActive: true,
    })
    .returning();

  revalidatePath("/kelola/user");
  return { success: true, user: newUser };
}

export async function deleteUserAction(userId: string) {
  if (!isDatabaseConfigured || !db) {
    return { success: true, message: "Mode simulasi lokal." };
  }

  // Protect Admin Utama
  if (userId === "user-1" || userId === "user_dewi_lestari") {
    return {
      success: false,
      message: "Admin Utama Yayasan (Dra. Hj. Dewi Lestari, M.Pd.) dilindungi dan tidak dapat dihapus.",
    };
  }

  // Check if user has created any meetings
  const [createdMeeting] = await db
    .select({ id: meetings.id })
    .from(meetings)
    .where(eq(meetings.createdById, userId))
    .limit(1);

  if (createdMeeting) {
    return {
      success: false,
      hasMeetingHistory: true,
      message:
        "Pengguna ini memiliki riwayat sebagai pembuat rapat yayasan. Untuk menjaga integritas arsip, akun tidak dapat dihapus. Silakan gunakan tombol 'Nonaktifkan' sebagai gantinya.",
    };
  }

  // Check if user is in any meeting attendees list
  const [attendedMeeting] = await db
    .select({ id: meetingAttendees.id })
    .from(meetingAttendees)
    .where(eq(meetingAttendees.userId, userId))
    .limit(1);

  if (attendedMeeting) {
    return {
      success: false,
      hasMeetingHistory: true,
      message:
        "Pengguna ini memiliki riwayat keikutsertaan / presensi dalam rapat yayasan. Untuk menjaga integritas notulen dan risalah, akun tidak dapat dihapus. Silakan gunakan tombol 'Nonaktifkan' sebagai gantinya.",
    };
  }

  // Delete user
  await db.delete(users).where(eq(users.id, userId));

  revalidatePath("/kelola/user");
  return { success: true };
}
