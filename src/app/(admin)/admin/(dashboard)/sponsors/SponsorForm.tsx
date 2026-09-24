'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/forms';
import { Select } from '@/components/forms/Select';
import { AdminImageUpload } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import type { ActionResult } from '@/types';
import type { SponsorEditData, SponsorTierOption } from '@/lib/data/sponsors';

interface SponsorFormProps {
  tiers: SponsorTierOption[];
  sponsor?: SponsorEditData;
  action: (prevState: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
}

export function SponsorForm({ tiers, sponsor, action }: SponsorFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <Input id="name" name="name" label="Sponsor Name" required defaultValue={sponsor?.name} error={fieldErrors?.name?.[0]} />

      <AdminImageUpload bucket="sponsor-logos" name="logoUrl" label="Logo" initialUrl={sponsor?.logoUrl} />

      <Input
        id="websiteUrl"
        name="websiteUrl"
        type="url"
        label="Website URL"
        placeholder="https://"
        defaultValue={sponsor?.websiteUrl ?? ''}
        error={fieldErrors?.websiteUrl?.[0]}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          id="tierId"
          name="tierId"
          label="Tier"
          placeholder="No tier"
          defaultValue={sponsor?.tierId ?? ''}
          options={tiers.map((t) => ({ value: t.id, label: t.name }))}
        />
        <Input
          id="displayOrder"
          name="displayOrder"
          type="number"
          min={0}
          label="Display Order"
          hint="Lower numbers appear first within their tier."
          defaultValue={sponsor?.displayOrder ?? 0}
        />
      </div>

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton isEdit={!!sponsor} />
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      {isEdit ? 'Save Changes' : 'Create Sponsor'}
    </Button>
  );
}
