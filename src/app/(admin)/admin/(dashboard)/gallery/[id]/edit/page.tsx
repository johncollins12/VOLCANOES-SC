import { notFound } from 'next/navigation';
import { getAlbumById } from '@/lib/data';
import { AlbumForm } from '../../AlbumForm';
import { AlbumImageManager } from './AlbumImageManager';
import { updateAlbumAction } from '@/actions/gallery.actions';

interface EditAlbumPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: EditAlbumPageProps) {
  const { id } = await params;
  const album = await getAlbumById(id);

  if (!album) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="mb-6 font-display text-2xl text-ink">Edit Album</h1>
        <AlbumForm album={album} action={updateAlbumAction.bind(null, id)} />
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl text-ink">Photos</h2>
        <AlbumImageManager albumId={album.id} images={album.images} />
      </div>
    </div>
  );
}
