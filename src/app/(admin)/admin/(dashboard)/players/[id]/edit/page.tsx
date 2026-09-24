import { notFound } from 'next/navigation';
import { getPositions, getPlayerForEdit } from '@/lib/data';
import { PlayerForm } from '../../PlayerForm';
import { updatePlayerAction } from '@/actions/players.actions';

interface EditPlayerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlayerPage({ params }: EditPlayerPageProps) {
  const { id } = await params;
  const [positions, player] = await Promise.all([getPositions(), getPlayerForEdit(id)]);

  if (!player) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Edit Player</h1>
      <PlayerForm positions={positions} player={player} action={updatePlayerAction.bind(null, id)} />
    </div>
  );
}
