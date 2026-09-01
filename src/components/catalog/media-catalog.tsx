import RankedMediaList from '@/components/catalog/ranked-media-list';
import MediaCarousel from '@/components/media/media-carousel';
import type { Media } from '@/lib/media';

type MediaCatalogCarouselBlock = {
  type: 'carousel';
  eyebrow?: string;
  title: string;
  description?: string;
  media: Media[];
};

type MediaCatalogRankingBlock = {
  type: 'ranking';
  eyebrow?: string;
  title: string;
  description?: string;
  media: Media[];
};

export type MediaCatalogBlock =
  MediaCatalogCarouselBlock | MediaCatalogRankingBlock;

type MediaCatalogProps = {
  eyebrow: string;
  title: string;
  description: string;
  blocks: MediaCatalogBlock[];
};

const MediaCatalog = ({
  eyebrow,
  title,
  description,
  blocks,
}: MediaCatalogProps) => {
  return (
    <main className="container-content py-12 lg:py-16">
      <header>
        <p className="eyebrow">{eyebrow}</p>

        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </header>

      <div className="mt-10 space-y-14 lg:mt-14 lg:space-y-20">
        {blocks.map((block, index) => {
          if (block.type === 'carousel') {
            return (
              <MediaCarousel
                key={`${block.type}-${block.title}-${index}`}
                eyebrow={block.eyebrow}
                title={block.title}
                description={block.description}
                media={block.media.slice(0, 20)}
              />
            );
          }

          return (
            <RankedMediaList
              key={`${block.type}-${block.title}-${index}`}
              eyebrow={block.eyebrow}
              title={block.title}
              description={block.description}
              media={block.media.slice(0, 10)}
            />
          );
        })}
      </div>
    </main>
  );
};

export default MediaCatalog;
