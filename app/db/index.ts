import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Cache connection in serverless environment
export const isDatabaseConfigured = Boolean(connectionString && connectionString.startsWith("postgres"));

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (isDatabaseConfigured && connectionString) {
  try {
    const sql = neon(connectionString);
    dbInstance = drizzle(sql, { schema });
  } catch (error) {
    console.warn("Peringatan: Gagal menginisialisasi koneksi Neon Database:", error);
  }
}

export const db = dbInstance;
export { schema };
