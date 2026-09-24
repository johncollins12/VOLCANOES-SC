import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { Section, Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/Feedback';
import { StaffCard } from '@/components/football/StaffCard';
import { getAllStaffMembers } from '@/lib/data';

export const revalidate = 300;

export const metadata: Metadata = buildPageMetadata({
  title: 'Management',
  description: 'Club leadership and management team.',
  path: '/club/management',
});

export default async function ManagementPage() {
  const staff = (await getAllStaffMembers()).filter((s) => s.categoryName === 'Management' && s.isActive);

  return (
    <Section>
      <Container>
        <h1 className="mb-6 font-display text-3xl font-semibold text-ink">Management</h1>

        {staff.length === 0 ? (
          <EmptyState title="Not published yet" description="Management profiles will appear here once added from the admin dashboard." />
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
