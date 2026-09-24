import Link from 'next/link';
import { Newspaper, CalendarDays, Inbox, Users, Plus } from 'lucide-react';
import { StatisticCard } from '@/components/ui/StatisticCard';
import { Button } from '@/components/ui/Button';
import { NewsCard } from '@/components/football/NewsCard';
import { FixtureCard } from '@/components/football/FixtureCard';
import { ResultCard } from '@/components/football/ResultCard';
import { EmptyState } from '@/components/ui/Feedback';
import {
  getDashboardStats,
  getLatestNews,
  getUpcomingFixturesList,
  getRecentResults,
} from '@/lib/data';

const QUICK_ACTIONS = [
  { label: 'New Article', href: '/admin/news/new' },
  { label: 'New Fixture', href: '/admin/fixtures/new' },
  { label: 'New Player', href: '/admin/players/new' },
  { label: 'New Album', href: '/admin/gallery/new' },
];

/**
 * /admin — the dashboard. Every tile/section here reuses an existing
 * public-facing component (NewsCard, FixtureCard, ResultCard) or the
 * shared StatisticCard, rather than a bespoke "dashboard widget" per
 * section. "Recent activity" is deliberately NOT here as a fabricated
 * feed — see /admin/activity-log for why, and the note below links there
 * so the limitation is discoverable, not hidden.
 */
export default async function AdminDashboardPage() {
  const [stats, latestNews, upcomingFixtures, recentResults] = await Promise.all([
    getDashboardStats(),
    getLatestNews(3),
    getUpcomingFixturesList({ page: 1, pageSize: 3 }),
    getRecentResults(3),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">An overview of the club&rsquo;s digital platform.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatisticCard label="Published News" value={stats.publishedNewsCount} icon={Newspaper} />
        <StatisticCard label="Upcoming Fixtures" value={stats.upcomingFixturesCount} icon={CalendarDays} />
        <Link href="/admin/messages">
          <StatisticCard label="Unread Messages" value={stats.unreadMessagesCount} icon={Inbox} className="hover-lift" />
        </Link>
        <Link href="/admin/users">
          <StatisticCard label="Staff Accounts" value={stats.staffAccountsCount} icon={Users} className="hover-lift" />
        </Link>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg text-ink">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" aria-hidden />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">Latest News</h2>
          <Link href="/admin/news" className="text-sm font-medium text-cyan hover:underline">
            Manage all →
          </Link>
        </div>
        {latestNews.length === 0 ? (
          <EmptyState title="No news yet" description="Published articles will appear here." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {latestNews.map((a) => (
              <NewsCard
                key={a.id}
                title={a.title}
                excerpt={a.excerpt}
                categoryName={a.categoryName}
                coverImageUrl={a.coverImageUrl}
                publishedAt={a.publishedAt}
                href={`/admin/news/${a.id}/edit`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Upcoming Fixtures</h2>
            <Link href="/admin/fixtures" className="text-sm font-medium text-cyan hover:underline">
              Manage all →
            </Link>
          </div>
          {upcomingFixtures.items.length === 0 ? (
            <EmptyState title="No upcoming fixtures" description="Scheduled matches will appear here." />
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingFixtures.items.map((f) => (
                <FixtureCard
                  key={f.id}
                  competitionName={f.competitionName}
                  homeTeamName={f.homeTeamName}
                  awayTeamName={f.awayTeamName}
                  isHome={f.isHome}
                  kickoffAt={f.kickoffAt}
                  status={f.status === 'LIVE' ? 'LIVE' : 'SCHEDULED'}
                  venueName={f.venueName}
                  href={`/admin/fixtures/${f.id}/edit`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Recent Results</h2>
            <Link href="/admin/fixtures" className="text-sm font-medium text-cyan hover:underline">
              Manage all →
            </Link>
          </div>
          {recentResults.length === 0 ? (
            <EmptyState title="No results yet" description="Completed matches will appear here." />
          ) : (
            <div className="flex flex-col gap-3">
              {recentResults.map((r) => (
                <ResultCard
                  key={r.id}
                  competitionName={r.competitionName}
                  homeTeamName={r.homeTeamName}
                  awayTeamName={r.awayTeamName}
                  isHome={r.isHome}
                  kickoffAt={r.kickoffAt}
                  homeScore={r.homeScore ?? 0}
                  awayScore={r.awayScore ?? 0}
                  href={`/admin/fixtures/${r.id}/edit`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-card border border-dashed border-border p-4 text-sm text-muted">
        Looking for a recent-activity feed?{' '}
        <Link href="/admin/activity-log" className="font-medium text-cyan hover:underline">
          See the Activity Log
        </Link>{' '}
        — it explains why one isn&rsquo;t shown here yet rather than displaying fabricated entries.
      </div>
    </div>
  );
}
