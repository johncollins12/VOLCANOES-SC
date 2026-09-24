import { config } from 'dotenv';
config({ path: '.env.local' });
import { defineConfig, env } from 'prisma/config';

/**
 * Prisma 7 configuration (replaces `url`/`directUrl` previously in
 * schema.prisma's datasource block — see the comment there and
 * docs/DEPLOYMENT.md for the full migration note).
 *
 * `datasource.url` here is what the Prisma CLI (migrate, db push,
 * studio, etc.) connects with — per Prisma's own v7 upgrade guide, this
 * should be the DIRECT (non-pooled) connection string, i.e. what used to
 * be `directUrl`, because CLI/migration commands need a direct
 * connection rather than a pgbouncer-pooled one.
 *
 * This file does NOT affect how the application's own PrismaClient
 * (src/lib/prisma.ts) connects at runtime — that still reads
 * DATABASE_URL (the pooled connection) the same way it always has.
 * `import 'dotenv/config'` is required here because, unlike Next.js
 * itself, the Prisma CLI does not load .env files automatically in
 * Prisma 7.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DIRECT_URL'),
  },
});
