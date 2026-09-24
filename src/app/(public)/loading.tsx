import { Container, Section } from '@/components/ui/Container';

/**
 * Shown automatically by Next.js while a page in the (public) route group
 * is fetching data (e.g. the homepage's Promise.all in page.tsx). Kept
 * generic/structural rather than page-specific, since it briefly appears
 * for every public page, not just the homepage.
 */
export default function PublicLoading() {
  return (
    <Section>
      <Container className="animate-pulse space-y-6">
        <div className="h-8 w-1/3 rounded-card bg-surface-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-48 rounded-card bg-surface-muted" />
          <div className="h-48 rounded-card bg-surface-muted" />
          <div className="h-48 rounded-card bg-surface-muted" />
        </div>
      </Container>
    </Section>
  );
}
