import { content } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";

export default function DressCode() {
  const { dressCode } = content;

  return (
    <Section label="A Gentle Note" title="What to Wear">
      <Reveal>
        <p className="mx-auto mb-10 max-w-md font-sans text-sm font-light leading-relaxed text-ink/70">
          {dressCode.note}
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {dressCode.groups.map((g) => (
            <div key={g.who} className="card-paper px-8 py-9 text-center">
              <p className="label-spaced">{g.who}</p>
              <p className="mt-3 font-script text-4xl text-ocean">{g.wear}</p>
              <div className="mt-5 flex justify-center gap-2.5">
                {g.swatches.map((c, i) => (
                  <span
                    key={i}
                    className="h-6 w-6 rounded-full shadow-sm ring-1 ring-ink/10"
                    style={{ background: c }}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
