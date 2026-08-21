const CinematicWall = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Cinematic image */}
      <div
        className="cinematic-wall-image absolute inset-0 scale-[1.08] bg-cover bg-center opacity-0"
        style={{
          backgroundImage:
            'url(https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg)',
        }}
      />

      {/* Brand atmosphere */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(239,68,68,0.16),transparent_48%)]" />

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/35 to-background/10" />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-[0.055] mix-blend-soft-light">
        <div className="size-full bg-[url('/textures/noise.svg')]" />
      </div>

      {/* Cinematic frame */}
      <div className="cinematic-wall-frame absolute inset-6 rounded-[2rem] border border-white/[0.08] opacity-0 sm:inset-8 lg:inset-12" />
    </div>
  );
};

export default CinematicWall;
