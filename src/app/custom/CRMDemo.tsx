"use client";

/**
 * CRMDemo — interactive demo of an industry-shaped CRM.
 *
 * Visitor picks an industry from the tab row. Each industry loads its own
 * schema (column set) and its own seed data. Visitor can add new rows,
 * search across all fields, and delete rows. Persisted to localStorage so
 * coming back to the page restores their additions.
 *
 * The point of the demo: a restaurant CRM is not a salon CRM is not a
 * contractor CRM. The fields, terminology, and workflows are different.
 * Off-the-shelf software forces a one-size-fits-all schema. Custom doesn't.
 */

import { useEffect, useMemo, useState } from "react";

type Industry = "Restaurant" | "Salon" | "Contractor" | "Boutique";
type Row = Record<string, string>;

interface IndustrySchema {
  columns: string[];
  seed: Row[];
  searchable: string[]; // Which fields to scan when searching.
}

const SCHEMAS: Record<Industry, IndustrySchema> = {
  Restaurant: {
    columns: ["Name", "Phone", "Last Visit", "Favorite Dish", "Allergies", "Birthday"],
    searchable: ["Name", "Favorite Dish", "Allergies"],
    seed: [
      { Name: "Maria Vega", Phone: "(512) 555-0142", "Last Visit": "Apr 28", "Favorite Dish": "Cacio e Pepe", Allergies: "Tree nuts", Birthday: "Aug 14" },
      { Name: "Daniel Chen", Phone: "(512) 555-0188", "Last Visit": "Apr 22", "Favorite Dish": "Bone-in ribeye", Allergies: "—", Birthday: "Mar 03" },
      { Name: "Priya Shah", Phone: "(512) 555-0167", "Last Visit": "Apr 19", "Favorite Dish": "Mushroom risotto", Allergies: "Shellfish", Birthday: "Nov 22" },
      { Name: "Tom & Lila Park", Phone: "(512) 555-0123", "Last Visit": "Apr 14", "Favorite Dish": "Burrata appetizer", Allergies: "—", Birthday: "Jun 09" },
      { Name: "Eleanor Briggs", Phone: "(512) 555-0199", "Last Visit": "Apr 09", "Favorite Dish": "Sea bass special", Allergies: "Dairy", Birthday: "Feb 17" },
    ],
  },
  Salon: {
    columns: ["Name", "Phone", "Last Service", "Stylist", "Color Formula", "Next Booked"],
    searchable: ["Name", "Stylist", "Color Formula"],
    seed: [
      { Name: "Andrea Liu", Phone: "(512) 555-0411", "Last Service": "Cut + balayage", Stylist: "Marisol", "Color Formula": "9N + 8AA, 30 vol", "Next Booked": "May 21" },
      { Name: "Jess Romero", Phone: "(512) 555-0419", "Last Service": "Root touch-up", Stylist: "Sam", "Color Formula": "5N, 20 vol", "Next Booked": "—" },
      { Name: "Whitney Park", Phone: "(512) 555-0387", "Last Service": "Cut + gloss", Stylist: "Marisol", "Color Formula": "Clear + 7G", "Next Booked": "May 14" },
      { Name: "Lena Howell", Phone: "(512) 555-0445", "Last Service": "Color correction", Stylist: "Devon", "Color Formula": "Custom (notes)", "Next Booked": "Jun 03" },
    ],
  },
  Contractor: {
    columns: ["Project", "Client", "Stage", "Started", "Last Update", "Open Items"],
    searchable: ["Project", "Client", "Stage"],
    seed: [
      { Project: "Lakeway Kitchen Remodel", Client: "B. & K. Foster", Stage: "Cabinet install", Started: "Mar 04", "Last Update": "Apr 30", "Open Items": "3" },
      { Project: "Bee Cave Primary Bath", Client: "M. Tanaka", Stage: "Tile prep", Started: "Apr 12", "Last Update": "Apr 29", "Open Items": "1" },
      { Project: "South Congress ADU", Client: "L. Rivera", Stage: "Framing", Started: "Apr 21", "Last Update": "May 02", "Open Items": "5" },
      { Project: "Westlake Mudroom", Client: "T. & J. Bell", Stage: "Punch list", Started: "Feb 18", "Last Update": "May 01", "Open Items": "2" },
    ],
  },
  Boutique: {
    columns: ["Name", "Phone", "Last Purchase", "Sizes", "Brands", "Wishlist"],
    searchable: ["Name", "Brands", "Wishlist"],
    seed: [
      { Name: "Sasha Lee", Phone: "(512) 555-0277", "Last Purchase": "Apr 26", Sizes: "S top, 4 bottom, 7.5 shoe", Brands: "Khaite, The Row", Wishlist: "Beige Khaite blazer" },
      { Name: "Robin Greer", Phone: "(512) 555-0265", "Last Purchase": "Apr 18", Sizes: "M top, 6 bottom, 8 shoe", Brands: "Dries, Toteme", Wishlist: "Toteme barrel jeans" },
      { Name: "Nina Walsh", Phone: "(512) 555-0288", "Last Purchase": "Mar 30", Sizes: "XS top, 2 bottom, 6 shoe", Brands: "Lemaire, Margaret Howell", Wishlist: "Margaret Howell trench" },
      { Name: "Cleo Adams", Phone: "(512) 555-0291", "Last Purchase": "Apr 03", Sizes: "L top, 8 bottom, 9 shoe", Brands: "COS, Issey Miyake", Wishlist: "Pleats Please skirt" },
    ],
  },
};

