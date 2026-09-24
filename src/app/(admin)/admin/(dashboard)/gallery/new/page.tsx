import { AlbumForm } from '../AlbumForm';
import { createAlbumAction } from '@/actions/gallery.actions';

export default function NewAlbumPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">New Album</h1>
      <AlbumForm action={createAlbumAction} />
    </div>
  );
}
