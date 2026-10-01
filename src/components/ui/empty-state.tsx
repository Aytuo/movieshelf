import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon: LucideIcon;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
};

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn('text-center', className)}>
      <div
        className={cn(
          'mx-auto flex items-center justify-center rounded-full bg-surface-hover text-muted-foreground',
          compact ? 'size-9' : 'size-10'
        )}
      >
        <Icon className={compact ? 'size-4' : 'size-5'} />
      </div>

      {title && (
        <h2
          className={cn(
            'font-heading font-semibold',
            compact ? 'mt-3 text-sm' : 'mt-4 text-xl'
          )}
        >
          {title}
        </h2>
      )}

      {description && (
        <p
          className={cn(
            'mx-auto text-muted-foreground',
            compact
              ? 'mt-1 max-w-sm text-xs leading-5'
              : 'mt-2 max-w-md text-sm leading-6'
          )}
        >
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
