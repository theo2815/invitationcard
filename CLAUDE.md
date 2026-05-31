# CLAUDE.md — InvitationCard

Digital **christening invitation website** for a client's baby boy. One scrolling page that opens with a tappable **envelope animation** and is personalized per godparent. Built with Next.js + Tailwind + framer-motion, shipped as a **static export**.

---

## 🛑 MANDATORY FIRST STEP — READ THE VAULT BEFORE DOING ANYTHING

This project has a "second brain" in an Obsidian vault. **You MUST read it before writing, editing, or running any code, or answering questions about the project.** Do not skip this. Do not start coding from assumptions.

**Vault location:**
```
C:\Users\Theo Cedric Chan\Documents\Obsidian Vault\InvitationCard Vault
```
> ⚠️ Note: the vault is under `Documents\Obsidian Vault\...`. The CODE is under `documents\Start up project\invitationcard`. Don't confuse them — never put code in the vault.

### Required reading order (do this at the start of every session)

1. **`Agent Handoff.md`** — START HERE. What the project is, where things are, how to run it, the mental model, and the hard constraints.
2. **`UI Gotchas & Lessons.md`** — ⚠️ REQUIRED before editing the envelope or ANY animation (`components/InvitationGate.tsx`). Documents bugs that already cost many iterations.
3. **`Home.md`** — the index / map of content; open whatever else is relevant to your task from here:
   - `Project Overview.md`, `Decisions Log.md`, `Tech Stack & Architecture.md`,
     `File Map.md`, `Running & Deploying.md`, `Editing Content.md`,
     `Features.md`, `TODO & Roadmap.md`.

### Rules

- ✅ Read the vault notes relevant to your task **before** making changes.
- ✅ When you make a meaningful change, decision, or discover a new pitfall, **update the vault** so it stays accurate for the next agent (e.g. add to `Decisions Log.md`, `UI Gotchas & Lessons.md`, or `TODO & Roadmap.md`).
- ✅ Check `Decisions Log.md` before reversing any past decision.
- 🚫 Do not contradict the vault without flagging it to the user.

---

## Quick reference (full detail lives in the vault)

**Run:**
```powershell
cd "C:\Users\Theo Cedric Chan\documents\Start up project\invitationcard"
npm install      # first time only
npm run dev      # http://localhost:3000 (or 3001 if busy)
npm run build    # static export -> ./out  (always verify before deploy)
```
Preview personalization: `/?to=Antonio&role=ninong`, generic: `/`, host links helper: `/links`.

**Single source of content:** `lib/content.ts` — all text, names, dates, venues, godparents, and envelope copy. Edit this to change what the site says; nothing else.

**Hard constraints (see `Tech Stack & Architecture.md`):**
- 🚫 No server code — it's a **static export** (`output: 'export'`). No API routes, server actions, or databases.
- 🚫 No RSVP / forms / backend unless the client explicitly opts out of pure-static.
- ✅ Personalization is **URL-param only**, read client-side (`?to=&role=`).
- ✅ **Mobile-first** — godparents open it on phones.
- ✅ Respect `prefers-reduced-motion` (already wired in the envelope gate).

**Top UI rule (see `UI Gotchas & Lessons.md`):** framer-motion writes `transform` inline, which overrides Tailwind `translate-*`. **Never center a `motion.*` element with `-translate-x-1/2`** — position it with a flexbox/grid wrapper and let the motion element only animate.

**🎨 Design-quality rule — READ BEFORE ANY UI WORK:** Before building, restyling, or laying out **any** component, page, or visual, **read the Frontend Design skill** and apply its guidance:
```
C:\Users\Theo Cedric Chan\Documents\Obsidian Vault\Claude Skills\Frontend Design.md
```
It pushes for a **bold, distinctive, production-grade** aesthetic over generic "AI-slop" defaults (no Inter/Roboto/system fonts, no timid evenly-spread pastels, no predictable centered-everything layouts). This invite should feel hand-crafted and unforgettable, not template-y — commit to one clear aesthetic direction and execute it with precision, while respecting this project's hard constraints (mobile-first, static export, reduced-motion).

**Status:** "Watercolor Storybook" redesign done; **real client content is in** (Baby Don Ezeikiel V. Abellana, Jun 28 2026, Bantayan/Cebu, full godparent lists, photos + gift images). Remaining: confirm parents' message wording, compress the 2 MB gift PNG, then deploy. See `TODO & Roadmap.md`.

---

## Conventions

- Theme = **Watercolor Storybook** on a soft "baby boy" blue base. Tailwind tokens: `powder, mist, azure, ocean, deep, ink, cream, paper, gold, blush, petal, sage, butter`.
- Fonts: `font-serif` (Fraunces), `font-script` (Parisienne — baby's name), `font-sans` (Nunito).
- Watercolor kit in `components/Decor.tsx` (`WatercolorBlob` needs a **unique `id`** per instance) + washes/`grain`/`card-paper` utilities in `globals.css`. The Hero entrance is keyed to the gate's `invitation:revealed` event — don't animate revealed content on mount. (See `UI Gotchas & Lessons.md`.)
- New scroll sections: wrap in `<Reveal>` and use the shared `<Section>` shell.
- After editing the envelope, verify the **rendered HTML** (curl + grep) and check the **closed state at the `sm`/phone widths**, not just that it compiled.
