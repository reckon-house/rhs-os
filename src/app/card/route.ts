/* ── reckon.house/card (5 Oct 2026) ──────────────────────────────────
   The homepage with its link-preview picture. reckon.house itself now
   pastes small, without one (his "is there a way to remove this image
   when i paste a link into an email client...wish i could remove it when
   i wanted and on the off chance i did want to include it i could");
   this is the address to paste when he wants the big card.

   It is the homepage's own file, fetched and served with the picture's
   tags put in at its <!--card--> marker, so there is no second copy to
   keep in step. og:url names this address, so the apps that read it as
   the page's identity (LinkedIn, Facebook) keep the picture. Once open,
   the page tidies the address bar back to reckon.house/ without leaving,
   so whatever a reader copies from there is the plain address. Search
   engines are asked to skip it; the homepage's canonical still points
   at /. If the homepage cannot be fetched, the reader goes to it. */
const PREVIEW = `<meta property="og:image" content="https://reckon.house/og-home-clean.jpg">
<meta property="og:image:width" content="2400">
<meta property="og:image:height" content="1260">
<meta property="og:image:alt" content="Reckon House. Work by Jeremy Prasatik: the Robert Rodriguez campaign, the Ivy Park launch, and the A.R.C. app.">
<meta name="twitter:image" content="https://reckon.house/og-home-clean.jpg">
<meta name="robots" content="noindex">
<script>if (location.pathname === "/card") history.replaceState(history.state, "", "/" + location.search + location.hash);</script>`;

export async function GET(req: Request) {
  const res = await fetch(new URL("/lab/density/crossref2.html", req.url), { cache: "no-store" });
  if (!res.ok) return Response.redirect(new URL("/", req.url), 307);
  const html = (await res.text())
    .replace("<!--card-->", PREVIEW)
    .replace('<meta name="twitter:card" content="summary">', '<meta name="twitter:card" content="summary_large_image">')
    .replace('<meta property="og:url" content="https://reckon.house/">', '<meta property="og:url" content="https://reckon.house/card">');
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
