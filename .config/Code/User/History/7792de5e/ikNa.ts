import "dotenv/config"; // load .env
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    adapter: () => {
      const url = process.env.DATABASE_URL;
      if (!url) throw new Error("DATABASE_URL not found in .env");
      return url;
    },
  },
});
