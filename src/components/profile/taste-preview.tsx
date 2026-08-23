import Link from 'next/link';

type TastePreviewProps = {
  taste: TasteProfile;
  username: string;
};

const TastePreview = ({ taste, username }: TastePreviewProps) => {
  return (
    <div className="rounded-2xl p-6 surface">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
            Top genres
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {taste.topGenres.slice(0, 4).map((genre) => (
              <span
                key={genre.name}
                className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted-foreground"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
            Average rating
          </p>

          <p className="mt-4 font-heading text-4xl font-bold">
            {taste.averageRating ?? '—'}
          </p>

          <Link
            href={`/profile/${username}/taste`}
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            See your full taste profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TastePreview;
