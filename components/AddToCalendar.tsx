"use client";

import { content } from "@/lib/content";

/** "2026-08-15T10:00:00" -> "20260815T100000" (local floating time for ICS). */
function toStamp(iso: string): string {
  return iso.replace(/[-:]/g, "").replace(/\.\d+$/, "");
}

const { event, ceremony, site, baby } = content;
const start = toStamp(event.date);
const end = toStamp(event.endDate);
const title = site.title;
const details = `Join us as we celebrate the Holy Baptism of ${baby.fullName}.`;
const location = `${ceremony.venue}, ${ceremony.addressLine1}, ${ceremony.addressLine2}`;

const ics = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//InvitationCard//Christening//EN",
  "BEGIN:VEVENT",
  "UID:don-christening@invitationcard",
  `DTSTAMP:${start}`,
  `DTSTART:${start}`,
  `DTEND:${end}`,
  `SUMMARY:${title}`,
  `DESCRIPTION:${details}`,
  `LOCATION:${location}`,
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

const googleUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(title)}` +
  `&dates=${start}/${end}` +
  `&details=${encodeURIComponent(details)}` +
  `&location=${encodeURIComponent(location)}`;

export default function AddToCalendar() {
  // Generate the .ics on click (works on the static export — no server).
  const downloadIcs = () => {
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "don-christening.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-paper mx-auto mt-14 flex max-w-md flex-col items-center gap-4 px-7 py-7 text-center">
      <svg viewBox="0 0 24 24" className="h-7 w-7 text-ocean" fill="none" aria-hidden="true">
        <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8.5 14l2.2 2.2L16 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="font-serif text-xl text-deep">Save the Date</p>
      <p className="font-sans text-sm font-light text-ink/70">
        Add {baby.firstName}&apos;s christening to your calendar so you don&apos;t miss a moment.
      </p>
      <div className="mt-1 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={downloadIcs}
          className="inline-flex items-center justify-center rounded-full bg-ocean px-7 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:bg-deep"
        >
          Add to Calendar
        </button>
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-ocean/40 px-7 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ocean transition hover:bg-ocean/10"
        >
          Google Calendar
        </a>
      </div>
    </div>
  );
}
