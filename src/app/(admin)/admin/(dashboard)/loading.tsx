import { Skeleton } from '@/components/feedback/Skeleton';

/** Loading fallback for the /admin tree while a page's Server Component data fetch is in flight. */
export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full max-w-xs" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
