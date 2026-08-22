/**
 * Which routes are white paper, and which one owns the cover.
 *
 * THE PROBLEM THIS SOLVES IS TIMING, not knowledge. PaperGround and
 * PressingHome already know they want a white ground; they say so in a
 * useEffect, which runs after hydration and therefore after the first
 * paint. Until then <html> carries no class, so the browser paints
 * `background: var(--background)` — the shell's cream ground — plus
 * Satoshi and --foreground, and a beat later the whole thing flips to
 * paper, Helvetica and pure black. On a refresh you see the old site
 * for an instant. It was on every one of these four routes.
 *
 * So the class has to be on <html> BEFORE first paint, and the only
 * thing that runs there is a blocking script in <head>. The root layout
 * inlines `stampScript()` below.
 *
 * ONE LIST, TWO READERS. The script needs the routes as data, and the
 * components need them as behaviour. Keeping the list here and
 * serialising it into the script means adding a white page is one edit,
 * not one edit and one string in a layout that nobody thinks to look
 * at. A mismatch between the two is not a crash: it is the flash coming
 * back on one route, silently, which is the kind of bug that survives
 * for months.
 *
 * The effects stay. A soft navigation never re-runs a <head> script, so
 * the components remain the source of truth once the app is running,
 * and the script only has to be right about the first paint.
 */

/** Ground is white paper. Exact match, or a path under the prefix. */
export const PAPER_ROUTES = ["/", "/daybook", "/inspiration", "/thread"];

/** The page whose own cover holds the masthead's wordmark and address. */
export const COVER_ROUTES = ["/"];

const hit = (routes: string[], path: string) =>
  routes.some((r) => (r === "/" ? path === "/" : path === r || path.startsWith(`${r}/`)));

export const isPaper = (path: string) => hit(PAPER_ROUTES, path);
export const isCover = (path: string) => hit(COVER_ROUTES, path);

/**
 * The stamp, as source, for the root layout to inline.
 *
 * Deliberately tiny and deliberately defensive: it runs before anything
 * else on the page, so a throw here is a blank site. The try/catch
 * costs nothing and the worst case degrades to exactly the behaviour
 * this replaces, which is the flash.
 */
export function stampScript(): string {
  return `(function(){try{var p=location.pathname,c=[];
var h=function(r){return r==="/"?p==="/":p===r||p.indexOf(r+"/")===0};
if(${JSON.stringify(PAPER_ROUTES)}.some(h))c.push("rh-home");
if(${JSON.stringify(COVER_ROUTES)}.some(h))c.push("rh-cover");
if(c.length)document.documentElement.classList.add.apply(document.documentElement.classList,c);
}catch(e){}})()`;
}
