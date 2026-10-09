import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        'rounded-md bg-surface-hover motion-safe:animate-pulse',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
