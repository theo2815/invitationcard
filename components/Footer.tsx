import { content } from "@/lib/content";
import { Dove, Ornament, DeckleEdge, WatercolorBlob } from "./Decor";
import Reveal from "./Reveal";

export default function Footer() {
  const { baby, contact } = content;

  return (
    <footer className="relative overflow-hidden bg-wash-sky px-6 pb-20 pt-28 text-center">
      {/* Painted edge transitioning from the paper sections above */}
      <DeckleEdge className="absolute left-0 top-0 h-8 w-full text-paper" />

      <WatercolorBlob
        id="footer-bloom"
        from="#D8E6D1"
        to="#C7D8C0"
        seed={13}
        className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 opacity-50"
      />

      <Reveal>
        <Dove className="mx-auto mb-6 w-16 text-azure animate-bob" />
        <p className="font-serif text-2xl font-light italic text-deep">
          We can&apos;t wait to celebrate with you
        </p>
        <h2 className="mt-3 font-script text-6xl text-ocean">{baby.firstName}</h2>

        <Ornament className="my-10" />

        {contact.name && (
          <div className="font-sans text-sm font-light text-ink/70">
            <p>For any questions, please reach</p>
            <p className="mt-1 text-ocean">
              {contact.name} ·{" "}
              <a
                href={`tel:+${contact.phoneHref}`}
                className="underline-offset-4 hover:underline"
              >
                {contact.phoneDisplay}
              </a>
            </p>
          </div>
        )}

        <p className="mt-10 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-ocean/60">
          {baby.fullName}
        </p>
      </Reveal>
    </footer>
  );
}
