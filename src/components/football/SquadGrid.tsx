'use client';

import { useMemo, useState } from 'react';
import { PlayerCard } from './PlayerCard';
import { RadioGroup } from '@/components/forms/Radio';
import { SearchBox } from '@/components/forms/SearchBox';
import { EmptyState } from '@/components/ui/Feedback';
import type { PlayerSummary } from '@/lib/data/players';

const POSITION_OPTIONS = [
  { value: 'ALL', label: 'All Players' },
  { value: 'Goalkeeper', label: 'Goalkeepers' },
  { value: 'Defender', label: 'Defenders' },
  { value: 'Midfielder', label: 'Midfielders' },
  { value: 'Forward', label: 'Forwards' },
];

/**
 * Interactive squad browser for /team: position filter + name search over
 * an already-fetched player list (see getFullSquad in
 * src/lib/data/players.ts — the page fetches once, server-side; this
 * component only filters client-side, which is appropriate for a squad
 * of ~20-30 players, not something that needs its own paginated queries).
 *
 * Built from existing components (RadioGroup, SearchBox, PlayerCard) —
 * the only new code here is the filter/search state and the "no players
 * match" empty state, which didn't exist anywhere else to reuse.
 */
export function SquadGrid({ players }: { players: PlayerSummary[] }) {
  const [position, setPosition] = useState<string>('ALL');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return players.filter((p) => {
      const matchesPosition = position === 'ALL' || p.position === position;
      const matchesQuery = query.trim() === '' || p.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesPosition && matchesQuery;
    });
  }, [players, position, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <RadioGroup
          name="position-filter"
          legend="Filter by position"
          options={POSITION_OPTIONS}
          value={position}
          onChange={setPosition}
          className="flex-row flex-wrap gap-x-5 gap-y-2"
        />
        <div className="w-full sm:w-64">
          <SearchBox id="squad-search" label="Search players" placeholder="Search by name…" onChange={setQuery} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No players found"
          description="Try a different position filter or search term."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((player) => (
            <PlayerCard
              key={player.id}
              name={player.name}
              jerseyNumber={player.jerseyNumber}
              position={player.position}
              nationality={player.nationality}
              photoUrl={player.photoUrl}
              href={`/team/${player.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
