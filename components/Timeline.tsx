import { content } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";

export default function Timeline() {
  const { schedule } = content;

  return (
    <Section label="The Order of the Day" title="Our Celebration">
      <div className="relative mx-auto max-w-md text-left">
        {/* Painted vertical rail */}
        <span
          className="absolute left-[7px] top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-azure/30 via-azure/60 to-sage/40"
          aria-hidden="true"
        />
        <ul className="space-y-9">
          {schedule.map((item, i) => (
            <Reveal key={item.title} delay={i * 110}>
              <li className="relative pl-10">
                {/* Dot */}
                <span
                  className="absolute left-0 top-1.5 h-[18px] w-[18px] rounded-full border-[3px] border-cream bg-ocean shadow-sm ring-1 ring-azure/40"
                  aria-hidden="true"
                />
                <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-petal">
                  {item.time}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-light text-deep">
                  {item.title}
                </h3>
                <p className="mt-1.5 font-sans text-sm font-light leading-relaxed text-ink/70">
                  {item.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
