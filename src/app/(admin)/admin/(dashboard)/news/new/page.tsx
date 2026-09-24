import { Breadcrumb } from '@/components/cms/Breadcrumb';
import { getNewsCategories } from '@/lib/data';
import { createNewsArticleAction } from '@/actions/news.actions';
import { NewsArticleForm } from '../NewsArticleForm';

export default async function NewNewsArticlePage() {
  const categories = await getNewsCategories();

  return (
    <div>
      <Breadcrumb items={[{ label: 'News & Articles', href: '/admin/news' }, { label: 'New' }]} />
      <h1 className="mb-6 mt-2 font-display text-2xl text-ink">New Article</h1>
      <NewsArticleForm categories={categories} action={createNewsArticleAction} />
    </div>
  );
}
