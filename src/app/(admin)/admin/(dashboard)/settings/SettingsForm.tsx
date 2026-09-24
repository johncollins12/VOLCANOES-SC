'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input, Textarea } from '@/components/forms';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/cms/Tabs';
import { updateClubProfileAction } from '@/actions/settings.actions';
import type { ClubProfileData } from '@/lib/data/settings';

export function SettingsForm({ profile }: { profile: ClubProfileData | null }) {
  const [state, formAction] = useActionState(updateClubProfileAction, undefined);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      <Tabs
        tabs={[
          {
            key: 'club',
            label: 'Club Information',
            content: (
              <div className="flex flex-col gap-5">
                <AdminImageUpload bucket="club-assets" name="crestUrl" label="Club Crest" initialUrl={profile?.crestUrl} />
                <Input id="foundedYear" name="foundedYear" type="number" label="Founded Year" defaultValue={profile?.foundedYear ?? ''} />
                <Input id="motto" name="motto" label="Motto" defaultValue={profile?.motto ?? ''} />
                <Textarea id="history" name="history" label="Club History" rows={5} defaultValue={profile?.history ?? ''} />
                <Textarea id="vision" name="vision" label="Vision" rows={3} defaultValue={profile?.vision ?? ''} />
                <Textarea id="mission" name="mission" label="Mission" rows={3} defaultValue={profile?.mission ?? ''} />
                <Input id="stadiumName" name="stadiumName" label="Stadium Name" defaultValue={profile?.stadiumName ?? ''} />
                <Input id="stadiumAddress" name="stadiumAddress" label="Stadium Address" defaultValue={profile?.stadiumAddress ?? ''} />
              </div>
            ),
          },
          {
            key: 'contact',
            label: 'Contact & Social',
            content: (
              <div className="flex flex-col gap-5">
                <Input id="contactEmail" name="contactEmail" type="email" label="Contact Email" defaultValue={profile?.contactEmail ?? ''} error={fieldErrors?.contactEmail?.[0]} />
                <Input id="contactPhone" name="contactPhone" label="Contact Phone" defaultValue={profile?.contactPhone ?? ''} error={fieldErrors?.contactPhone?.[0]} />
                <Textarea id="contactAddress" name="contactAddress" label="Contact Address" rows={2} defaultValue={profile?.contactAddress ?? ''} />
                <Input id="facebookUrl" name="facebookUrl" label="Facebook URL" defaultValue={profile?.facebookUrl ?? ''} error={fieldErrors?.facebookUrl?.[0]} />
                <Input id="instagramUrl" name="instagramUrl" label="Instagram URL" defaultValue={profile?.instagramUrl ?? ''} error={fieldErrors?.instagramUrl?.[0]} />
                <Input id="twitterUrl" name="twitterUrl" label="X / Twitter URL" defaultValue={profile?.twitterUrl ?? ''} error={fieldErrors?.twitterUrl?.[0]} />
                <Input id="youtubeUrl" name="youtubeUrl" label="YouTube URL" defaultValue={profile?.youtubeUrl ?? ''} error={fieldErrors?.youtubeUrl?.[0]} />
                <Input id="tiktokUrl" name="tiktokUrl" label="TikTok URL" defaultValue={profile?.tiktokUrl ?? ''} error={fieldErrors?.tiktokUrl?.[0]} />
              </div>
            ),
          },
          {
            key: 'seo',
            label: 'SEO & Homepage',
            content: (
              <div className="flex flex-col gap-5">
                <Input
                  id="seoDefaultTitle"
                  name="seoDefaultTitle"
                  label="Default SEO Title"
                  hint="Fallback title suffix for pages without one of their own (max 70 characters)."
                  defaultValue={profile?.seoDefaultTitle ?? ''}
                />
                <Textarea
                  id="seoDefaultDescription"
                  name="seoDefaultDescription"
                  label="Default SEO Description"
                  rows={3}
                  hint="Fallback meta description (max 200 characters)."
                  defaultValue={profile?.seoDefaultDescription ?? ''}
                />
                <AdminImageUpload
                  bucket="club-assets"
                  name="homepageHeroImageUrl"
                  label="Homepage Hero Background"
                  initialUrl={profile?.homepageHeroImageUrl}
                />
              </div>
            ),
          },
        ]}
      />

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state?.success && <p className="text-sm text-cyan">Settings saved.</p>}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      Save Settings
    </Button>
  );
}
