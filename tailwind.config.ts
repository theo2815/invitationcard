import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Watercolor-storybook palette ──────────────────────────────
        // Soft "baby boy" blues stay the identity; warm hand-painted
        // accents (blush, sage, butter) and a warm paper give it the
        // tender, illustrated nursery feel.
        powder: "#EAF4FB",
        mist: "#CFE6F2",
        azure: "#9FCBE3",
        ocean: "#5F94B8",
        deep: "#3A5A72",
        ink: "#43413E", // warm soft charcoal for body text
        cream: "#FCFAF6",
        paper: "#FBF6EC", // warm painted paper, the page base
        gold: "#C6A664",
        blush: "#F1D4C7", // soft peach wash
        petal: "#E7A892", // deeper blush accent
        sage: "#C7D8C0", // soft green wash
        butter: "#F6E7BE", // pale warm yellow wash
      },
      fontFamily: {
        // Fraunces = soft, characterful storybook serif (display + body).
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        // Parisienne = hand-painted flowing script (the baby's name).
        script: ["var(--font-parisienne)", "cursive"],
        // Nunito = rounded, friendly humanist sans (labels + UI).
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        driftSlow: {
          "0%": { transform: "translateX(-20px)" },
          "100%": { transform: "translateX(20px)" },
        },
        // Gentle watercolor "breathing" — blobs swell and ease back.
        sway: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg) scale(1)" },
          "50%": { transform: "translateY(-14px) rotate(2deg) scale(1.03)" },
        },
        // Slow bob with a hint of rotation for the dove.
        bob: {
          "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        // The painted brush-underline drawing itself in.
        brush: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        drift: "driftSlow 18s ease-in-out infinite alternate",
        sway: "sway 11s ease-in-out infinite",
        "sway-slow": "sway 16s ease-in-out infinite",
        bob: "bob 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
