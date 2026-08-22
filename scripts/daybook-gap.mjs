/* What the daybook has not been told yet.
 *
 *   node scripts/daybook-gap.mjs           the gap, per project
 *   node scripts/daybook-gap.mjs --full    every subject, not the first 12
 *   node scripts/daybook-gap.mjs --files   with the paths each commit touched
 *   node scripts/daybook-gap.mjs Sally     one project only
 *
 * The daybook is hand-written and nothing watches the repos it reports
 * on, so it goes quiet without anyone noticing. It last did for eight
 * days across two projects and 191 commits, which is how this script
 * came to exist.
 *
 * IT REPORTS. IT DOES NOT WRITE. src/data/daybook.ts says why in its
 * own header: commit subjects here are written in a literary register
 * and are raw material for an entry, never the entry itself. A
 * generator would fill the page with lines like "A phone gets the
 * choreography, because nothing about it was ever wide" and call it a
 * ledger. So this prints what happened and leaves the writing alone.
 *
 * THE BOUNDARY. A project's gap starts the day AFTER its newest entry.
 * Entries are dated by day, not by commit, so the newest entry's own
 * day is taken as covered — otherwise every run re-reports the work
 * that entry was written about. The header prints the date it counted
 * from, so the assumption is visible rather than buried.
 *
 * MISSING REPOS ARE NOT FAILURES. These volumes drop out mid-session.
 * An unreadable repo is reported as unreadable and the other projects
 * still print.
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const DAYBOOK = "src/data/daybook.ts";

/* The daybook's project names against the repos they report on. A name
   with no repo (Lab) is skipped rather than treated as an error: not
   every project on that page is a git repository. */
const REPOS = {
  RHS: "/Volumes/ReckonHouse/RHS/OS",
  Sally: "/Volumes/ReckonHouse/Sally/Sally Marketing Brain/sally-portal",
  "A.R.C.": "/Volumes/ReckonHouse/A.R.C./ARC-Archive-Ready-Cloud",
};

const argv = process.argv.slice(2);
const FULL = argv.includes("--full");
const FILES = argv.includes("--files");
const only = argv.find((a) => !a.startsWith("--"));

/* Newest entry per project. The file is newest-first, so the first
   date each project appears under is the one that matters. Read off
   the source rather than imported: this is a .mjs script and the data
   file is TypeScript, and a regex over two known-shape fields is a
   smaller dependency than a whole transpile step. */
function newestByProject() {
  const src = readFileSync(DAYBOOK, "utf8");
  const re = /date:\s*"(\d{4}-\d{2}-\d{2})",\s*\n\s*project:\s*"([^"]+)"/g;
  const newest = {};
  const counts = {};
  for (const m of src.matchAll(re)) {
    const [, date, project] = m;
    if (!newest[project]) newest[project] = date;
    counts[project] = (counts[project] ?? 0) + 1;
  }
  if (!Object.keys(newest).length) {
    throw new Error(`no entries parsed out of ${DAYBOOK} — has its shape changed?`);
  }
  return { newest, counts };
}

const dayAfter = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};

function log(dir, since) {
  const out = execFileSync(
    "git",
    [
      "-C", dir,
      "log",
      `--since=${since}`,
      "--no-merges",
      `--pretty=format:%h%ad%s`,
      "--date=short",
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  );
  return out
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, date, subject] = line.split("");
      return { hash, date, subject };
    });
}

/* The directories a commit touched, two levels deep. Full paths make
   the report unreadable at 80 commits; "src/app, src/components" is
   enough to tell a nav change from a data change at a glance. */
function areas(dir, hash) {
  try {
    const out = execFileSync(
      "git",
      ["-C", dir, "show", "--name-only", "--pretty=format:", hash],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );
    const set = new Set(
      out
        .split("\n")
        .filter(Boolean)
        .map((p) => p.split("/").slice(0, 2).join("/"))
    );
    return [...set].slice(0, 4).join(", ");
  } catch {
    return "";
  }
}

const { newest, counts } = newestByProject();
const projects = Object.keys(REPOS).filter((p) => !only || p === only);

if (only && !projects.length) {
  console.error(`unknown project "${only}" — try one of: ${Object.keys(REPOS).join(", ")}`);
  process.exit(2);
}

let total = 0;
const lines = [];

for (const project of projects) {
  const dir = REPOS[project];
  const last = newest[project];

  if (!last) {
    lines.push(`\n${project}  —  no entries at all; nothing to count from`);
    continue;
  }

  const since = dayAfter(last);
  let commits;
  try {
    commits = log(dir, since);
  } catch {
    lines.push(
      `\n${project}  —  last entry ${last}  ·  repo unreadable at ${dir}` +
        `\n   (the volume drops out mid-session; remount and run again)`
    );
    continue;
  }

  total += commits.length;
  const head =
    `\n${project}  —  ${counts[project]} entries, newest ${last}  ·  ` +
    `${commits.length} commit${commits.length === 1 ? "" : "s"} since ${since}`;
  lines.push(head);

  if (!commits.length) {
    lines.push("   up to date");
    continue;
  }

  /* Grouped by day, because that is the unit an entry is written in.
     A day with 35 commits is one entry, not thirty-five. */
  const byDay = new Map();
  for (const c of commits) {
    if (!byDay.has(c.date)) byDay.set(c.date, []);
    byDay.get(c.date).push(c);
  }

  for (const [date, list] of [...byDay].sort()) {
    lines.push(`\n   ${date}   ${list.length} commit${list.length === 1 ? "" : "s"}`);
    const show = FULL ? list : list.slice(0, 12);
    for (const c of show) {
      lines.push(`      ${c.subject}`);
      if (FILES) {
        const a = areas(dir, c.hash);
        if (a) lines.push(`         ${a}`);
      }
    }
    if (show.length < list.length) {
      lines.push(`      … ${list.length - show.length} more (--full)`);
    }
  }
}

console.log(lines.join("\n"));
console.log(
  `\n${total} commit${total === 1 ? "" : "s"} with no entry covering ${total === 1 ? "it" : "them"}.` +
    (total ? "\nWrite them in src/data/daybook.ts. Fresh copy, not these subjects." : "")
);
