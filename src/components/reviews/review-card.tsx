import { EyeOff, Star } from 'lucide-react';

type ReviewCardProps = {
  review: {
    id: string;
    title: string | null;
    content: string;
    rating: number | null;
    containsSpoilers: boolean;
    createdAt: Date;
  };
  profile: {
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

const ReviewCard = ({ review, profile }: ReviewCardProps) => {
  return (
    <article className="rounded-2xl p-5 surface">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-surface-hover text-xs font-semibold">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              profile.username.slice(0, 1).toUpperCase()
            )}
          </div>

          <div>
            <p className="text-sm font-semibold">
              {profile.displayName || `@${profile.username}`}
            </p>

            <p className="text-xs text-muted-foreground">@{profile.username}</p>
          </div>
        </div>

        {review.rating && (
          <div className="inline-flex items-center gap-1 text-sm font-semibold text-rating">
            <Star className="size-3.5 fill-current" />
            {review.rating}/10
          </div>
        )}
      </div>

      {review.title && (
        <h3 className="mt-5 font-heading text-lg font-semibold">
          {review.title}
        </h3>
      )}

      {review.containsSpoilers ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <EyeOff className="size-3.5" />
              Contains spoilers — reveal review
            </span>
          </summary>

          <p className="mt-4 text-sm leading-7 whitespace-pre-line text-muted-foreground">
            {review.content}
          </p>
        </details>
      ) : (
        <p className="mt-4 text-sm leading-7 whitespace-pre-line text-muted-foreground">
          {review.content}
        </p>
      )}

      <p className="mt-5 text-xs text-muted-foreground">
        {review.createdAt.toLocaleDateString()}
      </p>
    </article>
  );
};

export default ReviewCard;
