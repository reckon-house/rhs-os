/**
 * px — round a computed coordinate to something both engines agree on.
 *
 * Trig is implementation-defined in its final bits. Node's V8 and
 * Chrome's V8 return different last digits for the same Math.cos, so a
 * component that renders `cx + Math.cos(a) * r` straight into markup
 * emits one string on the server and a different one in the browser.
 * React sees a mismatch, and for a large SVG it discards the whole
 * subtree — "this won't be patched up" — silently re-rendering
 * thousands of nodes on every load.
 *
 * Three decimals is far below a pixel at any viewport, so nothing moves
 * that an eye could see, and the string is identical everywhere.
 *
 * SystemArchitecture paid for this lesson first, with a 2,203-node SVG
 * rebuilding itself three times per load. Use it for anything derived
 * from Math.cos, sin, sqrt, atan2 or hypot that reaches an attribute.
 */
export const px = (n: number) => Math.round(n * 1000) / 1000;
