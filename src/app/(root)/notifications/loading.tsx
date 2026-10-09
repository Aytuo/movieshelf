import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="container-content py-14 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />

        <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-surface">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="flex gap-3 border-b border-border/60 p-4 last:border-b-0"
            >
              <Skeleton className="size-10 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
