import { BookmarkCheck, Film, Heart } from 'lucide-react';

const AuthVisual = () => {
  return (
    <aside
      aria-hidden="true"
      className="sticky top-0 hidden h-screen self-start overflow-hidden border-l border-border/50 bg-black lg:block"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/38131980/pexels-photo-38131980.jpeg?cs=srgb&dl=pexels-atai-anarbek-2160540497-38131980.jpg&fm=jpg)',
        }}
      />

      <div className="absolute inset-0 bg-black/15" />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/5 to-black/20" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_38%,rgba(239,68,68,0.06),transparent_45%)]" />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-soft-light">
        <div className="size-full bg-[url('/textures/noise.svg')]" />
      </div>

      {/* Editorial frame */}
      <div className="absolute inset-8 rounded-[1.75rem] border border-white/10" />

      {/* Product highlights */}
      <div className="absolute inset-x-8 bottom-10 xl:inset-x-12 xl:bottom-12">
        <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
          <div className="min-w-0 px-2 text-center">
            <div className="flex items-center justify-center gap-2.5">
              <Film className="size-5 shrink-0 text-primary" />

              <p className="text-xs font-semibold text-white/90 xl:text-sm">
                Your titles
              </p>
            </div>

            <p className="mt-2.5 text-center text-[11px] leading-relaxed text-white/55 xl:text-xs">
              Movies &amp; shows, all in one place.
            </p>
          </div>

          <div className="min-w-0 px-2 text-center">
            <div className="flex items-center justify-center gap-2.5">
              <BookmarkCheck className="size-5 shrink-0 text-primary" />

              <p className="text-xs font-semibold text-white/90 xl:text-sm">
                Stay organized
              </p>
            </div>

            <p className="mt-2.5 text-center text-[11px] leading-relaxed text-white/55 xl:text-xs">
              Watchlists and viewing history.
            </p>
          </div>

          <div className="min-w-0 px-2 text-center">
            <div className="flex items-center justify-center gap-2.5">
              <Heart className="size-5 shrink-0 text-primary" />

              <p className="text-xs font-semibold text-white/90 xl:text-sm">
                Your taste
              </p>
            </div>

            <p className="mt-2.5 text-center text-[11px] leading-relaxed text-white/55 xl:text-xs">
              Ratings and favorites, your way.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AuthVisual;
