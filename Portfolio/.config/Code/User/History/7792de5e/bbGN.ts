import "dotenv/config"; // loads .env
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    adapter: process.env.DATABASE_URL, // <- use process.env directly
  },
});
