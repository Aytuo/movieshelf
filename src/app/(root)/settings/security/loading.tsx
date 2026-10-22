import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-8 w-52" />
        <Skeleton className="mt-2 h-4 w-full max-w-md" />
      </header>

      {/* Password */}
      <section className="rounded-2xl border border-border p-5 surface sm:p-7">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-2 h-3 w-full max-w-lg" />
        <Skeleton className="mt-5 h-10 w-36 rounded-lg" />
      </section>

      {/* Active sessions */}
      <section className="rounded-2xl border border-border p-5 surface sm:p-7">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-3 w-full max-w-lg" />

        <div className="mt-6 divide-y divide-border/60">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
            >
              <Skeleton className="size-10 shrink-0 rounded-xl" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-40 max-w-full" />
                <Skeleton className="mt-2 h-3 w-56 max-w-full" />
              </div>

              <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* Delete account */}
      <section className="rounded-2xl border border-destructive/30 p-5 sm:p-7">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-3 w-full max-w-lg" />
        <Skeleton className="mt-2 h-3 w-3/4 max-w-md" />
        <Skeleton className="mt-5 h-10 w-36 rounded-lg" />
      </section>
    </div>
  );
}
