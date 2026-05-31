import { content } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";
import { WatercolorBlob } from "./Decor";

export default function Message() {
  const { parents, baby } = content;

  return (
    <Section label="A Note From the Parents" title="Our Joy">
      <Reveal>
        <div className="relative mx-auto max-w-xl">
          {/* Soft bloom cradling the message */}
          <WatercolorBlob
            id="msg-bloom"
            from="#F6DCCF"
            to="#F1D4C7"
            seed={9}
            className="pointer-events-none absolute -top-14 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 opacity-50"
          />
          <p className="font-serif text-xl font-light leading-relaxed text-ink/85 text-balance sm:text-2xl">
            {parents.message}
          </p>
          <p className="mt-8 font-script text-4xl text-ocean">
            {parents.father} &amp; {parents.mother}
          </p>
          <p className="mt-3 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-petal/80">
            {baby.endearment}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
