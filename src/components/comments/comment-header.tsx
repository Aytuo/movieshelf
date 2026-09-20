import { Star } from 'lucide-react';
import Link from 'next/link';

type CommentHeaderProps = {
  author: {
    userId: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    rating: number | null;
  };
  mediaType: 'movie' | 'tv';
  updatedAt: Date;
  createdAt: Date;
};

function formatCommentDate(date: Date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function CommentHeader({
  author,
  mediaType,
  updatedAt,
  createdAt,
}: CommentHeaderProps) {
  const authorLabel = author.displayName || `@${author.username}`;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <Link
          href={`/profile/${author.username}`}
          className="text-sm font-semibold transition-colors hover:text-primary"
        >
          {authorLabel}
        </Link>

        <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
          <span className="truncate">@{author.username}</span>

          {author.rating !== null && (
            <>
              <span aria-hidden="true">·</span>

              <span className="inline-flex min-w-0 items-center gap-1">
                <span className="truncate">
                  rated this {mediaType === 'movie' ? 'movie' : 'TV series'}
                </span>

                <span className="inline-flex shrink-0 items-center gap-0.5 font-semibold text-foreground">
                  {author.rating}/10
                  <Star className="size-3 fill-current" aria-hidden="true" />
                </span>
              </span>
            </>
          )}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <time
          dateTime={updatedAt.toISOString()}
          title={updatedAt.toLocaleString()}
          className="text-xs text-muted-foreground"
        >
          {formatCommentDate(updatedAt)}
        </time>

        {updatedAt.getTime() > createdAt.getTime() && (
          <span className="text-xs text-muted-foreground">· edited</span>
        )}
      </div>
    </div>
  );
}
