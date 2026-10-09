import {
  PageHeaderSkeleton,
  RankingListSkeleton,
} from '@/components/ui/page-skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="container-content py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <PageHeaderSkeleton />

        <div className="mt-6 flex justify-end">
          <div className="inline-flex gap-1 rounded-lg border border-border bg-surface p-1">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>

        <div className="mt-10">
          <RankingListSkeleton count={10} />
        </div>
      </div>
    </main>
  );
}
