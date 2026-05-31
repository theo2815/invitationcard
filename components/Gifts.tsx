import { content } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import { PhotoThumb } from "./PhotoModal";

export default function Gifts() {
  const { gifts } = content;

  return (
    <Section label="With Love" title="Gift Ideas" className="bg-wash-soft">
      <Reveal>
        <p className="mx-auto max-w-xl font-sans text-sm font-light leading-relaxed text-ink/75">
          {gifts.intro}
        </p>
      </Reveal>

      {/* flex-wrap + justify-center so a lone card in the last row centers
          (7 items = rows of 2 on mobile / 3 on sm, with one left over). */}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {gifts.items.map((item, i) => (
          <Reveal
            key={item.name}
            delay={(i % 3) * 100}
            className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)]"
          >
            <figure className="card-paper flex h-full flex-col p-3 text-center">
              <div className="overflow-hidden rounded-[1.1rem] bg-white p-3">
                <PhotoThumb
                  src={item.image}
                  alt={item.name}
                  caption={item.name}
                  imgClassName="mx-auto aspect-square w-full object-contain"
                />
              </div>
              <figcaption className="mt-3 flex flex-1 items-center justify-center px-1 font-serif text-sm leading-snug text-deep">
                {item.name}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mx-auto mt-12 max-w-lg font-serif text-base font-light italic leading-relaxed text-ocean/90 text-balance">
          {gifts.disclaimer}
        </p>
      </Reveal>
    </Section>
  );
}
