import { notFound } from 'next/navigation';
import { getSponsorTiers, getSponsorById } from '@/lib/data';
import { SponsorForm } from '../../SponsorForm';
import { updateSponsorAction } from '@/actions/sponsors.actions';

interface EditSponsorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSponsorPage({ params }: EditSponsorPageProps) {
  const { id } = await params;
  const [tiers, sponsor] = await Promise.all([getSponsorTiers(), getSponsorById(id)]);

  if (!sponsor) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Edit Sponsor</h1>
      <SponsorForm tiers={tiers} sponsor={sponsor} action={updateSponsorAction.bind(null, id)} />
    </div>
  );
}
