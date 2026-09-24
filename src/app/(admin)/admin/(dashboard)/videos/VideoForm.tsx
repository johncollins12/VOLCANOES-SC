'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input, Textarea, Checkbox } from '@/components/forms';
import { Select } from '@/components/forms/Select';
import { AdminImageUpload } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import type { ActionResult } from '@/types';
import type { VideoEditData, VideoCategoryOption } from '@/lib/data/videos';

const PROVIDER_OPTIONS = [
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'VIMEO', label: 'Vimeo (embed not yet supported — see VideoEmbed.tsx)' },
  { value: 'SUPABASE_STORAGE', label: 'Direct upload (not yet supported — see VideoEmbed.tsx)' },
];

interface VideoFormProps {
  categories: VideoCategoryOption[];
  video?: VideoEditData;
  action: (prevState: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
}

/**
 * Provider options intentionally include VIMEO/SUPABASE_STORAGE even
 * though VideoEmbed only renders YouTube today — the schema and this form
 * support recording them (so staff aren't blocked from entering the
 * data), the label just sets accurate expectations about what the public
 * page will currently show.
 */
export function VideoForm({ categories, video, action }: VideoFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <Input id="title" name="title" label="Title" required defaultValue={video?.title} error={fieldErrors?.title?.[0]} />
      <Textarea id="description" name="description" label="Description" rows={3} defaultValue={video?.description ?? ''} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          id="provider"
          name="provider"
          label="Provider"
          required
          defaultValue={video?.provider ?? 'YOUTUBE'}
          options={PROVIDER_OPTIONS}
        />
        <Select
          id="categoryId"
          name="categoryId"
          label="Category"
          placeholder="No category"
          defaultValue={video?.categoryId ?? ''}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>

      <Input
        id="externalUrl"
        name="externalUrl"
        type="url"
        label="Video URL"
        placeholder="https://www.youtube.com/watch?v=..."
        defaultValue={video?.externalUrl ?? ''}
      />

      <AdminImageUpload bucket="video-thumbnails" name="thumbnailUrl" label="Thumbnail" initialUrl={video?.thumbnailUrl} />

      <Checkbox id="isFeatured" name="isFeatured" label="Featured video" defaultChecked={video?.isFeatured ?? false} />

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton isEdit={!!video} />
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      {isEdit ? 'Save Changes' : 'Create Video'}
    </Button>
  );
}
