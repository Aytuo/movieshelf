import type { Post } from '@/types';
import Link from 'next/link';

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

const PostCard = ({ post, variant = 'preview' }: PostCardProps) => {
  const { author } = post;
  const authorLabel = author.displayName || `@${author.username}`;
  const isPreview = variant === 'preview';

  return (
    <article className="rounded-2xl p-5 surface">
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

            <p className="truncate text-xs text-muted-foreground">
              @{author.username}
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
          <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {post.title}
          </h1>

          <p className="mt-5 text-sm leading-7 whitespace-pre-line text-muted-foreground">
            {post.content}
          </p>
        </>
      )}
    </article>
  );
};

export default PostCard;
