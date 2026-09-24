import { getSponsorTiers } from '@/lib/data';
import { SponsorForm } from '../SponsorForm';
import { createSponsorAction } from '@/actions/sponsors.actions';

export default async function NewSponsorPage() {
  const tiers = await getSponsorTiers();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">New Sponsor</h1>
      <SponsorForm tiers={tiers} action={createSponsorAction} />
    </div>
  );
}
