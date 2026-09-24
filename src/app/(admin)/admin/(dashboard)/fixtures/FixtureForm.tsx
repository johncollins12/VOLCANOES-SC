'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/forms';
import { Select } from '@/components/forms/Select';
import { Checkbox } from '@/components/forms/Checkbox';
import { Button } from '@/components/ui/Button';
import type { ActionResult } from '@/types';
import type { FixtureEditData, VenueOption } from '@/lib/data/fixtures';
import type { CompetitionOption } from '@/lib/data/competitions';
import type { CurrentSeason } from '@/lib/data/season';

const STATUS_OPTIONS = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'LIVE', label: 'Live' },
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'POSTPONED', label: 'Postponed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

interface FixtureFormProps {
  seasons: CurrentSeason[];
  competitions: CompetitionOption[];
  venues: VenueOption[];
  fixture?: FixtureEditData;
  action: (prevState: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
}

/** Kickoff is stored as a full DateTime but <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in local time, not an ISO string with a Z suffix. */
function toDatetimeLocalValue(date?: Date): string {
  if (!date) return '';
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function FixtureForm({ seasons, competitions, venues, fixture, action }: FixtureFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          id="seasonId"
          name="seasonId"
          label="Season"
          required
          defaultValue={fixture?.seasonId}
          placeholder="Select a season"
          options={seasons.map((s) => ({ value: s.id, label: s.label }))}
        />
        <Select
          id="competitionId"
          name="competitionId"
          label="Competition"
          required
          defaultValue={fixture?.competitionId}
          placeholder="Select a competition"
          options={competitions.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="homeTeamName"
          name="homeTeamName"
          label="Home Team"
          required
          defaultValue={fixture?.homeTeamName ?? 'SC Volcanoes'}
          error={fieldErrors?.homeTeamName?.[0]}
        />
        <Input
          id="awayTeamName"
          name="awayTeamName"
          label="Away Team"
          required
          defaultValue={fixture?.awayTeamName}
          error={fieldErrors?.awayTeamName?.[0]}
        />
      </div>

      <Checkbox
        id="isHome"
        name="isHome"
        label="SC Volcanoes are the home side"
        description="Determines the Home/Away badge shown on the public site."
        defaultChecked={fixture?.isHome ?? true}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="kickoffAt"
          name="kickoffAt"
          type="datetime-local"
          label="Kickoff"
          required
          defaultValue={toDatetimeLocalValue(fixture?.kickoffAt)}
          error={fieldErrors?.kickoffAt?.[0]}
        />
        <Select
          id="venueId"
          name="venueId"
          label="Venue"
          placeholder="No venue set"
          defaultValue={fixture?.venueId ?? ''}
          options={venues.map((v) => ({ value: v.id, label: v.name }))}
        />
      </div>

      <Select
        id="status"
        name="status"
        label="Status"
        required
        defaultValue={fixture?.status ?? 'SCHEDULED'}
        options={STATUS_OPTIONS}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="homeScore"
          name="homeScore"
          type="number"
          min={0}
          label="Home Score"
          hint="Leave blank until the match has been played."
          defaultValue={fixture?.homeScore ?? ''}
        />
        <Input
          id="awayScore"
          name="awayScore"
          type="number"
          min={0}
          label="Away Score"
          hint="Leave blank until the match has been played."
          defaultValue={fixture?.awayScore ?? ''}
        />
      </div>

      <Checkbox
        id="ticketingEnabled"
        name="ticketingEnabled"
        label="Ticketing enabled for this fixture"
        defaultChecked={fixture?.ticketingEnabled ?? false}
      />

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton isEdit={!!fixture} />
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      {isEdit ? 'Save Changes' : 'Create Fixture'}
    </Button>
  );
}
