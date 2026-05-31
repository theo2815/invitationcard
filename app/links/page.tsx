"use client";

import { useEffect, useMemo, useState } from "react";
import { content } from "@/lib/content";

/**
 * A private helper page (for the host, not guests) at /links.
 * Lists every godparent with a ready-to-send personalized invitation link,
 * plus copy and WhatsApp-share buttons. Links are built from whatever domain
 * this page is opened on, so they're correct in dev and after deploy.
 */

type Guest = { name: string; role: string; roleLabel: string };

export default function LinksPage() {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const guests = useMemo<Guest[]>(() => {
    const { ninong, ninang } = content.godparents;
    return [
      ...ninong.map((name) => ({ name, role: "ninong", roleLabel: "Ninong" })),
      ...ninang.map((name) => ({ name, role: "ninang", roleLabel: "Ninang" })),
    ];
  }, []);

  const linkFor = (g: Guest) =>
    `${origin}/?to=${encodeURIComponent(g.name)}&role=${g.role}`;

  const messageFor = (g: Guest, link: string) =>
    `Dear ${g.roleLabel} ${g.name}, you're invited to the christening of ${content.baby.firstName}. Please open your invitation here: ${link}`;

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch {
      /* clipboard blocked — user can still select the text manually */
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-10 text-center">
        <p className="label-spaced mb-2">Host Tools — Not for Guests</p>
        <h1 className="font-serif text-4xl font-light text-deep">
          Personalized Invitation Links
        </h1>
        <p className="mt-3 font-sans text-sm font-light text-ink/70">
          Send each godparent their own link. Their name appears on the envelope
          when they open it.
        </p>
      </header>

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
                {origin ? link : "Loading link…"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copy(g.name, link)}
                  className="rounded-full border border-ocean/40 px-4 py-1.5 font-sans text-xs uppercase tracking-[0.15em] text-ocean transition hover:bg-ocean hover:text-white"
                >
                  {copied === g.name ? "Copied!" : "Copy link"}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    messageFor(g, link)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-ocean/40 px-4 py-1.5 font-sans text-xs uppercase tracking-[0.15em] text-ocean transition hover:bg-ocean hover:text-white"
                >
                  Share on WhatsApp
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-center font-sans text-xs text-ink/50">
        Tip: a plain link with no name still works — it shows
        &ldquo;{content.envelope.greetingFallback}&rdquo; on the envelope.
      </p>
    </main>
  );
}
