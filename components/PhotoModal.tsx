"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * A single, reusable photo-preview modal shared by every clickable picture.
 *
 * Why a provider + portal (not a modal per image):
 *  - The modal is rendered through createPortal() to <body>, so it escapes
 *    ancestors that use transform / backdrop-blur (the reveal + paper cards).
 *    A `fixed` element inside such an ancestor is positioned relative to THAT
 *    ancestor, not the viewport — which trapped the old popup inside the card
 *    (messy, cut off) and left the scroll lock stuck. The portal fixes both.
 *  - One shared scroll lock instead of 13 competing ones.
 *
 * Static-export safe — entirely client-side.
 */

type Photo = { src: string; alt: string; caption?: string };

const PhotoModalContext = createContext<((p: Photo) => void) | null>(null);

function useOpenPhoto() {
  const open = useContext(PhotoModalContext);
  if (!open) {
    throw new Error("PhotoThumb must be rendered inside <PhotoModalProvider>");
  }
  return open;
}

export function PhotoModalProvider({ children }: { children: ReactNode }) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  // Portals need the DOM — only render after mount (avoids SSR/hydration issues).
  useEffect(() => setMounted(true), []);

  const open = useCallback((p: Photo) => setPhoto(p), []);
  const close = useCallback(() => setPhoto(null), []);

  // Lock page scroll + wire Escape while a photo is open; always restored on close.
  useEffect(() => {
    if (!photo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [photo, close]);

  return (
    <PhotoModalContext.Provider value={open}>
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {photo && (
              <motion.div
                className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm sm:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={close}
                role="dialog"
                aria-modal="true"
                aria-label={photo.caption || photo.alt}
              >
                {/* Close — fixed to the screen corner so it's always reachable */}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close preview"
                  className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cream/95 text-deep shadow-lg ring-1 ring-ink/10 transition hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <motion.figure
                  className="relative m-0 flex flex-col items-center"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 10 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="rounded-[1.4rem] bg-cream p-2 shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="block h-auto max-h-[80vh] w-auto max-w-[86vw] rounded-[1rem] object-contain sm:max-w-[80vw]"
                    />
                  </div>
                  {photo.caption && (
                    <figcaption className="mt-4 max-w-[86vw] text-center font-serif text-base text-cream drop-shadow sm:text-lg">
                      {photo.caption}
                    </figcaption>
                  )}
                </motion.figure>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </PhotoModalContext.Provider>
  );
}

/** A thumbnail that opens the shared photo modal when tapped. */
export function PhotoThumb({
  src,
  alt,
  caption,
  imgClassName = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  imgClassName?: string;
}) {
  const open = useOpenPhoto();
  return (
    <button
      type="button"
      onClick={() => open({ src, alt, caption })}
      aria-label={`View ${alt}`}
      className="group relative block w-full cursor-zoom-in"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${imgClassName} transition-transform duration-300 group-hover:scale-[1.04]`}
      />
      <span className="pointer-events-none absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-ocean opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
          <path
            d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
