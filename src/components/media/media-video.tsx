import type { MediaVideo } from '@/lib/media';

type MediaVideoProps = {
  video: MediaVideo | null;
};

const MediaVideo = ({ video }: MediaVideoProps) => {
  if (!video || video.site !== 'YouTube') {
    return null;
  }

  return (
    <section className="border-y border-border/60 bg-surface/20">
      <div className="container-content py-14 lg:py-20">
        <div className="mb-7">
          <p className="eyebrow">Watch the trailer</p>

          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
            Trailer
          </h2>
        </div>

        <div className="mx-auto aspect-video max-w-5xl overflow-hidden rounded-2xl border border-border bg-black shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${video.key}`}
            title={video.name}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default MediaVideo;
