import type { Comment } from '@/types';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

type CommentCardProps = {
  comment: Comment;
  depth?: number;
  onReply?: (commentId: string) => void;
};

const CommentCard = ({ comment, depth = 0, onReply }: CommentCardProps) => {
  const { author } = comment;
  const authorLabel = author.displayName || `@${author.username}`;

  const isReply = depth > 0;

  return (
    <article
      className={[
        'rounded-2xl p-5 surface',
        isReply ? 'ml-8 sm:ml-12' : '',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <Link
          href={`/profile/${author.username}`}
          className="group flex shrink-0"
        >
          <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-surface-hover text-xs font-semibold">
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
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                href={`/profile/${author.username}`}
                className="text-sm font-semibold transition-colors hover:text-primary"
              >
                {authorLabel}
              </Link>

              <p className="truncate text-xs text-muted-foreground">
                @{author.username}
              </p>
            </div>

            <time
              dateTime={comment.createdAt.toISOString()}
              className="shrink-0 text-xs text-muted-foreground"
            >
              {comment.createdAt.toLocaleDateString()}
            </time>
          </div>

          <p className="mt-4 text-sm leading-7 whitespace-pre-line text-muted-foreground">
            {comment.content}
          </p>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => onReply?.(comment.id)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessageCircle className="size-3.5" />
              Reply
            </button>
          </div>
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </article>
  );
};

export default CommentCard;
