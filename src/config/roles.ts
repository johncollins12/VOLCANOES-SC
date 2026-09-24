/**
 * Role constants — must stay in sync with the `Role` rows seeded in
 * prisma/seed.ts. Defined once here so every part of the app (permission
 * checks, admin nav, seed script types) references the same literal values
 * instead of repeating magic strings.
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CONTENT_EDITOR: 'CONTENT_EDITOR',
  MEDIA_MANAGER: 'MEDIA_MANAGER',
  MATCHDAY_EDITOR: 'MATCHDAY_EDITOR',
  SHOP_MANAGER: 'SHOP_MANAGER',
  TICKETING_MANAGER: 'TICKETING_MANAGER',
  MEMBERSHIP_MANAGER: 'MEMBERSHIP_MANAGER',
  VIEWER: 'VIEWER',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  SUPER_ADMIN: 'Full platform access, including user management and settings.',
  CONTENT_EDITOR: 'Manages news, match reports, and club information pages.',
  MEDIA_MANAGER: 'Manages gallery photos and videos.',
  MATCHDAY_EDITOR: 'Updates fixtures, results, and league table entries.',
  SHOP_MANAGER: 'Manages shop products, variants, and orders.',
  TICKETING_MANAGER: 'Manages ticket types and verifies ticket orders.',
  MEMBERSHIP_MANAGER: 'Manages fan membership plans and subscriptions.',
  VIEWER: 'Read-only access to the admin dashboard.',
};
