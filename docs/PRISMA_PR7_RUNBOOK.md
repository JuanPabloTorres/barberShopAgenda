# Prisma 7 Runbook: Configuration, Migration, and Environment

## Why Prisma 7 uses `prisma.config.ts` for datasource url
Prisma 7+ requires the datasource URL to be provided via a config file (`prisma.config.ts`, `.js`, or `.mjs`) instead of directly in the `schema.prisma`. This enables better environment variable management and aligns with modern configuration practices.

## Required .env file
At the project root, you must have a `.env` file with:

```
DATABASE_URL=file:./dev.db
```

## Required config file: `prisma.config.ts`
```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

## Required schema block (in `prisma/schema.prisma`)
```
datasource db {
  provider = "sqlite"
}
```

## Standard commands to run
```
npm install
npx prisma validate
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

## Troubleshooting
- **If you see `definePrismaConfig` error:** Replace your config file with the correct API above.
- **If you see `datasource.url property is required` error:** Your config/env is missing or config is not loaded. Ensure `.env` and `prisma.config.ts` exist and are correct.

## Checklist para ti (rápido)
Siempre ejecuta:
- npm install
- npx prisma validate
- npx prisma migrate dev
- npx prisma db seed

No uses `url = ...` en el datasource del schema.
No uses `definePrismaConfig` en ningún archivo.
