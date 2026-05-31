"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Reusable, on-brand confirmation dialog — a watercolor-storybook replacement
 * for the native window.confirm(). Use it anywhere:
 *
 *   const confirm = useConfirm();
 *   if (await confirm({ title: "…", message: "…", tone: "danger" })) { … }
 *
 * Why a provider + portal (same pattern as PhotoModal): the dialog renders
 * through createPortal() to <body>, so its `fixed` overlay escapes any ancestor
 * that uses transform / backdrop-filter (those would otherwise trap it). One
 * shared dialog, promise-based so call sites read like the native confirm.
 * Static-export safe — entirely client-side.
 */

type Tone = "danger" | "default";

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
};

const ConfirmContext = createContext<
  ((opts: ConfirmOptions) => Promise<boolean>) | null
>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const [mounted, setMounted] = useState(false);
  const resolverRef = useRef<((ok: boolean) => void) | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // Portals need the DOM — only render after mount.
  useEffect(() => setMounted(true), []);

  const confirm = useCallback(
    (o: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
        setOpts(o);
      }),
    []
  );

  const close = useCallback((ok: boolean) => {
    resolverRef.current?.(ok);
    resolverRef.current = null;
    setOpts(null);
  }, []);

  // While open: lock scroll, Escape cancels, and focus the (safe) Cancel button.
  useEffect(() => {
    if (!opts) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus Cancel — the safe default for a destructive action.
    const t = window.setTimeout(() => cancelRef.current?.focus(), 30);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [opts, close]);

  const danger = (opts?.tone ?? "default") === "danger";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {opts && (
              <motion.div
                key="confirm-overlay"
                className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/65 p-5 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => close(false)}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby={opts.message ? "confirm-message" : undefined}
              >
                <motion.div
                  className="card-paper relative w-full max-w-sm p-7 text-center sm:p-8"
                  initial={
                    reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 14 }
                  }
                  animate={
                    reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
                  }
                  exit={
                    reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }
                  }
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Painterly badge: a soft bloom behind a ringed icon. */}
                  <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                    <span
                      className={`absolute inset-0 rounded-full blur-md ${
                        danger ? "bg-blush/60" : "bg-powder"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full ring-1 ring-white/70 ${
                        danger ? "bg-blush/70 text-petal" : "bg-powder text-ocean"
                      }`}
                    >
                      {danger ? (
                        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                          <path d="M12 7.5v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                          <path d="M12 17h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                          <path d="M12 11v5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                          <path d="M12 7.5h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                      )}
                    </span>
                  </div>

                  <h2
                    id="confirm-title"
                    className="font-serif text-2xl font-light text-deep"
                  >
                    {opts.title}
                  </h2>
                  {opts.message && (
                    <p
                      id="confirm-message"
                      className="mt-3 font-sans text-sm font-light leading-relaxed text-ink/70 text-balance"
                    >
                      {opts.message}
                    </p>
                  )}

                  <div className="mt-7 flex gap-3">
                    <button
                      ref={cancelRef}
                      type="button"
                      onClick={() => close(false)}
                      className="flex-1 rounded-full border border-mist bg-white/60 px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-ink/70 outline-none transition hover:bg-mist/40 focus-visible:ring-2 focus-visible:ring-ocean/30"
                    >
                      {opts.cancelLabel ?? "Cancel"}
                    </button>
                    <button
                      type="button"
                      onClick={() => close(true)}
                      className={`flex-1 rounded-full px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-sm outline-none transition focus-visible:ring-2 ${
                        danger
                          ? "bg-petal hover:bg-[#d98f78] focus-visible:ring-petal/40"
                          : "bg-ocean hover:bg-deep focus-visible:ring-ocean/40"
                      }`}
                    >
                      {opts.confirmLabel ?? "Confirm"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </ConfirmContext.Provider>
  );
}
