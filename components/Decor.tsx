/** Hand-painted decorative SVGs for the watercolor-storybook theme. */

/* Full-page pressed-paper grain. Rendered once, fixed, very low opacity. */
export function PaperGrain() {
  return (
    <div
      className="grain pointer-events-none fixed inset-0 z-[2] opacity-[0.05] mix-blend-multiply"
      aria-hidden="true"
    />
  );
}

/**
 * A soft watercolor "bloom" — a blob whose edges are roughed up by fractal
 * noise + displacement so it bleeds like wet pigment instead of a clean
 * gradient. Give each instance a UNIQUE `id` (filter/gradient ids must not
 * collide) and a `seed` to vary the bleed.
 */
export function WatercolorBlob({
  id,
  className = "",
  from = "#9FCBE3",
  to = "#5F94B8",
  seed = 2,
}: {
  id: string;
  className?: string;
  from?: string;
  to?: string;
  seed?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`mix-blend-multiply ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-g`} cx="38%" cy="34%" r="78%">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </radialGradient>
        <filter id={`${id}-f`} x="-35%" y="-35%" width="170%" height="170%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.013 0.017"
            numOctaves="3"
            seed={seed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
            result="disp"
          />
          <feGaussianBlur in="disp" stdDeviation="2.5" />
        </filter>
      </defs>
      <path
        d="M100 20 C141 20 180 54 180 100 C180 146 146 180 100 180 C56 180 20 149 20 103 C20 57 59 20 100 20 Z"
        fill={`url(#${id}-g)`}
        filter={`url(#${id}-f)`}
      />
    </svg>
  );
}

/* A painterly brush underline that sits under a heading word. */
export function Brush({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 9c28-5 60-6 96-4 34 2 64 1 96-3-30 6-62 9-96 8C66 9 34 9 4 12c-2 0-3-2-1-3z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

/* Small hand-drawn leafy sprig — a storybook flourish. */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 60V20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M32 46c-6 0-11-3-13-9 7-1 12 2 13 9zM32 38c6 0 11-3 13-9-7-1-12 2-13 9zM32 30c-5 0-9-3-11-8 6-1 10 2 11 8z"
        fill="currentColor"
        opacity="0.85"
      />
      <circle cx="32" cy="16" r="4" fill="currentColor" />
    </svg>
  );
}

/* A plump little peace dove, gliding — rounded head, soft beak, raised wing. */
export function Dove({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* beak */}
      <path d="M6 23 L1 24 L6 26 Z" fill="currentColor" />
      {/* body + head + tail */}
      <path
        d="M6 23 C 8 18, 13 15, 19 16 C 24 17, 28 21, 33 26 C 39 31, 47 33, 56 30 C 49 34, 41 38, 32 38 C 23 38, 15 35, 10 30 C 7 27, 6 26, 6 23 Z"
        fill="currentColor"
      />
      {/* raised wing */}
      <path
        d="M24 27 C 26 19, 30 11, 37 7 C 36 13, 36 20, 41 26 C 35 28, 29 28, 24 27 Z"
        fill="currentColor"
        opacity="0.88"
      />
      {/* eye */}
      <circle cx="15" cy="21" r="1.2" fill="#fff" />
    </svg>
  );
}

/* A soft cloud. */
export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" fill="none" className={className} aria-hidden="true">
      <path
        d="M40 64c-15 0-26-10-26-23 0-12 9-21 21-22 4-12 15-19 28-19 15 0 27 10 30 24 13 1 23 11 23 24 0 14-12 22-27 22z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A torn/painted deckle edge to transition between two wash colors.
 *  `fill` is set via text color (currentColor). Place absolutely at the
 *  top or bottom of a section; it paints the NEXT section's color. */
export function DeckleEdge({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M0 24c80-14 160-18 240-12s150 22 240 22 170-18 250-22 160 4 240 14 160 16 230 8v-8H0v0z"
        fill="currentColor"
      />
      <path
        d="M0 40c90-10 170-12 250-6s160 16 240 14 160-14 240-16 170 6 250 14 150 8 210 2v-2H0v0z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

/** A centered ornamental divider — small flourish with a sprig. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/70" />
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path
          d="M12 2c1.5 4 4 6.5 8 8-4 1.5-6.5 4-8 8-1.5-4-4-6.5-8-8 4-1.5 6.5-4 8-8z"
          fill="currentColor"
        />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}
