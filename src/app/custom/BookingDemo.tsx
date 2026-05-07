"use client";

/**
 * BookingDemo — Phase 1 placeholder.
 *
 * Static mockup of a custom-configured booking widget. Left side shows
 * the rules the business owner set; right side shows a calendar with
 * available slots reflecting those rules.
 *
 * Phase 2 swap: make the rules editable, recompute the calendar slots
 * client-side. No backend needed for the demo (pure React state).
 */

const RULES = [
  { label: "Service", value: "Hair cut & color, 90 min" },
  { label: "Days", value: "Tue, Wed, Thu, Sat" },
  { label: "Hours", value: "10:00 – 6:00" },
  { label: "Lunch", value: "12:00 – 1:00 (no bookings)" },
  { label: "Buffer", value: "15 min between clients" },
];

// Simplified week view — Tuesday through Saturday, mock slots.
const DAYS = [
  { name: "Tue", date: "May 7" },
  { name: "Wed", date: "May 8" },
  { name: "Thu", date: "May 9" },
  { name: "Sat", date: "May 11" },
];

const SLOTS = ["10:00", "11:45", "1:15", "3:00", "4:45"];

// Booked slots (visually crossed out)
const BOOKED = new Set(["Tue-10:00", "Wed-1:15", "Thu-3:00", "Thu-4:45"]);

export function BookingDemo() {
  return (
    <div className="w-full bg-white rounded-[clamp(20px,3vw,40px)] overflow-hidden border border-foreground/10 shadow-[0_2px_24px_rgba(20,20,20,0.04)]">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Rules panel */}
        <div className="bg-[#ECE6E1] p-5 md:p-6">
          <p className="text-[10px] uppercase tracking-[0.12em] mb-4 font-medium text-foreground/60">
            Your Rules
          </p>
          <div className="space-y-3">
            {RULES.map((rule) => (
              <div key={rule.label}>
                <p className="text-[10px] uppercase tracking-[0.08em] text-foreground/50 mb-0.5">
                  {rule.label}
                </p>
                <p className="text-[13px] md:text-[14px] leading-[1.4] font-medium">
                  {rule.value}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[11px] leading-[1.5] text-foreground/50 mt-5 pt-5 border-t border-foreground/10">
            Change any of these and the calendar rebuilds itself in real time.
          </p>
        </div>

        {/* Calendar */}
        <div className="p-5 md:p-6">
          <p className="text-[10px] uppercase tracking-[0.12em] mb-4 font-medium text-foreground/60">
            This Week
          </p>
          <div className="grid grid-cols-4 gap-3">
            {DAYS.map((day) => (
              <div key={day.name}>
                <div className="text-center mb-3">
                  <p className="text-[11px] font-bold leading-tight">{day.name}</p>
                  <p className="text-[10px] text-foreground/50 leading-tight">{day.date}</p>
                </div>
                <div className="space-y-1.5">
                  {SLOTS.map((slot) => {
                    const isBooked = BOOKED.has(`${day.name}-${slot}`);
                    return (
                      <div
                        key={slot}
                        className={`text-[11px] md:text-[12px] py-2 px-2 rounded-md text-center font-medium ${
                          isBooked
                            ? "bg-foreground/[0.04] text-foreground/30 line-through"
                            : "bg-[#141414] text-white"
                        }`}
                      >
                        {slot}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
