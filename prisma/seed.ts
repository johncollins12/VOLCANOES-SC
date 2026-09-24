/**
 * Prisma seed script
 * ──────────────────
 * Seeds only structural/reference data that the app depends on to function —
 * NEVER fake club content (no placeholder players, news, or staff). Run with:
 *   npm run prisma:seed
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { PoolConfig } from 'pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4,
} as PoolConfig & { family?: number });

const prisma = new PrismaClient({ adapter });

const ROLES = [
  { name: 'SUPER_ADMIN', description: 'Full platform access, including user management and settings.' },
  { name: 'CONTENT_EDITOR', description: 'Manages news, match reports, and club information pages.' },
  { name: 'MEDIA_MANAGER', description: 'Manages gallery photos and videos.' },
  { name: 'MATCHDAY_EDITOR', description: 'Updates fixtures, results, and league table entries.' },
  { name: 'SHOP_MANAGER', description: 'Manages shop products, variants, and orders.' },
  { name: 'TICKETING_MANAGER', description: 'Manages ticket types and verifies ticket orders.' },
  { name: 'MEMBERSHIP_MANAGER', description: 'Manages fan membership plans and subscriptions.' },
  { name: 'VIEWER', description: 'Read-only access to the admin dashboard.' },
] as const;

const STAFF_CATEGORIES = ['Management', 'Technical Staff', 'Medical', 'Administration'] as const;

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const;

const NEWS_CATEGORIES = ['Club News', 'Match Reports', 'Transfers', 'Community'] as const;

const VIDEO_CATEGORIES = ['Highlights', 'Interviews', 'Behind the Scenes'] as const;

const SPONSOR_TIERS = [
  { name: 'Principal Sponsor', rank: 1 },
  { name: 'Official Partner', rank: 2 },
  { name: 'Community Partner', rank: 3 },
] as const;

async function main() {
  console.log('Seeding reference data...');

  await Promise.all(ROLES.map((role) => prisma.role.upsert({ where: { name: role.name }, update: {}, create: role })));

  await Promise.all(
    STAFF_CATEGORIES.map((name) => prisma.staffCategory.upsert({ where: { name }, update: {}, create: { name } }))
  );

  await Promise.all(
    POSITIONS.map((name) => prisma.position.upsert({ where: { name }, update: {}, create: { name } }))
  );

  await Promise.all(
    NEWS_CATEGORIES.map((name) => prisma.newsCategory.upsert({ where: { name }, update: {}, create: { name } }))
  );

  await Promise.all(
    VIDEO_CATEGORIES.map((name) => prisma.videoCategory.upsert({ where: { name }, update: {}, create: { name } }))
  );

  await Promise.all(
    SPONSOR_TIERS.map((tier) => prisma.sponsorTier.upsert({ where: { name: tier.name }, update: {}, create: tier }))
  );

  // ⚠️ CLUB INPUT NEEDED before go-live: create the single ClubProfile row with
  // real history/vision/mission/colors once provided — intentionally NOT seeded
  // here to avoid fabricating club facts. Do this via the admin dashboard in
  // Phase 1, or add a real seed once the data arrives.

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });