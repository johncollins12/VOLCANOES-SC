'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input, Textarea } from '@/components/forms';
import { Select } from '@/components/forms/Select';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { Button } from '@/components/ui/Button';
import type { ActionResult } from '@/types';
import type { NewsCategoryOption, NewsArticleEditData } from '@/lib/data/news';

interface NewsArticleFormProps {
  categories: NewsCategoryOption[];
  article?: NewsArticleEditData;
  action: (prevState: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
}

/**
 * Shared create/edit form. RichTextEditor, like ImageUploadField, has no
 * `name` attribute (it's a contentEditable div, not a real form input) —
 * its value is mirrored into a hidden <input name="body"> here, same
 * pattern as AdminImageUpload's hidden URL field.
 */
export function NewsArticleForm({ categories, article, action }: NewsArticleFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const [body, setBody] = useState(article?.body ?? '');

  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-5">
      <Input id="title" name="title" label="Title" required defaultValue={article?.title} error={fieldErrors?.title?.[0]} />

      <Textarea
        id="excerpt"
        name="excerpt"
        label="Excerpt"
        hint="Short summary shown on the news list and social previews (optional)."
        rows={3}
        defaultValue={article?.excerpt ?? ''}
        error={fieldErrors?.excerpt?.[0]}
      />

      <Select
        id="categoryId"
        name="categoryId"
        label="Category"
        placeholder="No category"
        defaultValue={article?.categoryId ?? ''}
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
      />

      <AdminImageUpload bucket="news-images" name="coverImageUrl" label="Cover Image" initialUrl={article?.coverImageUrl} />

      <div>
        <input type="hidden" name="body" value={body} />
        <RichTextEditor id="body-editor" label="Body" value={body} onChange={setBody} error={fieldErrors?.body?.[0]} />
      </div>

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton isEdit={!!article} />
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      {isEdit ? 'Save Changes' : 'Create Article'}
    </Button>
  );
}
