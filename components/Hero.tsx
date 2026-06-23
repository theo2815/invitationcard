"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { content } from "@/lib/content";
import { Cloud, Dove, WatercolorBlob, DeckleEdge } from "./Decor";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};
const nameItem = {
  hidden: { opacity: 0, y: 30, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const { baby, event } = content;
  const reduce = useReducedMotion();
  // The hero entrance plays the moment the envelope gate lifts, so opening
  // the invitation is the thing that brings the cover to life.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reduce) {
      setRevealed(true);
      return;
    }
    const onReveal = () => setRevealed(true);
    window.addEventListener("invitation:revealed", onReveal);
    // Fallback so the hero never stays hidden if the event is missed.
    const t = window.setTimeout(() => setRevealed(true), 4200);
    return () => {
      window.removeEventListener("invitation:revealed", onReveal);
      window.clearTimeout(t);
    };
  }, [reduce]);

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-wash-sky px-6 text-center">
      {/* Watercolor blooms — the painted sky. Ambient, always visible. */}
      <WatercolorBlob
        id="hero-b1"
        from="#BFE0F0"
        to="#9FCBE3"
        seed={3}
        className="absolute -left-24 -top-20 h-[24rem] w-[24rem] animate-sway opacity-70"
      />
      <WatercolorBlob
        id="hero-b2"
        from="#F6DCCF"
        to="#F1D4C7"
        seed={7}
        className="absolute -right-24 top-10 h-[22rem] w-[22rem] animate-sway-slow opacity-70"
      />
      <WatercolorBlob
        id="hero-b3"
        from="#D8E6D1"
        to="#C7D8C0"
        seed={11}
        className="absolute -bottom-24 left-1/4 h-[26rem] w-[26rem] animate-sway opacity-60"
      />
      <WatercolorBlob
        id="hero-b4"
        from="#FAEFCF"
        to="#F6E7BE"
        seed={5}
        className="absolute -bottom-16 right-6 h-[16rem] w-[16rem] animate-sway-slow opacity-60"
      />

      {/* Drifting clouds + a floating dove */}
      <Cloud className="absolute left-[-4%] top-[12%] w-40 text-white/80 animate-drift sm:w-56" />
      <Cloud className="absolute right-[-6%] top-[30%] w-52 text-white/70 animate-drift sm:w-72" />
      <Cloud className="absolute bottom-[12%] left-[8%] w-32 text-white/60 animate-drift sm:w-44" />
      <Dove className="absolute right-[14%] top-[15%] w-14 text-azure/90 animate-bob sm:w-20" />

      {/* Cover content — staggered entrance keyed to the envelope lift. */}
      <motion.div
        className="relative z-10 mx-auto max-w-2xl"
        variants={container}
        initial="hidden"
        animate={revealed ? "show" : "hidden"}
      >
        <motion.p variants={item} className="label-spaced mb-6">
          Save the Date
        </motion.p>

        <motion.p
          variants={item}
          className="mx-auto mb-7 max-w-md font-serif text-lg font-light italic leading-relaxed text-deep/90 text-balance sm:text-xl"
        >
          {baby.invitePhrase}
        </motion.p>

        <motion.h1
          variants={nameItem}
          className="font-script text-[5.5rem] leading-[0.95] text-ocean drop-shadow-[0_4px_14px_rgba(95,148,184,0.25)] sm:text-[7rem] md:text-[8.5rem]"
        >
          {baby.firstName}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 font-serif text-xl tracking-wide text-deep sm:text-2xl"
        >
          {baby.fullName}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center gap-1.5 font-sans text-sm font-medium tracking-[0.12em] text-ocean"
        >
          <span>{event.dateDisplay}</span>
          <span className="text-petal">✿</span>
          <span>{event.yearDisplay}</span>
        </motion.div>
      </motion.div>

      {/* Scroll cue (non-motion wrapper does the centering — see UI Gotchas) */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-floaty">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-ocean/70"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 5v14m0 0l-6-6m6 6l6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Painted deckle transition into the next section */}
      <DeckleEdge className="absolute bottom-0 left-0 h-8 w-full text-paper" />
    </section>
  );
}
