import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { cn } from '@/lib/utils';

export interface LeagueTableRow {
  position: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  /** Highlights the club's own row so it stands out in the standings. */
  isOwnTeam?: boolean;
  /**
   * Last-5-matches form, oldest first (e.g. ['L','D','W','W','W']).
   * SCHEMA LIMITATION: opponent teams are stored as free-text names on
   * Fixture (homeTeamName/awayTeamName), not as linked Team records with
   * their own fixture history — so form can only ever be computed for
   * Volcanoes FC's own row (see getFullLeagueTable in
   * src/lib/data/league-table.ts). Leave this undefined for every other
   * row rather than fabricating results the data can't support; the
   * column itself only renders where at least one row provides it.
   */
  form?: ('W' | 'D' | 'L')[];
}

const FORM_STYLES: Record<'W' | 'D' | 'L', string> = {
  W: 'bg-cyan/10 text-cyan',
  D: 'bg-surface-muted text-muted',
  L: 'bg-accent/10 text-accent',
};

export function LeagueTable({ rows }: { rows: LeagueTableRow[] }) {
  const hasForm = rows.some((r) => r.form && r.form.length > 0);

  return (
    <Table>
      <Thead>
        <Tr className="hover:bg-transparent">
          <Th className="w-10">#</Th>
          <Th>Team</Th>
          <Th className="text-center">P</Th>
          <Th className="hidden text-center sm:table-cell">W</Th>
          <Th className="hidden text-center sm:table-cell">D</Th>
          <Th className="hidden text-center sm:table-cell">L</Th>
          <Th className="hidden text-center md:table-cell">GF</Th>
          <Th className="hidden text-center md:table-cell">GA</Th>
          <Th className="hidden text-center md:table-cell">GD</Th>
          <Th className="text-center">Pts</Th>
          {hasForm && <Th className="hidden text-center lg:table-cell">Form</Th>}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.position} className={cn(row.isOwnTeam && 'bg-cyan/5 hover:bg-cyan/10')}>
            <Td className="font-mono text-muted">{row.position}</Td>
            <Td className={cn('font-medium', row.isOwnTeam && 'text-accent')}>{row.teamName}</Td>
            <Td className="text-center font-mono">{row.played}</Td>
            <Td className="hidden text-center font-mono sm:table-cell">{row.won}</Td>
            <Td className="hidden text-center font-mono sm:table-cell">{row.drawn}</Td>
            <Td className="hidden text-center font-mono sm:table-cell">{row.lost}</Td>
            <Td className="hidden text-center font-mono md:table-cell">{row.goalsFor}</Td>
            <Td className="hidden text-center font-mono md:table-cell">{row.goalsAgainst}</Td>
            <Td className="hidden text-center font-mono md:table-cell">{row.goalsFor - row.goalsAgainst}</Td>
            <Td className="text-center font-mono font-semibold">{row.points}</Td>
            {hasForm && (
              <Td className="hidden lg:table-cell">
                {row.form && row.form.length > 0 ? (
                  <div className="flex justify-center gap-1">
                    {row.form.map((result, i) => (
                      <span
                        key={i}
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                          FORM_STYLES[result]
                        )}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="block text-center text-muted">—</span>
                )}
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
