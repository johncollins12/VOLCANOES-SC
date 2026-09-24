import { prisma } from '@/lib/prisma';
import { getUnreadMessageCount } from './messages';
import { getUserCount } from './users';

export interface DashboardStats {
  publishedNewsCount: number;
  upcomingFixturesCount: number;
  unreadMessagesCount: number;
  staffAccountsCount: number;
}

/**
 * Aggregate counts for the admin dashboard's stat tiles. Each count reuses
 * an existing data function where one already exists (getUnreadMessageCount,
 * getUserCount) rather than re-querying the same table twice across two
 * files; the two news/fixture counts are simple enough to run directly
 * here without a dedicated function elsewhere.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [publishedNewsCount, upcomingFixturesCount, unreadMessagesCount, staffAccountsCount] = await Promise.all([
      prisma.newsArticle.count({ where: { status: 'PUBLISHED' } }),
      prisma.fixture.count({ where: { status: { in: ['SCHEDULED', 'LIVE'] } } }),
      getUnreadMessageCount(),
      getUserCount(),
    ]);

    return { publishedNewsCount, upcomingFixturesCount, unreadMessagesCount, staffAccountsCount };
  } catch (error) {
    console.error('[getDashboardStats] failed to load stats:', error);
    return { publishedNewsCount: 0, upcomingFixturesCount: 0, unreadMessagesCount: 0, staffAccountsCount: 0 };
  }
}
