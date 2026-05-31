"use client";

import { useEffect, useMemo, useState } from "react";
import { content } from "@/lib/content";
import { useConfirm } from "@/components/ConfirmDialog";

/**
 * A private helper page (for the host, not guests).
 *
 * 🔒 Lives at an UNGUESSABLE, UNLISTED slug ( /host-8e8f9393e6ddaca8 ) — not linked
 * anywhere on the site, so guests can't stumble onto it. Static sites can't do
 * real auth; this is "secret URL" protection (the godparent names are already
 * public in the main invite's Godparents section, so this only hides the host
 * TOOLS, not the names). To rotate the slug, rename this folder.
 *
 * Lists a generic GUEST link plus every godparent's personalized link, each with
 * Copy, WhatsApp, and a native "Share…" button (the share sheet — Messenger, etc.).
 *
 * Host tools: a search box, a "messaged" checklist (with progress), a
 * not-yet-messaged filter, and a reset. The checklist is saved to localStorage,
 * so it persists on THIS browser/device only (no backend — the site is static).
 *
 * Links always point at the canonical PRODUCTION url (content.site.url) — NOT
 * window.location.origin — so even if this page is opened on a Vercel
 * deployment-specific URL (login-protected, which would break the link preview),
 * the copied links are correct & shareable.
 */

type Guest = { name: string; role: string; roleLabel: string };

const STORAGE_KEY = "invitationcard:messaged";

