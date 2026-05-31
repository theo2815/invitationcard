import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { Brush, Sprig } from "./Decor";

/** Shared section shell: small label, painted serif heading with a brush
 *  underline, a sprig flourish, then content. */
export default function Section({
  label,
  title,
  children,
  className = "",
  id,
}: {
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-6 py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-3xl text-center">
        {(label || title) && (
          <Reveal className="mb-12">
            {label && <p className="label-spaced mb-4">{label}</p>}
            {title && (
              <h2 className="relative inline-block font-serif text-[2.5rem] font-light leading-tight text-deep sm:text-5xl">
                {title}
                <Brush className="absolute -bottom-2 left-1/2 h-3 w-[112%] -translate-x-1/2 text-azure/55" />
              </h2>
            )}
            <Sprig className="mx-auto mt-7 h-8 w-8 text-sage" />
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
