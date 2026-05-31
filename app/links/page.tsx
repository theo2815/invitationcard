"use client";

import { useMemo, useState } from "react";
import { content } from "@/lib/content";

/**
 * A private helper page (for the host, not guests) at /links.
 * Lists a generic GUEST link plus every godparent's personalized link, each with
 * Copy, WhatsApp, and a native "Share…" button (the share sheet — Messenger, etc.).
 *
 * Links always point at the canonical PRODUCTION url (content.site.url) — NOT
 * window.location.origin — so even if this page is opened on a Vercel
 * deployment-specific URL (login-protected, which would break the link preview),
 * the copied links are correct & shareable.
 */

type Guest = { name: string; role: string; roleLabel: string };

export default function LinksPage() {
  const [copied, setCopied] = useState<string | null>(null);

  // Always the public production origin, regardless of where this page is opened.
  const origin = content.site.url;

  const guests = useMemo<Guest[]>(() => {
    const { ninong, ninang } = content.godparents;
    return [
      ...ninong.map((name) => ({ name, role: "ninong", roleLabel: "Ninong" })),
      ...ninang.map((name) => ({ name, role: "ninang", roleLabel: "Ninang" })),
    ];
  }, []);

  // The envelope greets by FIRST name only ("Dear Ninong Theo"), so the link
  // carries just the first name. The card still shows the full name so the host
  // knows exactly who each link is for.
  const firstNameOf = (name: string) => name.trim().split(/\s+/)[0];

  const linkFor = (g: Guest) =>
    `${origin}/?to=${encodeURIComponent(firstNameOf(g.name))}&role=${g.role}`;

  // Short note (NO url) — used as the share-sheet text + WhatsApp text. The url
  // is passed/appended separately so it isn't duplicated.
  const noteFor = (g: Guest) =>
    `Dear ${g.roleLabel} ${firstNameOf(g.name)}, you're invited to the Christening of ${content.baby.firstName}. Please open your invitation:`;

  // Generic link for ordinary guests (no name) — envelope shows "You're Invited".
  const guestLink = `${origin}/`;
  const guestNote = `You're invited to the Christening of ${content.baby.firstName}! Please open your invitation:`;

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      /* clipboard blocked — user can still select the text manually */
    }
  };

  // Native share sheet (Messenger, Instagram, WhatsApp, SMS…). On desktop /
  // browsers without the Web Share API, fall back to copying the message + link.
  const share = async (key: string, note: string, link: string) => {
    // IMPORTANT: put the note AND link in ONE text string and do NOT pass `url`
    // separately. Passing a separate `url` makes Messenger post two bubbles (a
    // preview card + a separate text message). Inlining the link in `text` makes
    // it post a SINGLE message — text + auto link-preview in one bubble — like
    // WhatsApp.
    const text = `${note} ${link}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        /* user cancelled or share failed — fall through to copy */
      }
    }
    copy(key, text);
  };

  const btn =
    "rounded-full border border-ocean/40 px-4 py-1.5 font-sans text-xs uppercase tracking-[0.15em] text-ocean transition hover:bg-ocean hover:text-white";

  // Shared Copy / WhatsApp / Share… button row.
  const actions = (key: string, link: string, note: string) => (
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={() => copy(key, link)} className={btn}>
        {copied === key ? "Copied!" : "Copy link"}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${note} ${link}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        WhatsApp
      </a>
      <button type="button" onClick={() => share(key, note, link)} className={btn}>
        Share…
      </button>
    </div>
  );

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-10 text-center">
        <p className="label-spaced mb-2">Host Tools — Not for Guests</p>
        <h1 className="font-serif text-4xl font-light text-deep">
          Invitation Links
        </h1>
        <p className="mt-3 font-sans text-sm font-light text-ink/70">
          Share the guest link with everyone, and each godparent&apos;s own link
          so their name appears on the envelope. <span className="text-ocean">Share…</span>{" "}
          opens your phone&apos;s share sheet (Messenger, etc.).
        </p>
      </header>

      {/* Generic guest link */}
      <section className="mb-10 rounded-2xl border border-gold/45 bg-butter/30 p-5 shadow-sm">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-serif text-lg text-deep">For Guests</p>
          <span className="rounded-full bg-cream px-3 py-0.5 font-sans text-[11px] uppercase tracking-[0.2em] text-gold">
            Everyone
          </span>
        </div>
        <p className="mt-1 font-sans text-xs font-light text-ink/60">
          One link for anyone who isn&apos;t a godparent — the envelope shows
          &ldquo;{content.envelope.greetingFallback}&rdquo;.
        </p>
        <p className="mt-3 break-all rounded-lg bg-white/70 px-3 py-2 font-mono text-xs text-ink/70">
          {guestLink}
        </p>
        {actions("guest", guestLink, guestNote)}
      </section>

      <h2 className="mb-4 font-serif text-2xl font-light text-deep">
        Godparents
      </h2>
      <ul className="space-y-4">
        {guests.map((g) => {
          const link = linkFor(g);
          return (
            <li
              key={`${g.role}-${g.name}`}
              className="rounded-2xl border border-mist bg-white/70 p-5 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-serif text-lg text-deep">{g.name}</p>
                <span className="rounded-full bg-powder px-3 py-0.5 font-sans text-[11px] uppercase tracking-[0.2em] text-ocean">
                  {g.roleLabel}
                </span>
              </div>

              <p className="mt-3 break-all rounded-lg bg-powder/60 px-3 py-2 font-mono text-xs text-ink/70">
                {link}
              </p>

              {actions(g.name, link, noteFor(g))}
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-center font-sans text-xs text-ink/50">
        Open this page on your phone for the smoothest sharing.
      </p>
    </main>
  );
}
