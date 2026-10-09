import { PageHeaderSkeleton } from '@/components/ui/page-skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="container-content py-12 lg:py-16">
      <PageHeaderSkeleton />

      <section className="py-10 lg:py-14">
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex gap-4 rounded-2xl p-4 surface">
              <Skeleton className="aspect-[2/3] w-20 shrink-0 rounded-xl" />

              <div className="min-w-0 flex-1 py-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="mt-3 h-5 w-4/5" />
                <Skeleton className="mt-2 h-5 w-3/5" />
                <Skeleton className="mt-3 h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
