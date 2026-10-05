/* ── A ROOM'S CHAPTERS (4 Oct 2026) ──────────────────────────────────────
   His "do we have a format opportunity here? are there tabs or sections a
   user can easily navigate to with simple yet powerful sections names",
   then "go ahead and make them what you think best and we can go from
   there". A long room gets a short contents under its title, each line
   what one part of the work does, in his figures where he has them, and
   each line opens that part. study-panel.js sets them, and keeps their
   numbers in the running head, the one the reader is in opened to its
   line. A chapter names its section by the first words of that section's
   head, which survive fragments.js being built again (its ids do not).
   Only the long studies have chapters. A line is set as the room's
   subtitle is, one size in two tones: what the part does in ink (t), the
   rest in grey (g); app names the part of the work it is.

   Each may carry a picture (pic), which comes up beside the pointer as it
   crosses that line of the contents (4 Oct, his "do you know those lists
   that when you hover an image comes up too? might be cool here!"). Sally
   OS's are the screens its flowing grid is cut from (sally-demos/assets/
   flow), one from each part of the work. */
window.DENSITY_CHAPTERS = {
  /* his figures (4 Oct, "yes, those numbers ARE real!"): 30 hours a week
     on watching competitors, and 40 a week across the teams that write,
     design and code the campaigns */
  "sally-os": [
    { head: "Three AI models watch", t: "Watches competitors,", g: "saving 30 hours a week", app: "Trends", pic: "/lab/sally-demos/assets/flow/trends-take.webp" },
    { head: "Jim answers with the context", t: "Writes, designs and codes campaigns,", g: "saving 40 hours a week across teams", app: "Brand Brain", pic: "/lab/sally-demos/assets/flow/figma-boards.webp" },
    { head: "Jim now proposes campaigns", t: "Proposes campaigns", g: "from trends and what customers say", app: "Campaigns", pic: "/lab/sally-demos/assets/flow/brief-output.webp" },
    { head: "Sally's old asset library", t: "Finds any asset", g: "by what's in it", app: "Asset Hub", pic: "/lab/sally-demos/assets/flow/hub-detail.webp" },
    { head: "Ten tools each handle a job", t: "Ten tools,", g: "from shelf talkers to exec decks", app: "Utilities", pic: "/lab/sally-demos/assets/flow/util-grid.webp" },
  ],
};
