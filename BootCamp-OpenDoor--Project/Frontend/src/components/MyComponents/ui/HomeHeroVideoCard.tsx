interface HomeHeroVideoCardProps {
  title: string;
  description: string;
  badge?: string;
}

export const HomeHeroVideoCard = ({title,description,badge = "OpenDoor"}: HomeHeroVideoCardProps) => {
  return (
    <section className="relative min-h-[350px] overflow-hidden rounded-3xl bg-black">      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover "
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {badge}
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/90 md:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};