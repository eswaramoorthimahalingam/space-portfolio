import { HeroContent } from "@/components/sub/hero-content";

export const Hero = () => {
  return (
    <div id="home" className="relative isolate w-full overflow-hidden">
      <video
        playsInline
        aria-hidden="true"
        autoPlay
        muted
        loop
        className="hero-sky pointer-events-none absolute inset-x-0 top-0 -z-10 h-full w-full"
      >
        <source src="/videos/blackhole.webm" type="video/webm" />
      </video>

      <HeroContent />
    </div>
  );
};
