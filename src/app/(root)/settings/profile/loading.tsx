import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-full max-w-md" />
      </header>

      {/* Profile image */}
      <section className="rounded-2xl border border-border p-5 surface sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Skeleton className="size-20 shrink-0 rounded-2xl" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-3 w-full max-w-lg" />
            <Skeleton className="mt-2 h-3 w-3/4 max-w-md" />
            <Skeleton className="mt-4 h-10 w-32 rounded-lg" />
            <Skeleton className="mt-3 h-3 w-40" />
          </div>
        </div>
      </section>

      {/* Public profile form */}
      <section className="rounded-2xl border border-border p-5 surface sm:p-7">
        <div className="mb-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-3 w-full max-w-md" />
        </div>

        <div className="space-y-5">
          <div>
            <Skeleton className="mb-2 h-3 w-20" />
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="mt-2 h-3 w-56 max-w-full" />
          </div>

          <div>
            <Skeleton className="mb-2 h-3 w-24" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>

          <div>
            <Skeleton className="mb-2 h-3 w-10" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="mt-2 ml-auto h-3 w-12" />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}
