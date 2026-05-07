"use client";

/**
 * CRMDemo — Phase 1 placeholder.
 *
 * Static mockup of a custom CRM table. Top row picks an industry;
 * the table columns and sample data reflect that industry. Phase 1
 * shows "Restaurant" with industry-specific fields like "Last Visit",
 * "Favorite Dish", "Allergies", "Birthday".
 *
 * Phase 2 swap: make the industry tabs interactive (Salon, Contractor,
 * Restaurant, Boutique each load different schemas + sample data),
 * make rows editable with localStorage persistence.
 */

const INDUSTRIES = ["Restaurant", "Salon", "Contractor", "Boutique"] as const;

const COLUMNS = ["Name", "Phone", "Last Visit", "Favorite Dish", "Allergies", "Birthday"];

const ROWS: string[][] = [
  ["Maria Vega", "(512) 555-0142", "Apr 28", "Cacio e Pepe", "Tree nuts", "Aug 14"],
  ["Daniel Chen", "(512) 555-0188", "Apr 22", "Bone-in ribeye", "—", "Mar 03"],
  ["Priya Shah", "(512) 555-0167", "Apr 19", "Mushroom risotto", "Shellfish", "Nov 22"],
  ["Tom & Lila Park", "(512) 555-0123", "Apr 14", "Burrata appetizer", "—", "Jun 09"],
  ["Eleanor Briggs", "(512) 555-0199", "Apr 09", "Sea bass special", "Dairy", "Feb 17"],
];

export function CRMDemo() {
  return (
    <div className="w-full bg-white rounded-[clamp(20px,3vw,40px)] overflow-hidden border border-foreground/10 shadow-[0_2px_24px_rgba(20,20,20,0.04)]">
      {/* Industry tabs */}
      <div className="border-b border-foreground/10 px-4 md:px-6 py-3 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <p className="text-[10px] uppercase tracking-[0.12em] font-medium text-foreground/60 mr-3 shrink-0">
          Industry:
        </p>
        {INDUSTRIES.map((industry, i) => (
          <button
            key={industry}
            disabled
            className={`text-[12px] md:text-[13px] px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              i === 0
                ? "bg-[#141414] text-white"
                : "bg-foreground/[0.04] text-foreground/60 disabled:cursor-not-allowed"
            }`}
          >
            {industry}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="border-b border-foreground/10 px-4 md:px-6 py-3 flex items-center gap-3 bg-foreground/[0.02]">
        <input
          disabled
          placeholder="Search customers, dishes, allergies…"
          className="flex-1 bg-white border border-foreground/10 rounded-full px-4 py-1.5 text-[13px] disabled:opacity-60"
        />
        <button
          disabled
          className="text-[12px] md:text-[13px] bg-[#141414] text-white rounded-full px-4 py-1.5 font-medium disabled:opacity-60 shrink-0"
        >
          + Add
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] md:text-[13px]">
          <thead>
            <tr className="border-b border-foreground/10">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="text-left px-4 md:px-6 py-3 text-[10px] uppercase tracking-[0.08em] font-medium text-foreground/50 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr
                key={i}
                className="border-b border-foreground/[0.06] last:border-b-0 hover:bg-foreground/[0.02] transition-colors"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 md:px-6 py-3 whitespace-nowrap ${
                      j === 0 ? "font-medium" : "text-foreground/70"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
