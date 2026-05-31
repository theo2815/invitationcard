"use client";

import { useEffect, useState } from "react";
import { content } from "@/lib/content";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number, now: number): TimeLeft {
  const total = Math.max(0, target - now);
  const seconds = Math.floor(total / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export default function Countdown() {
  const target = new Date(content.event.date).getTime();
  // null until mounted, so server and first client render match (no hydration warning).
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTime(diff(target, Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: { label: string; value: number }[] = [
    { label: "Days", value: time?.days ?? 0 },
    { label: "Hours", value: time?.hours ?? 0 },
    { label: "Minutes", value: time?.minutes ?? 0 },
    { label: "Seconds", value: time?.seconds ?? 0 },
  ];

  return (
    <div className="mx-auto flex max-w-md justify-center gap-3 sm:gap-5">
      {units.map((u) => (
        <div
          key={u.label}
          className="card-paper flex w-16 flex-col items-center py-4 sm:w-20 sm:py-5"
        >
          <span className="font-serif text-3xl font-medium tabular-nums text-ocean sm:text-4xl">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-petal/90">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
