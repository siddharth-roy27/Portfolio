import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Ensure DATABASE_URL is in your .env:
// DATABASE_URL="postgresql://postgres:noteforgeai123@db.lvqpvjdpzbaeddodhfnv.supabase.co:5432/postgres"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // In Prisma v7+, connection URLs belong in prisma.config.ts
    url: env("DATABASE_URL"),
  },
});
