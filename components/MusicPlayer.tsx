"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";

/**
 * Soft looping background music that begins when the envelope is opened.
 *
 * Why it starts on the envelope tap: mobile browsers block audio until a user
 * gesture. InvitationGate dispatches `invitation:opened` synchronously inside
 * the tap handler, so calling play() here is still within that gesture and is
 * allowed to autoplay.
 *
 * The mute/unmute chip (bottom-left) is revealed only once the guest scrolls to
 * the bottom of the page, then fades in. The <audio> element lives at the page
 * root (not in the gate, which unmounts), so the music keeps playing after the
 * envelope dissolves. Static-export safe.
 */
export default function MusicPlayer() {
  const { src, volume } = content.audio;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  // Ramp volume from 0 to the target over ~1.2s so it eases in gently.
  const fadeIn = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    const target = volume ?? 0.5;
    el.volume = 0;
    let v = 0;
    const id = window.setInterval(() => {
      v = Math.min(target, v + target / 24);
      el.volume = v;
      if (v >= target) window.clearInterval(id);
    }, 50);
  }, [volume]);

  // Begin playback when the envelope opens (within the tap gesture).
  useEffect(() => {
    if (!src) return;
    const start = () => {
      const el = audioRef.current;
      if (!el || started) return;
      el.muted = false;
      el.play()
        .then(() => {
          setStarted(true);
          fadeIn();
        })
        .catch(() => {
          // Autoplay blocked or file missing — still reveal the control (at the
          // bottom) so the guest can start/unmute it themselves.
          setStarted(true);
          setMuted(true);
        });
    };
    window.addEventListener("invitation:opened", start);
    window.addEventListener("invitation:revealed", start); // fallback
    return () => {
      window.removeEventListener("invitation:opened", start);
      window.removeEventListener("invitation:revealed", start);
    };
  }, [src, started, fadeIn]);

  // Reveal the control only when the guest reaches the bottom of the page.
  useEffect(() => {
    if (!started) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const nearBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 150;
      setAtBottom(nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [started]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (muted) {
      el.muted = false;
      if (el.paused) {
        el.play()
          .then(fadeIn)
          .catch(() => {});
      }
      setMuted(false);
    } else {
      el.muted = true;
      setMuted(true);
    }
  };

  if (!src) return null;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />

      {started && (
        <button
          type="button"
          onClick={toggle}
          aria-label={muted ? "Unmute music" : "Mute music"}
          aria-pressed={!muted}
          aria-hidden={!atBottom}
          tabIndex={atBottom ? 0 : -1}
          className={`fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-white/70 bg-cream/90 py-1.5 pl-1.5 pr-3.5 text-ocean shadow-[0_10px_30px_-12px_rgba(58,90,114,0.6)] backdrop-blur-sm transition-all duration-500 ${
            atBottom
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-azure/25">
            {!muted && (
              <span className="absolute inset-0 animate-ping rounded-full bg-azure/40 motion-reduce:hidden" />
            )}
            {muted ? (
              <svg viewBox="0 0 24 24" className="relative h-4 w-4" fill="none" aria-hidden="true">
                <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
                <path
                  d="M16 9.5l5 5M21 9.5l-5 5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="relative h-4 w-4" fill="none" aria-hidden="true">
                <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
                <path
                  d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
            {muted ? "Muted" : "Music"}
          </span>
        </button>
      )}
    </>
  );
}
