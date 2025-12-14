import "dotenv/config"; // loads .env
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",      // path to your schema
  migrations: {
    path: "prisma/migrations",         // where migrations will be stored
  },
  datasource: {
    adapter: env("DATABASE_URL"),      // use 'adapter' instead of 'url' in Prisma 7
  },
});
