import type { TvSeason } from '@/lib/media';
import TvSeasonItem from './tv-season';

type TvSeasonsProps = {
  tvId: number;
  seasons: TvSeason[];
};

const TvSeasons = ({ tvId, seasons }: TvSeasonsProps) => {
  const visibleSeasons = seasons.filter((season) => season.seasonNumber >= 0);

  if (visibleSeasons.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border/60 bg-surface/20">
      <div className="container-content py-14 lg:py-20">
        <div className="mb-8">
          <p className="eyebrow">Series information</p>

          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
            Seasons
          </h2>
        </div>

        <div className="space-y-3">
          {visibleSeasons.map((season) => (
            <TvSeasonItem key={season.id} tvId={tvId} season={season} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TvSeasons;
