import { cn } from '@/lib/utils';
import type { Post } from '@/types';
import { MessageCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { PostReactionButton } from './post-reaction-button';

type PostCardProps = {
  post: Post;
  variant?: 'preview' | 'full';
};

const PREVIEW_CONTENT_LENGTH = 280;

function getPreviewContent(content: string) {
  const normalized = content.trim();

  if (normalized.length <= PREVIEW_CONTENT_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, PREVIEW_CONTENT_LENGTH).trimEnd()}…`;
}

function formatRelativeTime(date: Date) {
  const secondsAgo = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000)
  );

  if (secondsAgo < 60) {
    return 'just now';
  }

  if (secondsAgo < 60 * 60) {
    return `${Math.floor(secondsAgo / 60)}m ago`;
  }

  if (secondsAgo < 60 * 60 * 24) {
    return `${Math.floor(secondsAgo / (60 * 60))}h ago`;
  }

  if (secondsAgo < 60 * 60 * 24 * 7) {
    return `${Math.floor(secondsAgo / (60 * 60 * 24))}d ago`;
  }

  if (secondsAgo < 60 * 60 * 24 * 30) {
    return `${Math.floor(secondsAgo / (60 * 60 * 24 * 7))}w ago`;
  }

  if (secondsAgo < 60 * 60 * 24 * 365) {
    return `${Math.floor(secondsAgo / (60 * 60 * 24 * 30))}mo ago`;
  }

  return `${Math.floor(secondsAgo / (60 * 60 * 24 * 365))}y ago`;
}

const PostCard = ({ post, variant = 'preview' }: PostCardProps) => {
  const { author } = post;
  const authorLabel = author.displayName || `@${author.username}`;

  const isPreview = variant === 'preview';

  return (
    <article
      className={cn('rounded-2xl surface', isPreview ? 'p-5' : 'p-6 sm:p-7')}
    >
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/profile/${author.username}`}
          className="group flex min-w-0 items-center gap-3"
        >
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-hover text-xs font-semibold">
            {author.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              author.username.slice(0, 1).toUpperCase()
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
              {authorLabel}
            </p>

            <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
              <span className="truncate">@{author.username}</span>
              {author.rating !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex shrink-0 items-center gap-1">
                    rated this{' '}
                    {post.media.type === 'movie' ? 'movie' : 'TV series'}{' '}
                    <span className="font-semibold text-foreground">
                      {author.rating}/10
                    </span>
                    <Star className="size-3 fill-current" aria-hidden="true" />
                  </span>
                </>
              )}
            </p>
          </div>
        </Link>

        <time
          dateTime={post.createdAt.toISOString()}
          className="shrink-0 text-xs text-muted-foreground"
        >
          {post.createdAt.toLocaleDateString()}
        </time>
      </div>

      {isPreview ? (
        <Link href={`/posts/${post.id}`} className="group block">
          <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          <p className="mt-3 line-clamp-4 text-sm leading-7 whitespace-pre-line text-muted-foreground">
            {getPreviewContent(post.content)}
          </p>

          <span className="mt-4 inline-block text-sm font-semibold text-primary">
            Read more →
          </span>
        </Link>
      ) : (
        <>
          <h1 className="mt-6 max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-6 max-w-3xl text-[15px] leading-8 whitespace-pre-line text-foreground/85">
            {post.content}
          </p>
        </>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/60 pt-4 text-xs font-semibold text-muted-foreground">
        <PostReactionButton
          postId={post.id}
          count={post.reactionCount}
          reacted={post.viewerHasReacted}
        />

        <span className="h-3 w-px bg-border" aria-hidden="true" />

        <Link
          href={`/posts/${post.id}#comments`}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <MessageCircle className="size-3.5" />

          <span>
            {post.commentCount} comment
            {post.commentCount === 1 ? '' : 's'}
          </span>
        </Link>

        {post.lastComment && (
          <>
            <span className="h-3 w-px bg-border" aria-hidden="true" />

            <Link
              href={`/posts/${post.id}#comments`}
              className="min-w-0 truncate font-normal text-muted-foreground transition-colors hover:text-foreground"
            >
              Latest comment by{' '}
              <span className="font-semibold text-foreground/80">
                {post.lastComment.author.displayName ||
                  `@${post.lastComment.author.username}`}
              </span>{' '}
              · {formatRelativeTime(post.lastComment.createdAt)}
            </Link>
          </>
        )}
      </div>
    </article>
  );
};

export default PostCard;
