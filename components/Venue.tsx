import Reveal from "./Reveal";

type VenueData = {
  label: string;
  venue: string;
  addressLine1: string;
  addressLine2: string;
  timeDisplay: string;
  mapEmbed: string;
  mapLink: string;
};

/** A single venue block: details on one side, an embedded map on the other. */
export default function Venue({
  data,
  reversed = false,
}: {
  data: VenueData;
  reversed?: boolean;
}) {
  return (
    <Reveal>
      <div
        className={`flex flex-col items-center gap-8 md:items-stretch ${
          reversed ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        {/* Details */}
        <div className="flex flex-1 flex-col justify-center text-center md:text-left">
          <p className="label-spaced mb-3">{data.label}</p>
          <h3 className="font-serif text-3xl font-light text-deep sm:text-4xl">
            {data.venue}
          </h3>
          <p className="mt-4 font-sans text-sm leading-relaxed text-ink/70">
            {data.addressLine1}
            <br />
            {data.addressLine2}
          </p>
          <p className="mt-4 font-serif text-lg italic text-ocean">
            {data.timeDisplay}
          </p>
          <a
            href={data.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-6 inline-flex items-center justify-center gap-2 self-center rounded-full border border-ocean/40 bg-white/50 px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ocean transition hover:bg-ocean hover:text-white md:self-start"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            Get Directions
          </a>
        </div>

        {/* Map — framed like a pressed-paper photo */}
        <div className="flex-1 overflow-hidden rounded-[1.75rem] border border-white/70 p-1.5 shadow-[0_18px_40px_-24px_rgba(58,90,114,0.45)] backdrop-blur-sm">
          <iframe
            src={data.mapEmbed}
            title={`Map to ${data.venue}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-64 w-full rounded-[1.4rem] md:h-full md:min-h-[260px]"
          />
        </div>
      </div>
    </Reveal>
  );
}
