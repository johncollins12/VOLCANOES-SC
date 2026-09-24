'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/forms';
import { RichTextEditor } from '@/components/cms/RichTextEditor';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { Button } from '@/components/ui/Button';
import { saveMatchReportAction } from '@/actions/match-reports.actions';
import type { MatchReportEditData } from '@/lib/data/match-reports';

interface MatchReportFormProps {
  report: MatchReportEditData;
}

const STAT_LABELS = {
  possession: 'Possession (%)',
  shots: 'Shots',
  shotsOnTarget: 'Shots on Target',
  corners: 'Corners',
  fouls: 'Fouls',
} as const;

const STAT_FIELDS: { key: keyof typeof STAT_LABELS; label: string }[] = (
  ['possession', 'shots', 'shotsOnTarget', 'corners', 'fouls'] as const
).map((key) => ({ key, label: STAT_LABELS[key] }));

/**
 * Create/edit form for one fixture's match report + match statistics,
 * submitted together (see saveMatchReportAction's comment on why both
 * upsert in one action). Statistics are optional — every field can be
 * left blank, matching "match statistics (where available)" on the
 * public match report page (MatchStatistics.tsx skips any pair that's
 * still null on both sides).
 *
 * RichTextEditor and AdminImageUpload both need their values mirrored into
 * hidden inputs before this form submits — same pattern as
 * NewsArticleForm, since neither is a real named form control.
 */
export function MatchReportForm({ report }: MatchReportFormProps) {
  const action = saveMatchReportAction.bind(null, report.fixtureId);
  const [state, formAction] = useActionState(action, undefined);
  const [body, setBody] = useState(report.body);

  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const stats = report.statistics;

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-5">
      <Input id="title" name="title" label="Report Title" required defaultValue={report.title} error={fieldErrors?.title?.[0]} />

      <AdminImageUpload bucket="news-images" name="coverImageUrl" label="Cover Image" initialUrl={report.coverImageUrl} />

      <div>
        <input type="hidden" name="body" value={body} />
        <RichTextEditor id="body-editor" label="Report" value={body} onChange={setBody} error={fieldErrors?.body?.[0]} />
      </div>

      <fieldset className="rounded-card border border-border p-4">
        <legend className="px-1 text-sm font-semibold text-ink">Match Statistics (optional)</legend>
        <p className="mb-4 text-xs text-muted">
          Leave any field blank if that statistic wasn&apos;t recorded — it won&apos;t be shown on the public page.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {STAT_FIELDS.map(({ key, label }) => (
            <div key={key} className="grid grid-cols-2 gap-3">
              <Input
                id={`${key}Home`}
                name={`${key}Home`}
                type="number"
                label={`${label} — Home`}
                defaultValue={stats?.[`${key}Home` as keyof typeof stats] ?? ''}
              />
              <Input
                id={`${key}Away`}
                name={`${key}Away`}
                type="number"
                label={`${label} — Away`}
                defaultValue={stats?.[`${key}Away` as keyof typeof stats] ?? ''}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      Save Report
    </Button>
  );
}
