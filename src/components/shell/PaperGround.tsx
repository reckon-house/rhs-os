"use client";

import { useEffect } from "react";

/**
 * PaperGround — makes the page's ground WHITE for as long as it is
 * mounted, and hands it back on the way out.
 *
 * WHY A COMPONENT AND NOT A LINE OF CSS. The masthead is a translucent
 * bar: its burn pill filters whatever is painted behind it, which is
 * <html>, not the page. The shell paints <html> with the textured
 * ground the classic routes wear. So a white pressing page that does
 * nothing gets a band of the old site across the top of it — visible,
 * wrong, and reported twice now, once on /daybook and once on
 * /thread/[token].
 *
 * A page cannot fix that from inside its own box, because <html> is
 * above it. Every white page therefore has to reach up and say so, and
 * before this each one did that with its own copy of the same effect —
 * which is exactly why the third page was missing it. One component,
 * one name, and adding a white page is now remembering to render this
 * rather than remembering a class name and a cleanup.
 *
 * rh-home is the homepage's own flag, reused deliberately: it already
 * paints --paper behind the bar and hides the film overlay, which is
 * the whole treatment. The name is about where it came from, not where
 * it may be used.
 *
 * Renders nothing. The class comes off on unmount so the classic routes
 * (category, info) keep their texture.
 *
 * THIS EFFECT IS NO LONGER THE FIRST TO SET IT, and must not be. An
 * effect runs after hydration, so on a refresh the ground painted cream
 * with the classic type and flipped a beat later. A blocking script in
 * <head> now stamps the class before the first paint, from the route
 * list in src/lib/paper-routes.ts. Add a white page THERE as well as
 * rendering this, or the flash comes back on that one route only.
 *
 * The effect still earns its place: a soft navigation never re-runs a
 * <head> script, so mount and unmount remain what keeps the class
 * honest once the app is running.
 */
export function PaperGround() {
  useEffect(() => {
    document.documentElement.classList.add("rh-home");
    return () => document.documentElement.classList.remove("rh-home");
  }, []);
  return null;
}
