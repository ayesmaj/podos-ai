import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ logos }: LogoCloudProps) {
  return (
    <div
      className="relative"
      style={{
        width: "100%",
        padding: "2rem 0",
      }}
    >
      {/* Top border */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          top: -1,
          width: "100vw",
          height: 1,
          background: "rgba(255,255,255,0.06)",
        }}
      />

      <InfiniteSlider gap={72} reverse duration={60} durationOnHover={20}>
        {logos.map((logo, i) => (
          <img
            alt={logo.alt}
            className="pointer-events-none select-none"
            style={{
              height: "2rem",
              width: "auto",
              filter: "brightness(0) invert(1)",
              opacity: 0.5,
            }}
            height="auto"
            key={`logo-${i}`}
            loading="lazy"
            src={logo.src}
            width="auto"
          />
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 left-0 h-full"
        style={{ width: 240 }}
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 right-0 h-full"
        style={{ width: 240 }}
        direction="right"
      />

      {/* Bottom border */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          bottom: -1,
          width: "100vw",
          height: 1,
          background: "rgba(255,255,255,0.06)",
        }}
      />
    </div>
  );
}
