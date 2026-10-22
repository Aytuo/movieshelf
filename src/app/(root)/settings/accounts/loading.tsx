import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
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
