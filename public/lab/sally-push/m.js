/* Sally modules: Creative and Engine.
   ?view=creative shows the work clean and ?view=engine shows its slots
   lit, both standing still: the study shows the work clean first and
   brings the same card back with its slots lit (the reveal, 2 Oct 2026).
   With no view, a framed module turns the switch itself, slowly, and
   stands still while the room pauses it (data-paused on its root) or the
   reader asks for less motion; opened on its own, it gets the switch. */
(() => {
  const root = document.documentElement;
  const set = (on) => document.body.classList.toggle("engine", on);
  const view = new URLSearchParams(location.search).get("view");
  let framed = true; try { framed = window.top !== window; } catch (e) { framed = true; }
  if (!framed) document.body.classList.add("solo");
  if (view === "creative" || view === "engine") { set(view === "engine"); return; }
  if (!framed) {
    const sw = document.createElement("div");
    sw.className = "m-switch"; sw.setAttribute("role", "group"); sw.setAttribute("aria-label", "View");
    sw.innerHTML = '<button type="button" data-v="0" aria-pressed="true">Creative</button><button type="button" data-v="1" aria-pressed="false">Engine</button>';
    document.body.appendChild(sw);
    sw.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      set(b.dataset.v === "1");
      sw.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    });
    return;
  }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let on = false, t = 0, last = 0;
  const step = (now) => {
    const dt = last ? Math.min(64, now - last) : 0; last = now;
    if (!root.dataset.paused) { t += dt; if (t >= (on ? 2800 : 3800)) { t = 0; on = !on; set(on); } }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
})();
