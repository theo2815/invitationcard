import { content } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import { PhotoThumb } from "./PhotoModal";
import { Dove } from "./Decor";

// Soft washes cycled across placeholder frames so they don't look uniform.
const washes = [
  "from-mist to-powder",
  "from-blush to-cream",
  "from-sage/70 to-cream",
  "from-butter to-cream",
  "from-powder to-mist",
  "from-blush/80 to-sage/50",
];

export default function Gallery() {
  const { gallery } = content;
  const hasPhotos = gallery.images.length > 0;
  // When photos exist, show them; otherwise show 6 placeholder frames.
  const tiles = hasPhotos ? gallery.images : Array.from({ length: 6 }, (_, i) => i);

  return (
    <Section label={gallery.label} title={gallery.title}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
        {tiles.map((tile, i) => (
          <Reveal key={i} delay={(i % 3) * 100}>
            <figure
              className={`overflow-hidden rounded-[1.4rem] border border-white/70 p-1.5 shadow-[0_14px_34px_-22px_rgba(58,90,114,0.5)] backdrop-blur-sm ${
                // Gentle staggered tilt for a scrapbook feel.
                i % 3 === 0 ? "sm:-rotate-1" : i % 3 === 2 ? "sm:rotate-1" : ""
              }`}
            >
              {hasPhotos ? (
                <PhotoThumb
                  src={tile as string}
                  alt={`${content.baby.firstName} — a sweet moment`}
                  imgClassName="aspect-[4/5] w-full rounded-[1.05rem] object-cover"
                />
              ) : (
                <div
                  className={`flex aspect-[4/5] w-full items-center justify-center rounded-[1.05rem] bg-gradient-to-br ${
                    washes[i % washes.length]
                  }`}
                >
                  <Dove className="w-10 text-white/80" />
                </div>
              )}
            </figure>
          </Reveal>
        ))}
      </div>

      {!hasPhotos && (
        <p className="mt-8 font-sans text-xs font-medium uppercase tracking-[0.22em] text-ocean/60">
          {gallery.note}
        </p>
      )}
    </Section>
  );
}
