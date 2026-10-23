import { Skeleton } from '@/components/ui/skeleton';

export function SettingsProfileSkeleton() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-full max-w-md" />
      </header>

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

export function SettingsSecuritySkeleton() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-8 w-52" />
        <Skeleton className="mt-2 h-4 w-full max-w-md" />
      </header>

      <section className="rounded-2xl border border-border p-5 surface sm:p-7">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-2 h-3 w-full max-w-lg" />
        <Skeleton className="mt-5 h-10 w-36 rounded-lg" />
      </section>

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

      <section className="rounded-2xl border border-destructive/30 p-5 sm:p-7">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-3 w-full max-w-lg" />
        <Skeleton className="mt-2 h-3 w-3/4 max-w-md" />
        <Skeleton className="mt-5 h-10 w-36 rounded-lg" />
      </section>
    </div>
  );
}

export function SettingsAccountsSkeleton() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-full max-w-md" />
      </header>

      <div className="divide-y divide-border/60 rounded-2xl border border-border surface">
        {['email', 'google', 'discord'].map((provider) => (
          <div
            key={provider}
            className="flex items-center justify-between gap-4 p-5"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <Skeleton className="size-10 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-3 w-40 max-w-full" />
              </div>
            </div>

            <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
