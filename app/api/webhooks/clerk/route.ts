import { headers } from "next/headers";
import { Webhook } from "svix";
import { db, isDatabaseConfigured } from "@/app/db";
import { users } from "@/app/db/schema";
import { eq } from "drizzle-orm";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string; id: string }[];
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
  };
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("CLERK_WEBHOOK_SECRET belum dikonfigurasi.", {
      status: 400,
    });
  }

  // Get Svix headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Header svix tidak lengkap.", { status: 400 });
  }

  // Get raw body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as ClerkWebhookEvent;
  } catch (err) {
    console.error("Gagal memverifikasi Clerk Webhook:", err);
    return new Response("Verifikasi webhook gagal.", { status: 400 });
  }

  const eventType = evt.type;
  const data = evt.data;

  if (!isDatabaseConfigured || !db) {
    console.log(`Webhook diterima (${eventType}), tetapi database belum dikonfigurasi.`);
    return new Response("Diterima tanpa database.", { status: 200 });
  }

  try {
    if (eventType === "user.created") {
      const email = data.email_addresses?.[0]?.email_address || `${data.id}@rapatkita.local`;
      const nama = [data.first_name, data.last_name].filter(Boolean).join(" ") || "Pegawai Yayasan";

      await db.insert(users).values({
        id: data.id,
        email,
        nama,
        avatarUrl: data.image_url || undefined,
        globalRole: "USER",
        isActive: true,
      });

      console.log(`User Clerk ${data.id} (${email}) berhasil disinkronkan ke PostgreSQL.`);
    }

    if (eventType === "user.updated") {
      const email = data.email_addresses?.[0]?.email_address;
      const nama = [data.first_name, data.last_name].filter(Boolean).join(" ");

      await db
        .update(users)
        .set({
          ...(email ? { email } : {}),
          ...(nama ? { nama } : {}),
          ...(data.image_url ? { avatarUrl: data.image_url } : {}),
          updatedAt: new Date(),
        })
        .where(eq(users.id, data.id));

      console.log(`User Clerk ${data.id} berhasil diperbarui di PostgreSQL.`);
    }

    if (eventType === "user.deleted") {
      await db
        .update(users)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(users.id, data.id));

      console.log(`User Clerk ${data.id} dinonaktifkan di PostgreSQL.`);
    }

    return new Response("Webhook berhasil diproses.", { status: 200 });
  } catch (dbError) {
    console.error("Kesalahan database saat memproses webhook Clerk:", dbError);
    return new Response("Kesalahan database internal.", { status: 500 });
  }
}
