import { getVideoCategories } from '@/lib/data';
import { VideoForm } from '../VideoForm';
import { createVideoAction } from '@/actions/videos.actions';

export default async function NewVideoPage() {
  const categories = await getVideoCategories();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">New Video</h1>
      <VideoForm categories={categories} action={createVideoAction} />
    </div>
  );
}
