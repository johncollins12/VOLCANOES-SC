import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { StaffCard } from '@/components/football/StaffCard';
import { getAllStaffMembers } from '@/lib/data';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Technical Staff',
  description: 'Coaching and technical team.',
  path: '/club/technical-staff',
});

export default async function TechnicalStaffPage() {
  const staff = (await getAllStaffMembers()).filter((s) => s.categoryName === 'Technical Staff' && s.isActive);

  return (
    <Section>
      <Container>
        <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Technical Staff</h1>

        {staff.length === 0 ? (
          <EmptyState title="Not published yet" description="Technical staff profiles will appear here once added from the admin dashboard." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {staff.map((s) => (
              <StaffCard key={s.id} name={s.fullName} role={s.role} photoUrl={s.photoUrl} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
