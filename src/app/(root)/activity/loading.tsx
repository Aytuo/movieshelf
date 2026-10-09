import { PageHeaderSkeleton } from '@/components/ui/page-skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="container-content py-12 lg:py-16">
      <PageHeaderSkeleton />

      <section className="py-10 lg:py-14">
        <div className="space-y-6">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex gap-5 md:gap-8">
              <Skeleton className="size-10 shrink-0 rounded-full" />

              <div className="flex min-w-0 flex-1 gap-4 rounded-2xl p-4 surface">
                <Skeleton className="aspect-[2/3] w-20 shrink-0 rounded-lg" />

                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-4">
                    <Skeleton className="h-5 w-48 max-w-[60%]" />
                    <Skeleton className="h-3 w-24" />
                  </div>

                  <Skeleton className="mt-3 h-4 w-2/3" />
                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-4/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