const INDUSTRIES: Industry[] = ["Restaurant", "Salon", "Contractor", "Boutique"];

const STORAGE_KEY = "rhs-crm-demo-v1";

interface PersistedState {
  industry: Industry;
  rowsByIndustry: Partial<Record<Industry, Row[]>>;
}

export function CRMDemo() {
  const [industry, setIndustry] = useState<Industry>("Restaurant");
  // Per-industry rows. Init lazily from localStorage if present.
  const [rowsByIndustry, setRowsByIndustry] = useState<Record<Industry, Row[]>>(() => {
    const init: Record<Industry, Row[]> = {
      Restaurant: SCHEMAS.Restaurant.seed,
      Salon: SCHEMAS.Salon.seed,
      Contractor: SCHEMAS.Contractor.seed,
      Boutique: SCHEMAS.Boutique.seed,
    };
    return init;
  });
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRow, setNewRow] = useState<Row>({});

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed.industry && INDUSTRIES.includes(parsed.industry)) {
        setIndustry(parsed.industry);
      }
      if (parsed.rowsByIndustry) {
        setRowsByIndustry((prev) => ({
          ...prev,
          ...(parsed.rowsByIndustry as Record<Industry, Row[]>),
        }));
      }
    } catch {
      // Bad JSON in storage — ignore and start fresh.
    }
  }, []);

  // Persist on changes.
  useEffect(() => {
    try {
      const payload: PersistedState = { industry, rowsByIndustry };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage quota or disabled — silently no-op.
    }
  }, [industry, rowsByIndustry]);

  const schema = SCHEMAS[industry];
  const rows = rowsByIndustry[industry];

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      schema.searchable.some((col) => (row[col] ?? "").toLowerCase().includes(q))
    );
  }, [rows, search, schema.searchable]);

  function changeIndustry(next: Industry) {
    setIndustry(next);
    setSearch("");
    setShowAddForm(false);
    setNewRow({});
  }

  function deleteRow(index: number) {
    setRowsByIndustry((prev) => ({
      ...prev,
      [industry]: prev[industry].filter((_, i) => i !== index),
    }));
  }

  function addRow() {
    // Build a row with at least the first column filled in; others optional.
    const filled: Row = {};
    schema.columns.forEach((col) => {
      filled[col] = (newRow[col] ?? "").trim() || "—";
    });
    // Don't add a totally empty row.
    const hasContent = schema.columns.some((col) => (newRow[col] ?? "").trim().length > 0);
    if (!hasContent) {
      setShowAddForm(false);
      return;
    }
    setRowsByIndustry((prev) => ({
      ...prev,
      [industry]: [filled, ...prev[industry]],
    }));
    setNewRow({});
    setShowAddForm(false);
  }

  function resetIndustry() {
    setRowsByIndustry((prev) => ({
      ...prev,
      [industry]: SCHEMAS[industry].seed,
    }));
    setSearch("");
  }

  return (
    <div className="w-full bg-white rounded-[clamp(20px,3vw,40px)] overflow-hidden border border-foreground/10 shadow-[0_2px_24px_rgba(20,20,20,0.04)]">
      {/* Industry tabs */}
      <div className="border-b border-foreground/10 px-4 md:px-6 py-3 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        <p className="text-[10px] uppercase tracking-[0.12em] font-medium text-foreground/60 mr-3 shrink-0">
          Industry:
        </p>
        {INDUSTRIES.map((ind) => (
          <button
            key={ind}
            type="button"
            onClick={() => changeIndustry(ind)}
            className={`text-[12px] md:text-[13px] px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              ind === industry
                ? "bg-[#141414] text-white"
                : "bg-foreground/[0.04] text-foreground/60 hover:bg-foreground/[0.08]"
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Search + add row */}
      <div className="border-b border-foreground/10 px-4 md:px-6 py-3 flex items-center gap-3 bg-foreground/[0.02]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${schema.searchable.join(", ").toLowerCase()}…`}
          className="flex-1 bg-white border border-foreground/10 rounded-full px-4 py-1.5 text-[13px] focus:outline-none focus:border-foreground/30"
        />
        <button
          type="button"
          onClick={() => setShowAddForm((s) => !s)}
          className="text-[12px] md:text-[13px] bg-[#141414] text-white rounded-full px-4 py-1.5 font-medium shrink-0 hover:bg-foreground/80 transition-colors"
        >
          {showAddForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {/* Add row form */}
      {showAddForm && (
        <div className="border-b border-foreground/10 px-4 md:px-6 py-4 bg-[#ECE6E1]/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {schema.columns.map((col) => (
              <div key={col}>
                <label className="text-[10px] uppercase tracking-[0.08em] text-foreground/50 block mb-1">
                  {col}
                </label>
                <input
                  type="text"
                  value={newRow[col] ?? ""}
                  onChange={(e) => setNewRow((prev) => ({ ...prev, [col]: e.target.value }))}
                  className="w-full bg-white border border-foreground/10 rounded-md px-2 py-1.5 text-[13px] focus:outline-none focus:border-foreground/30"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addRow}
            className="text-[12px] bg-[#141414] text-white rounded-full px-4 py-1.5 font-medium hover:bg-foreground/80 transition-colors"
          >
            Save row
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] md:text-[13px]">
          <thead>
            <tr className="border-b border-foreground/10">
              {schema.columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-4 md:px-6 py-3 text-[10px] uppercase tracking-[0.08em] font-medium text-foreground/50 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
              <th className="px-4 py-3 w-8" aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={schema.columns.length + 1}
                  className="px-6 py-8 text-center text-foreground/40 italic text-[13px]"
                >
                  {search.trim() ? "No matches for that search." : "No rows yet. Click Add to create one."}
                </td>
              </tr>
            ) : (
              filteredRows.map((row, i) => {
                // Find the original index in `rows` so delete targets the right entry.
                const originalIdx = rows.indexOf(row);
                return (
                  <tr
                    key={i}
                    className="border-b border-foreground/[0.06] last:border-b-0 hover:bg-foreground/[0.02] transition-colors group"
                  >
                    {schema.columns.map((col, j) => (
                      <td
                        key={j}
                        className={`px-4 md:px-6 py-3 whitespace-nowrap ${
                          j === 0 ? "font-medium" : "text-foreground/70"
                        }`}
                      >
                        {row[col] ?? "—"}
                      </td>
                    ))}
                    <td className="px-2 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => deleteRow(originalIdx)}
                        className="text-foreground/30 hover:text-red-600 text-[14px] opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete row"
                        title="Delete"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-foreground/10 px-4 md:px-6 py-2 flex items-center justify-between bg-foreground/[0.02]">
        <p className="text-[11px] text-foreground/50">
          {filteredRows.length} of {rows.length} {rows.length === 1 ? "row" : "rows"}
        </p>
        <button
          type="button"
          onClick={resetIndustry}
          className="text-[11px] text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          Reset {industry}
        </button>
      </div>
    </div>
  );
}
