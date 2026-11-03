const CinematicWall = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Cinematic image */}
      <div
        className="cinematic-wall-image absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/marketing/hero-background.png')",
        }}
      />

      {/* Brand atmosphere */}
      {/* <div className="absolute inset-0 bg-black/55" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(239,68,68,0.16),transparent_48%)]" />

      <div className="absolute inset-0 bg-linear-to-r from-background via-background/35 to-background/10" />

      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/20" /> */}

      {/* Film grain */}
      {/* <div className="absolute inset-0 opacity-[0.055] mix-blend-soft-light">
        <div className="size-full bg-[url('/textures/noise.svg')]" />
      </div> */}
    </div>
  );
};

export const CinematicCountdown = () => {
  return (
    <div
      className="cinematic-countdown pointer-events-auto fixed inset-0 isolate z-[9999]"
      aria-hidden="true"
    >
      {/* Upper and lower curtains */}
      <div className="cinematic-curtain-top absolute inset-x-0 top-0 h-[calc(50%+2px)] bg-black" />

      <div className="cinematic-curtain-bottom absolute inset-x-0 bottom-0 h-[calc(50%+2px)] bg-black" />

      {/* Film grain */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[url('/textures/noise.svg')] opacity-[0.08] mix-blend-screen" />

      {/* Projector flash */}
      <div className="cinematic-countdown-flash pointer-events-none absolute inset-0 z-20 bg-white opacity-0" />

      {/* Horizontal center line */}
      <div className="cinematic-countdown-seam pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-white/45 shadow-[0_0_24px_5px_rgba(255,255,255,0.15)]" />

      {/* Vertical center line */}
      <div className="cinematic-countdown-seam-vertical pointer-events-none absolute inset-y-0 left-1/2 z-20 w-px -translate-x-1/2 bg-white/45 shadow-[0_0_24px_5px_rgba(255,255,255,0.15)]" />

      {/* Countdown dial */}
      <div className="cinematic-countdown-dial absolute top-1/2 left-1/2 z-30 flex size-[min(76vw,440px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <svg
          className="absolute inset-0 size-full text-white"
          viewBox="0 0 240 240"
          fill="none"
        >
          <circle
            cx="120"
            cy="120"
            r="108"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.8"
          />

          <circle
            cx="120"
            cy="120"
            r="96"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.35"
            strokeDasharray="1 8"
          />

          <path
            d="M120 1V20 M120 220V239 M1 120H20 M220 120H239"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.85"
          />

          <path
            d="M120 24V216 M24 120H216"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeOpacity="0.22"
          />
        </svg>

        {/* Rotating film leader */}
        <svg
          className="cinematic-countdown-ring absolute inset-0 size-full text-white"
          viewBox="0 0 240 240"
          fill="none"
        >
          <path
            d="M120 120V13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.9"
          />

          <path
            d="M120 12A108 108 0 0 1 228 120"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="3 5"
          />

          <circle cx="120" cy="120" r="3.5" fill="currentColor" />
        </svg>

        {[3, 2, 1].map((number) => (
          <span
            key={number}
            className="cinematic-countdown-number absolute z-40 font-heading text-[clamp(7rem,18vw,13rem)] leading-none font-light tracking-tight text-white"
            style={{ opacity: 0, visibility: 'hidden' }}
          >
            {number}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CinematicWall;
