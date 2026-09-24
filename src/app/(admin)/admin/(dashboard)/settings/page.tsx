import { getClubProfile } from '@/lib/data';
import { SettingsForm } from './SettingsForm';

export default async function AdminSettingsPage() {
  const profile = await getClubProfile();

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl text-ink">Settings</h1>
      <p className="mb-6 text-sm text-muted">
        Club information, contact details, social links, and SEO defaults. Fields left blank fall back to the
        placeholder values in the codebase until saved here.
      </p>
      <SettingsForm profile={profile} />
    </div>
  );
}
