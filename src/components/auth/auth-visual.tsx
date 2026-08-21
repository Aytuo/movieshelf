const AuthVisual = () => {
  return (
    <aside
      aria-hidden="true"
      className="relative hidden min-h-screen overflow-hidden border-l border-border/50 bg-black lg:block"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg)',
        }}
      />

      <div className="absolute inset-0 bg-black/25" />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/20" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_38%,rgba(239,68,68,0.12),transparent_45%)]" />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.055] mix-blend-soft-light">
        <div className="size-full bg-[url('/textures/noise.svg')]" />
      </div>

      {/* Editorial frame */}
      <div className="absolute inset-8 rounded-[1.75rem] border border-white/[0.08]" />

      {/* Bottom metadata */}
      <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-white/40 uppercase">
              Frame 024
            </p>

            <p className="mt-2 text-xs tracking-[0.2em] text-white/65 uppercase">
              Personal cinema archive
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase">
              MovieShelf
            </p>

            <p className="mt-1 text-xs text-white/45">
              Your movies. Your taste.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AuthVisual;
