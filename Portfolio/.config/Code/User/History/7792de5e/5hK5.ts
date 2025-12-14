import "dotenv/config";
import { defineConfig } from "prisma/config";

// Ensure DATABASE_URL is in your .env:
// DATABASE_URL="postgresql://postgres:noteforgeai123@db.lvqpvjdpzbaeddodhfnv.supabase.co:5432/postgres"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Must be a string, not a function
    adapter: process.env.DATABASE_URL,
  },
});
