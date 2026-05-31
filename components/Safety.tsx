import { content } from "@/lib/content";
import Section from "./Section";
import Reveal from "./Reveal";

export default function Safety() {
  const { safety } = content;

  return (
    <Section label={safety.label} title={safety.title}>
      <Reveal>
        <p className="mx-auto max-w-xl font-sans text-sm font-light leading-relaxed text-ink/75">
          {safety.intro}
        </p>
      </Reveal>

      <div className="card-paper mx-auto mt-10 max-w-xl px-6 py-9 text-left sm:px-9">
        <ul className="space-y-5">
          {safety.items.map((item, i) => (
            <Reveal key={item} delay={(i % 4) * 80}>
              <li className="flex items-start gap-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush/60 text-petal">
                  <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="currentColor" aria-hidden="true">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </span>
                <p className="font-sans text-sm leading-relaxed text-ink/80">{item}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
