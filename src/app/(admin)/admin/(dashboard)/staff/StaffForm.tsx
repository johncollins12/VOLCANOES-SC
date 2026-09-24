'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input, Textarea } from '@/components/forms';
import { Select } from '@/components/forms/Select';
import { AdminImageUpload } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import type { ActionResult } from '@/types';
import type { StaffEditData, StaffCategoryOption } from '@/lib/data/staff';

interface StaffFormProps {
  categories: StaffCategoryOption[];
  staff?: StaffEditData;
  action: (prevState: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
}

export function StaffForm({ categories, staff, action }: StaffFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <Input id="fullName" name="fullName" label="Full Name" required defaultValue={staff?.fullName} error={fieldErrors?.fullName?.[0]} />
      <Input
        id="role"
        name="role"
        label="Role / Title"
        hint='e.g. "Head Coach", "Club Chairman"'
        required
        defaultValue={staff?.role}
        error={fieldErrors?.role?.[0]}
      />

      <AdminImageUpload bucket="staff-photos" name="photoUrl" label="Photo" initialUrl={staff?.photoUrl} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          id="categoryId"
          name="categoryId"
          label="Category"
          required
          placeholder="Select a category"
          defaultValue={staff?.categoryId ?? ''}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          error={fieldErrors?.categoryId?.[0]}
        />
        <Input
          id="displayOrder"
          name="displayOrder"
          type="number"
          min={0}
          label="Display Order"
          hint="Lower numbers appear first within their category."
          defaultValue={staff?.displayOrder ?? 0}
        />
      </div>

      <Textarea id="bio" name="bio" label="Biography" rows={5} defaultValue={staff?.bio ?? ''} />

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton isEdit={!!staff} />
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      {isEdit ? 'Save Changes' : 'Create Staff Member'}
    </Button>
  );
}
