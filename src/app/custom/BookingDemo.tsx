"use client";

/**
 * BookingDemo — interactive demo of a custom booking widget.
 *
 * Visitor edits the rules (service name, duration, days open, hours,
 * lunch break, buffer between clients). The calendar on the right
 * recomputes available slots in real time. Clicking a slot toggles it
 * to booked. All client-side state — no backend, no persistence beyond
 * the page session.
 *
 * The point of the demo: a calendar built around YOUR rules, not the
 * rules of a SaaS product. Calendly assumes a one-size-fits-all booking
 * model. Real businesses don't work that way.
 */

import { useMemo, useState } from "react";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = typeof ALL_DAYS[number];

/** Convert "HH:MM" to total minutes since midnight. */
function hhmmToMin(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Format minutes-since-midnight as "H:MM" (no leading zero on hour). */
function minToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

/**
 * Compute the available slot start times for a single day, given the
 * service duration, hours, optional lunch window, and buffer between
 * clients. Slots that would overlap lunch are skipped.
 */
function computeSlots(args: {
  openMin: number;
  closeMin: number;
  durationMin: number;
  bufferMin: number;
  lunchStartMin: number | null;
  lunchEndMin: number | null;
}): number[] {
  const { openMin, closeMin, durationMin, bufferMin, lunchStartMin, lunchEndMin } = args;
  const slots: number[] = [];
  let cur = openMin;

  while (cur + durationMin <= closeMin) {
    const slotEnd = cur + durationMin;
    const overlapsLunch =
      lunchStartMin !== null &&
      lunchEndMin !== null &&
      cur < lunchEndMin &&
      slotEnd > lunchStartMin;

    if (overlapsLunch) {
      // Jump to the end of lunch and try again from there.
      cur = lunchEndMin!;
      continue;
    }

    slots.push(cur);
    cur += durationMin + bufferMin;
  }

  return slots;
}

/** Build the list of upcoming dates that match the selected weekdays. */
function upcomingMatchingDays(
  selected: Set<Day>,
  count: number
): { day: Day; date: Date }[] {
  const out: { day: Day; date: Date }[] = [];
  const today = new Date();
  for (let i = 0; i < 30 && out.length < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // JS Sunday=0; remap to Mon-Sun order.
    const idx = (d.getDay() + 6) % 7;
    const dayName = ALL_DAYS[idx];
    if (selected.has(dayName)) {
      out.push({ day: dayName, date: d });
    }
  }
  return out;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function BookingDemo() {
  const [serviceName, setServiceName] = useState("Hair cut & color");
  const [duration, setDuration] = useState(90);
  const [days, setDays] = useState<Set<Day>>(new Set(["Tue", "Wed", "Thu", "Sat"]));
  const [openTime, setOpenTime] = useState("10:00");
  const [closeTime, setCloseTime] = useState("18:00");
  const [lunchEnabled, setLunchEnabled] = useState(true);
  const [lunchStart, setLunchStart] = useState("12:00");
  const [lunchEnd, setLunchEnd] = useState("13:00");
  const [buffer, setBuffer] = useState(15);

  // Set of "YYYY-MM-DD-HH:MM" strings that the visitor has clicked to book.
  const [booked, setBooked] = useState<Set<string>>(() => {
    // Pre-seed a few "already booked" slots for visual variety on initial load.
    return new Set();
  });

  const upcoming = useMemo(() => upcomingMatchingDays(days, 5), [days]);

  const slotsByDate = useMemo(() => {
    const openMin = hhmmToMin(openTime);
    const closeMin = hhmmToMin(closeTime);
    const lunchStartMin = lunchEnabled ? hhmmToMin(lunchStart) : null;
    const lunchEndMin = lunchEnabled ? hhmmToMin(lunchEnd) : null;

    return upcoming.map(({ day, date }) => {
      const slots = computeSlots({
        openMin,
        closeMin,
        durationMin: duration,
        bufferMin: buffer,
        lunchStartMin,
        lunchEndMin,
      });
      return { day, date, slots };
    });
  }, [upcoming, openTime, closeTime, duration, buffer, lunchEnabled, lunchStart, lunchEnd]);

  function toggleDay(d: Day) {
    setDays((prev) => {
      const next = new Set(prev);
      if (next.has(d)) {
        next.delete(d);
      } else {
        next.add(d);
      }
      return next;
    });
  }

  function slotKey(date: Date, slotMin: number): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}-${minToLabel(slotMin)}`;
  }

  function toggleSlot(key: string) {
    setBooked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className="w-full bg-white rounded-[clamp(20px,3vw,40px)] overflow-hidden border border-foreground/10 shadow-[0_2px_24px_rgba(20,20,20,0.04)]">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
        {/* Rules panel */}
        <div className="bg-[#ECE6E1] p-5 md:p-6 space-y-5">
          <p className="text-[10px] uppercase tracking-[0.12em] font-medium text-foreground/60">
            Your Rules
          </p>

          {/* Service name */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.08em] text-foreground/50 block mb-1">
              Service
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value.slice(0, 40))}
              className="w-full bg-white border border-foreground/10 rounded-md px-2 py-1.5 text-[13px] focus:outline-none focus:border-foreground/30"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.08em] text-foreground/50 block mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={15}
              max={480}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Math.max(15, Math.min(480, Number(e.target.value) || 60)))}
              className="w-full bg-white border border-foreground/10 rounded-md px-2 py-1.5 text-[13px] focus:outline-none focus:border-foreground/30"
            />
          </div>

          {/* Days */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.08em] text-foreground/50 block mb-2">
              Days Open
            </label>
            <div className="flex gap-1 flex-wrap">
              {ALL_DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDay(d)}
                  className={`text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${
                    days.has(d)
                      ? "bg-[#141414] text-white"
                      : "bg-white border border-foreground/10 text-foreground/60 hover:border-foreground/30"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.08em] text-foreground/50 block mb-1">
              Hours
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="flex-1 bg-white border border-foreground/10 rounded-md px-2 py-1.5 text-[13px] focus:outline-none focus:border-foreground/30"
              />
              <span className="text-foreground/40 text-[12px]">to</span>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="flex-1 bg-white border border-foreground/10 rounded-md px-2 py-1.5 text-[13px] focus:outline-none focus:border-foreground/30"
              />
            </div>
          </div>

          {/* Lunch */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.08em] text-foreground/50 flex items-center justify-between mb-1">
              <span>Lunch Break</span>
              <input
                type="checkbox"
                checked={lunchEnabled}
                onChange={(e) => setLunchEnabled(e.target.checked)}
                className="cursor-pointer"
              />
            </label>
            <div className={`flex gap-2 items-center ${lunchEnabled ? "" : "opacity-40"}`}>
              <input
                type="time"
                value={lunchStart}
                onChange={(e) => setLunchStart(e.target.value)}
                disabled={!lunchEnabled}
                className="flex-1 bg-white border border-foreground/10 rounded-md px-2 py-1.5 text-[13px] focus:outline-none focus:border-foreground/30 disabled:cursor-not-allowed"
              />
              <span className="text-foreground/40 text-[12px]">to</span>
              <input
                type="time"
                value={lunchEnd}
                onChange={(e) => setLunchEnd(e.target.value)}
                disabled={!lunchEnabled}
                className="flex-1 bg-white border border-foreground/10 rounded-md px-2 py-1.5 text-[13px] focus:outline-none focus:border-foreground/30 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Buffer */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.08em] text-foreground/50 block mb-1">
              Buffer between clients (minutes)
            </label>
            <input
              type="number"
              min={0}
              max={120}
              step={5}
              value={buffer}
              onChange={(e) => setBuffer(Math.max(0, Math.min(120, Number(e.target.value) || 0)))}
              className="w-full bg-white border border-foreground/10 rounded-md px-2 py-1.5 text-[13px] focus:outline-none focus:border-foreground/30"
            />
          </div>

          <p className="text-[11px] leading-[1.5] text-foreground/50 pt-3 border-t border-foreground/10">
            Change anything and the calendar rebuilds itself. Click a slot on the right to mark it booked.
          </p>
        </div>

        {/* Calendar */}
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-[0.12em] font-medium text-foreground/60">
              Next Available
            </p>
            <p className="text-[11px] text-foreground/50 truncate max-w-[60%]">
              {serviceName || "Service"} · {duration} min
            </p>
          </div>

          {slotsByDate.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[13px] text-foreground/50">
                Pick at least one day open to see available slots.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {slotsByDate.map(({ day, date, slots }) => (
                <div key={date.toISOString()}>
                  <div className="text-center mb-3">
                    <p className="text-[11px] font-bold leading-tight">{day}</p>
                    <p className="text-[10px] text-foreground/50 leading-tight">
                      {MONTHS[date.getMonth()]} {date.getDate()}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {slots.length === 0 ? (
                      <p className="text-[10px] text-foreground/40 italic text-center py-2">
                        No slots
                      </p>
                    ) : (
                      slots.map((slotMin) => {
                        const key = slotKey(date, slotMin);
                        const isBooked = booked.has(key);
                        return (
                          <button
                            key={slotMin}
                            type="button"
                            onClick={() => toggleSlot(key)}
                            className={`w-full text-[11px] md:text-[12px] py-2 px-2 rounded-md text-center font-medium transition-colors ${
                              isBooked
                                ? "bg-foreground/[0.04] text-foreground/30 line-through"
                                : "bg-[#141414] text-white hover:bg-foreground/80"
                            }`}
                          >
                            {minToLabel(slotMin)}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
