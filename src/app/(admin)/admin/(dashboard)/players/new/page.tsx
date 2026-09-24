import { getPositions } from '@/lib/data';
import { PlayerForm } from '../PlayerForm';
import { createPlayerAction } from '@/actions/players.actions';

export default async function NewPlayerPage() {
  const positions = await getPositions();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">New Player</h1>
      <PlayerForm positions={positions} action={createPlayerAction} />
    </div>
  );
}
