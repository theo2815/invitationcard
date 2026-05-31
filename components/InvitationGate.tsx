"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { content } from "@/lib/content";
import { WatercolorBlob } from "./Decor";

/**
 * Floating petals + sparkles that drift out of the envelope as it opens.
 * Deterministic (index-based, no Math.random) so there's no SSR mismatch.
 */
const PETALS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const reach = 70 + (i % 3) * 30;
  const colors = ["#F1D4C7", "#C7D8C0", "#EAF4FB", "#F6E7BE", "#E7A892", "#9FCBE3"];
  return {
    dx: Math.cos(angle) * reach,
    dy: -(120 + (i % 4) * 45), // upward
    size: 8 + (i % 3) * 4,
    rotate: (i % 2 ? 1 : -1) * (140 + i * 12),
    delay: (i % 5) * 0.05,
    color: colors[i % colors.length],
    sparkle: i % 4 === 0,
  };
});

/**
 * Full-screen "envelope" that sits over the invitation until the guest taps it.
 * The guest's name + role ride in the URL ( ?to=Antonio&role=ninong ) and are
 * read client-side, so this works on the static export with no server.
 */
export default function InvitationGate() {
  const reduce = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // Greeting starts as the fallback so the server + first client render match
  // (the real name is filled in after mount, from the URL).
  const [greeting, setGreeting] = useState<string>(
    content.envelope.greetingFallback
  );

  // Read the personalized name/role from the link.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("to")?.trim();
    const roleKey = params.get("role")?.trim().toLowerCase();
    if (name) {
      const roleLabel = roleKey ? content.envelope.roleLabels[roleKey] : "";
      setGreeting(`Dear ${roleLabel ? `${roleLabel} ` : ""}${name}`);
    }
  }, []);

  // Lock page scroll while the gate is up; restore when it's gone.
  useEffect(() => {
    if (dismissed) {
      document.body.style.overflow = "";
      // Now that scrolling is unlocked, guarantee we're at the very top — some
      // browsers ignore scrollTo while overflow is hidden, so reset here too.
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dismissed]);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    // Always reveal the invitation from the very top, no matter where the page
    // happened to be (e.g. the browser restoring a prior scroll position on
    // refresh). Scroll is locked while the gate is up, so we reset now and again
    // when the gate lifts, just before scrolling unlocks.
    window.scrollTo(0, 0);
    // Start the music NOW, synchronously inside the tap, so the browser counts
    // it as a user gesture and lets it autoplay (see MusicPlayer.tsx).
    window.dispatchEvent(new Event("invitation:opened"));
    // Let the open animation play, then dissolve the gate to reveal the page.
    const total = reduce ? 250 : 2000;
    window.setTimeout(() => {
      window.scrollTo(0, 0);
      // Tell the hero to play its entrance as the gate lifts.
      window.dispatchEvent(new Event("invitation:revealed"));
      setDismissed(true);
    }, total);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="gate"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-wash-sky px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="Invitation"
        >
          {/* Watercolor atmosphere behind the envelope */}
          <WatercolorBlob
            id="gate-b1"
            from="#BFE0F0"
            to="#9FCBE3"
            seed={4}
            className="pointer-events-none absolute -left-16 top-10 h-72 w-72 animate-sway opacity-60"
          />
          <WatercolorBlob
            id="gate-b2"
            from="#F6DCCF"
            to="#F1D4C7"
            seed={8}
            className="pointer-events-none absolute -right-16 bottom-12 h-72 w-72 animate-sway-slow opacity-60"
          />

          <button
            type="button"
            onClick={handleOpen}
            aria-label="Tap to open your invitation"
            className="group relative outline-none"
            style={{ perspective: 1200 }}
          >
            {/* Envelope */}
            <div
              className="relative aspect-[20/13] w-80 max-w-[82vw] sm:w-96"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Static envelope body: side panels + front pocket, drawn crisply
                  in SVG so the diagonal seams read clearly. */}
              <svg
                viewBox="0 0 400 260"
                className="absolute inset-0 h-full w-full drop-shadow-2xl"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="env-body" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#9FCBE3" />
                    <stop offset="1" stopColor="#5F94B8" />
                  </linearGradient>
                  <linearGradient id="env-pocket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#D7EAF5" />
                    <stop offset="1" stopColor="#A7D0E6" />
                  </linearGradient>
                  <clipPath id="env-round">
                    <rect x="0" y="0" width="400" height="260" rx="22" />
                  </clipPath>
                </defs>
                <g clipPath="url(#env-round)">
                  {/* side panels */}
                  <rect width="400" height="260" fill="url(#env-body)" />
                  {/* front pocket (points up) */}
                  <path d="M0 260 L200 130 L400 260 Z" fill="url(#env-pocket)" />
                  {/* seam shadow + highlight along the pocket's top edges */}
                  <path
                    d="M0 260 L200 130 L400 260"
                    fill="none"
                    stroke="#3A5A72"
                    strokeOpacity="0.18"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M0 260 L200 130 L400 260"
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity="0.5"
                    strokeWidth="1"
                  />
                </g>
              </svg>

              {/* Greeting on the envelope front (lives on the pocket, below the seal) */}
              <div className="absolute inset-x-0 bottom-0 top-[60%] z-30 flex flex-col items-center justify-center px-6 text-center">
                <p className="font-script text-3xl leading-tight text-deep drop-shadow-sm sm:text-4xl">
                  {greeting}
                </p>
                <p className="mt-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-deep/60 sm:text-[11px]">
                  {content.envelope.frontSubtitle}
                </p>
              </div>

              {/* Card that slides out on open */}
              <motion.div
                className="absolute inset-x-10 top-8 bottom-8 z-[5] flex flex-col items-center justify-center rounded-xl border border-mist bg-cream text-center shadow-xl"
                initial={false}
                animate={
                  opened
                    ? { opacity: 1, y: "-80%", scale: 1.06, zIndex: 60 }
                    : { opacity: 0, y: 0, scale: 0.92, zIndex: 5 }
                }
                transition={{
                  duration: reduce ? 0 : 0.85,
                  delay: reduce ? 0 : 0.95,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p className="label-spaced">{content.envelope.cardSubtitle}</p>
                <p className="mt-2 font-script text-4xl text-ocean">
                  {content.baby.firstName}
                </p>
              </motion.div>

              {/* Top flap — opens up and back in 3D. Drawn as an SVG triangle
                  clipped to the SAME rounded rectangle as the body, so its top
                  corners match the envelope's rounded corners instead of poking
                  out past them (that was the "broken" top corner). Clipping lives
                  inside the SVG, so the open animation is unaffected. */}
              <motion.div
                className="absolute left-0 right-0 top-0 z-40 origin-top"
                style={{
                  height: "50%",
                  filter: "drop-shadow(0 6px 7px rgba(58,90,114,0.30))",
                }}
                initial={false}
                animate={opened ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.7,
                  delay: reduce ? 0 : 0.25,
                  ease: "easeInOut",
                }}
              >
                <svg
                  viewBox="0 0 400 130"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="flap-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#EAF4FB" />
                      <stop offset="1" stopColor="#C8E2F0" />
                    </linearGradient>
                    <clipPath id="flap-round">
                      <rect x="0" y="0" width="400" height="260" rx="22" />
                    </clipPath>
                  </defs>
                  <path
                    d="M0 0 L400 0 L200 130 Z"
                    fill="url(#flap-grad)"
                    clipPath="url(#flap-round)"
                  />
                </svg>
              </motion.div>

              {/* Wax seal. Centered with a flexbox WRAPPER, not a CSS transform —
                  framer-motion writes `transform` inline for the scale animation,
                  which was overriding Tailwind's -translate centering and knocking
                  the seal off. The wrapper centers it on the point where all four
                  flaps converge; the inner motion.div only animates scale/opacity. */}
              <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold to-[#a07f3c] shadow-lg ring-2 ring-white/40"
                  initial={false}
                  animate={
                    opened ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }
                  }
                  transition={{ duration: reduce ? 0 : 0.3 }}
                >
                  {/* SVG <text> with text-anchor + dominant-baseline geometrically
                      centers the letter, independent of font metrics. */}
                  <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
                    <text
                      x="24"
                      y="24"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-serif"
                      fontSize="23"
                      fontWeight={600}
                      fill="#ffffff"
                    >
                      {content.envelope.monogram}
                    </text>
                  </svg>
                </motion.div>
              </div>
            </div>
          </button>

          {/* Petals + sparkles drifting out as the card emerges. The overlay
              centers everything; each petal only animates (positioning vs.
              animation kept separate — see UI Gotchas). */}
          {opened && !reduce && (
            <div className="pointer-events-none absolute inset-0 z-[55] flex items-center justify-center">
              {PETALS.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute block"
                  style={{
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    borderRadius: p.sparkle ? "2px" : "50% 50% 50% 0",
                  }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.3, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: p.dx,
                    y: p.dy,
                    scale: [0.3, 1, 1, 0.85],
                    rotate: p.rotate,
                  }}
                  transition={{
                    duration: 1.9,
                    delay: 0.9 + p.delay,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Tap hint */}
          <AnimatePresence>
            {!opened && (
              <motion.p
                className="mt-10 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-ocean/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {content.envelope.openHint}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
