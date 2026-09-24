import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/cms/Breadcrumb';
import { getNewsCategories, getNewsArticleById } from '@/lib/data';
import { updateNewsArticleAction } from '@/actions/news.actions';
import { NewsArticleForm } from '../../NewsArticleForm';

interface EditNewsArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsArticlePage({ params }: EditNewsArticlePageProps) {
  const { id } = await params;
  const [categories, article] = await Promise.all([getNewsCategories(), getNewsArticleById(id)]);

  if (!article) notFound();

  return (
    <div>
      <Breadcrumb items={[{ label: 'News & Articles', href: '/admin/news' }, { label: article.title }]} />
      <h1 className="mb-6 mt-2 font-display text-2xl text-ink">Edit Article</h1>
      <NewsArticleForm categories={categories} article={article} action={updateNewsArticleAction.bind(null, id)} />
    </div>
  );
}
