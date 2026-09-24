'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Input, Textarea } from '@/components/forms';
import { Select } from '@/components/forms/Select';
import { AdminImageUpload } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import type { ActionResult } from '@/types';
import type { PlayerEditData, PositionOption } from '@/lib/data/players';

interface PlayerFormProps {
  positions: PositionOption[];
  player?: PlayerEditData;
  action: (prevState: ActionResult | undefined, formData: FormData) => Promise<ActionResult>;
}

/** Date fields are stored as full DateTime but <input type="date"> needs "YYYY-MM-DD". */
function toDateInputValue(date?: Date | null): string {
  if (!date) return '';
  return new Date(date).toISOString().slice(0, 10);
}

export function PlayerForm({ positions, player, action }: PlayerFormProps) {
  const [state, formAction] = useActionState(action, undefined);
  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const stats = player?.currentSeasonStats;
  const isGoalkeeper = positions.find((p) => p.id === player?.positionId)?.name === 'Goalkeeper';

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <Input id="fullName" name="fullName" label="Full Name" required defaultValue={player?.fullName} error={fieldErrors?.fullName?.[0]} />

      <AdminImageUpload bucket="player-photos" name="photoUrl" label="Player Photo" initialUrl={player?.photoUrl} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="jerseyNumber"
          name="jerseyNumber"
          type="number"
          min={0}
          max={99}
          label="Jersey Number"
          defaultValue={player?.jerseyNumber ?? ''}
          error={fieldErrors?.jerseyNumber?.[0]}
        />
        <Select
          id="positionId"
          name="positionId"
          label="Position"
          placeholder="Select a position"
          defaultValue={player?.positionId ?? ''}
          options={positions.map((p) => ({ value: p.id, label: p.name }))}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="nationality" name="nationality" label="Nationality" defaultValue={player?.nationality ?? ''} />
        <Input id="heightCm" name="heightCm" type="number" min={100} max={250} label="Height (cm)" defaultValue={player?.heightCm ?? ''} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input id="dateOfBirth" name="dateOfBirth" type="date" label="Date of Birth" defaultValue={toDateInputValue(player?.dateOfBirth)} />
        <Input id="joinedDate" name="joinedDate" type="date" label="Joined Club" defaultValue={toDateInputValue(player?.joinedDate)} />
      </div>

      <Textarea id="bio" name="bio" label="Biography" rows={5} defaultValue={player?.bio ?? ''} />

      {player && (
        <fieldset className="rounded-card border border-border p-4">
          <legend className="px-1 text-sm font-semibold text-ink">Current Season Statistics (optional)</legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input id="appearances" name="appearances" type="number" min={0} label="Appearances" defaultValue={stats?.appearances ?? ''} />
            <Input id="goals" name="goals" type="number" min={0} label="Goals" defaultValue={stats?.goals ?? ''} />
            <Input id="assists" name="assists" type="number" min={0} label="Assists" defaultValue={stats?.assists ?? ''} />
            <Input id="yellowCards" name="yellowCards" type="number" min={0} label="Yellow Cards" defaultValue={stats?.yellowCards ?? ''} />
            <Input id="redCards" name="redCards" type="number" min={0} label="Red Cards" defaultValue={stats?.redCards ?? ''} />
            <Input id="minutesPlayed" name="minutesPlayed" type="number" min={0} label="Minutes Played" defaultValue={stats?.minutesPlayed ?? ''} />
          </div>

          {isGoalkeeper && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Goalkeeper Statistics</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <Input id="cleanSheets" name="cleanSheets" type="number" min={0} label="Clean Sheets" defaultValue={stats?.cleanSheets ?? ''} />
                <Input id="saves" name="saves" type="number" min={0} label="Saves" defaultValue={stats?.saves ?? ''} />
                <Input id="savePercentage" name="savePercentage" type="number" min={0} max={100} label="Save %" defaultValue={stats?.savePercentage ?? ''} />
                <Input id="penaltiesSaved" name="penaltiesSaved" type="number" min={0} label="Penalties Saved" defaultValue={stats?.penaltiesSaved ?? ''} />
                <Input id="goalsConceded" name="goalsConceded" type="number" min={0} label="Goals Conceded" defaultValue={stats?.goalsConceded ?? ''} />
              </div>
            </div>
          )}
        </fieldset>
      )}

      {state && !state.success && !fieldErrors && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton isEdit={!!player} />
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} className="self-start">
      {isEdit ? 'Save Changes' : 'Create Player'}
    </Button>
  );
}
