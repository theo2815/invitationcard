import { content } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";

function NameColumn({ heading, names }: { heading: string; names: readonly string[] }) {
  return (
    <div className="flex-1">
      <h3 className="font-script text-4xl text-ocean">{heading}</h3>
      <ul className="mt-5 space-y-2.5">
        {names.map((name) => (
          <li key={name} className="font-serif text-lg text-ink/80">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Godparents() {
  const { godparents, baby } = content;

  return (
    <Section label="With Loving Guidance" title="Godparents">
      <Reveal>
        <p className="mx-auto mb-12 max-w-lg font-sans text-sm font-light leading-relaxed text-ink/70">
          We are grateful to those who will help guide {baby.firstName} in faith
          and love throughout his life.
        </p>
        <div className="card-paper flex flex-col gap-10 px-8 py-10 sm:flex-row sm:gap-6">
          <NameColumn heading="Ninong" names={godparents.ninong} />
          <div className="hidden w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent sm:block" />
          <NameColumn heading="Ninang" names={godparents.ninang} />
        </div>
      </Reveal>
    </Section>
  );
}