export default function LinksPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  // Which godparents are marked "messaged" (keyed by `${role}-${fullName}`).
  const [messaged, setMessaged] = useState<Record<string, boolean>>({});
  // Becomes true after we've loaded localStorage, so we don't persist the empty
  // initial state over real saved data (and to match SSR on first render).
  const [hydrated, setHydrated] = useState(false);

  // Always the public production origin, regardless of where this page is opened.
  const origin = content.site.url;

  const guests = useMemo<Guest[]>(() => {
    const { ninong, ninang } = content.godparents;
    return [
      ...ninong.map((name) => ({ name, role: "ninong", roleLabel: "Ninong" })),
      ...ninang.map((name) => ({ name, role: "ninang", roleLabel: "Ninang" })),
    ];
  }, []);

  const keyOf = (g: Guest) => `${g.role}-${g.name}`;

  // Load saved checkmarks once, after mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessaged(JSON.parse(raw));
    } catch {
      /* corrupt/unavailable storage — start fresh */
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messaged));
    } catch {
      /* storage full / blocked — ignore */
    }
  }, [messaged, hydrated]);

  const isMessaged = (g: Guest) => !!messaged[keyOf(g)];

  const toggleMessaged = (g: Guest) =>
    setMessaged((m) => {
      const next = { ...m };
      const k = keyOf(g);
      if (next[k]) delete next[k];
      else next[k] = true;
      return next;
    });

  const confirm = useConfirm();
  const resetAll = async () => {
    const ok = await confirm({
      title: "Reset checkmarks?",
      message: "This clears every “messaged” check on this device. It can't be undone.",
      confirmLabel: "Reset",
      cancelLabel: "Keep them",
      tone: "danger",
    });
    if (ok) setMessaged({});
  };

  const messagedCount = guests.filter(isMessaged).length;
  const total = guests.length;

  // The envelope greets by FIRST name only ("Dear Ninong Theo"), so the link
  // carries just the first name. The card still shows the full name so the host
  // knows exactly who each link is for.
  const firstNameOf = (name: string) => name.trim().split(/\s+/)[0];

  const linkFor = (g: Guest) =>
    `${origin}/?to=${encodeURIComponent(firstNameOf(g.name))}&role=${g.role}`;

  // Warm note (NO url) — used as the share-sheet text + WhatsApp/Copy text. The
  // link is passed/appended separately so it isn't duplicated.
  const noteFor = (g: Guest) =>
    `Dear ${g.roleLabel} ${firstNameOf(g.name)},\n\nYou are warmly invited to celebrate the christening of ${content.baby.firstName}. Your presence would make this special occasion even more meaningful to us.\n\nPlease open the invitation for more details.`;

  // Generic link for ordinary guests (no name) — envelope shows "You're Invited".
  const guestLink = `${origin}/`;
  const guestNote = `Dear Family & Friends,\n\nYou are warmly invited to celebrate the christening of ${content.baby.firstName}. Your presence would make this special occasion even more meaningful to us.\n\nPlease open the invitation for more details.`;

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
    // Pass the link as a real `url` so the target app builds the rich preview
    // card (Messenger ONLY previews a proper url — inlining it in text kills the
    // card). `text` carries the personal note. Messenger renders the card as its
    // own element; that styling is Messenger's, not something we can change.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text: note, url: link });
        return;
      } catch {
        /* user cancelled or share failed — fall through to copy */
      }
    }
    copy(key, `${note}\n${link}`);
  };

  const btn =
    "rounded-full border border-ocean/40 px-4 py-1.5 font-sans text-xs uppercase tracking-[0.15em] text-ocean transition hover:bg-ocean hover:text-white";

  // Shared Copy / WhatsApp / Share… button row.
  const actions = (key: string, link: string, note: string) => (
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={() => copy(key, `${note}\n${link}`)} className={btn}>
        {copied === key ? "Copied!" : "Copy message"}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${note}\n${link}`)}`}
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

  // Apply search + "only not-yet-messaged" filter.
  const q = query.trim().toLowerCase();
  const visible = guests.filter((g) => {
    if (q && !g.name.toLowerCase().includes(q) && !g.roleLabel.toLowerCase().includes(q))
      return false;
    if (onlyPending && isMessaged(g)) return false;
    return true;
  });

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

      {/* Godparents heading + progress */}
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="font-serif text-2xl font-light text-deep">Godparents</h2>
        <span className="font-sans text-xs font-semibold text-ocean" aria-live="polite">
          {messagedCount} of {total} messaged
        </span>
      </div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-mist/60" aria-hidden="true">
        <div
          className="h-full rounded-full bg-ocean transition-all duration-300"
          style={{ width: `${total ? (messagedCount / total) * 100 : 0}%` }}
        />
      </div>

      {/* Search + controls */}
      <div className="mb-5 space-y-3">
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean/50"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
            <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a name…"
            aria-label="Search godparents by name"
            className="w-full rounded-full border border-mist bg-white/80 py-2.5 pl-10 pr-4 font-sans text-sm text-ink placeholder:text-ink/40 focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer select-none items-center gap-2 font-sans text-xs text-ink/70">
            <input
              type="checkbox"
              checked={onlyPending}
              onChange={(e) => setOnlyPending(e.target.checked)}
              className="h-4 w-4 accent-ocean"
            />
            Show only not-yet-messaged
          </label>
          <button
            type="button"
            onClick={resetAll}
            className="font-sans text-xs text-ink/50 underline-offset-2 transition hover:text-petal hover:underline"
          >
            Reset checks
          </button>
        </div>
      </div>

      {/* Godparent list */}
      <ul className="space-y-4">
        {visible.map((g) => {
          const link = linkFor(g);
          const done = isMessaged(g);
          return (
            <li
              key={keyOf(g)}
              className={`rounded-2xl border bg-white/70 p-5 shadow-sm transition ${
                done ? "border-sage/70 bg-sage/10" : "border-mist"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                {/* Tap the check OR the name to toggle "messaged" */}
                <button
                  type="button"
                  onClick={() => toggleMessaged(g)}
                  aria-pressed={done}
                  aria-label={done ? `Mark ${g.name} as not messaged` : `Mark ${g.name} as messaged`}
                  className="group flex items-center gap-3 text-left"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      done
                        ? "border-transparent bg-[#6FA287] text-white"
                        : "border-mist bg-white text-transparent group-hover:border-ocean/50"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                      <path
                        d="M5 12.5l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className={`font-serif text-lg ${
                      done ? "text-ink/45 line-through" : "text-deep"
                    }`}
                  >
                    {g.name}
                  </span>
                </button>
                <span className="shrink-0 rounded-full bg-powder px-3 py-0.5 font-sans text-[11px] uppercase tracking-[0.2em] text-ocean">
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

        {visible.length === 0 && (
          <li className="rounded-2xl border border-dashed border-mist bg-white/40 px-5 py-8 text-center font-sans text-sm text-ink/50">
            {onlyPending && messagedCount === total
              ? "🎉 Everyone has been messaged!"
              : "No godparents match your search."}
          </li>
        )}
      </ul>

      <p className="mt-10 text-center font-sans text-xs text-ink/50">
        Your checkmarks are saved on this device only. Open this page on your
        phone for the smoothest sharing.
      </p>
    </main>
  );
}
