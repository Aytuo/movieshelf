const MarketingBackground = () => {
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
    </div>
  );
};

export default MarketingBackground;
