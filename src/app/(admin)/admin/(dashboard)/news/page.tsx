import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { URLPagination } from '@/components/cms/URLPagination';
import { getAdminNewsList, getNewsCategories } from '@/lib/data';
import { AdminNewsFilters } from './AdminNewsFilters';
import { NewsTable } from './NewsTable';

interface AdminNewsPageProps {
  searchParams: Promise<{ page?: string; status?: string; category?: string; q?: string }>;
}

export default async function AdminNewsPage({ searchParams }: AdminNewsPageProps) {
  const { page: pageParam, status, category, q } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [articles, categories] = await Promise.all([
    getAdminNewsList({ page, pageSize: 15, status, categoryId: category, query: q }),
    getNewsCategories(),
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-ink">News & Articles</h1>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            New Article
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <AdminNewsFilters categories={categories} />
      </div>

      <NewsTable items={articles.items} />

      <URLPagination page={articles.page} totalPages={articles.totalPages} className="mt-4" />
    </div>
  );
}