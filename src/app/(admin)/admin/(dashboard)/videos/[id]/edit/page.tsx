import { notFound } from 'next/navigation';
import { getVideoCategories, getVideoById } from '@/lib/data';
import { VideoForm } from '../../VideoForm';
import { updateVideoAction } from '@/actions/videos.actions';

interface EditVideoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVideoPage({ params }: EditVideoPageProps) {
  const { id } = await params;
  const [categories, video] = await Promise.all([getVideoCategories(), getVideoById(id)]);

  if (!video) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Edit Video</h1>
      <VideoForm categories={categories} video={video} action={updateVideoAction.bind(null, id)} />
    </div>
  );
}
