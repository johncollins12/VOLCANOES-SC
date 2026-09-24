'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input, Textarea } from '@/components/forms';
import { AdminImageUpload } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import type { ActionResult } from '@/types';

interface AlbumFormProps {
  album?: { title: string; description: string | null; coverImageUrl?: string | null; displayOrder?: number };
  action: (prevState: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
}

/** Album metadata only (title/description/cover/order) — photo management for an existing album happens on the edit page itself, via AlbumImageManager, once the album exists to attach images to. */
export function AlbumForm({ album, action }: AlbumFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <Input id="title" name="title" label="Album Title" required defaultValue={album?.title} error={fieldErrors?.title?.[0]} />
      <Textarea id="description" name="description" label="Description" rows={3} defaultValue={album?.description ?? ''} />
      <AdminImageUpload bucket="gallery" name="coverImageUrl" label="Cover Image" initialUrl={album?.coverImageUrl} />
      <Input
        id="displayOrder"
        name="displayOrder"
        type="number"
        min={0}
        label="Display Order"
        hint="Lower numbers appear first."
        defaultValue={album?.displayOrder ?? 0}
      />

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton isEdit={!!album} />
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      {isEdit ? 'Save Changes' : 'Create Album'}
    </Button>
  );
}
