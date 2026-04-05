"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface Annotation {
  id: number;
  x: number; // percentage from left
  y: number; // px from top of scrollable content
  note: string;
  sectionHint: string;
  timestamp: string;
}

export function MarkupOverlay() {
  const [active, setActive] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Toggle with Ctrl/Cmd+M
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "m") {
        e.preventDefault();
        setActive((v) => !v);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Focus textarea when editing
  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("markup-annotations");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnnotations(parsed);
        nextId.current = parsed.length > 0 ? Math.max(...parsed.map((a: Annotation) => a.id)) + 1 : 1;
      }
    } catch {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("markup-annotations", JSON.stringify(annotations));
  }, [annotations]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!active) return;
      // Don't place pins on the panel or existing pins
      if ((e.target as HTMLElement).closest("[data-markup-ui]")) return;

      const main = document.querySelector("main");
      if (!main) return;

      const rect = main.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPx = e.clientY - rect.top + main.scrollTop;

      // Try to find nearest section hint
      let sectionHint = "";
      const els = document.elementsFromPoint(e.clientX, e.clientY);
      for (const el of els) {
        const text = el.textContent?.trim() || "";
        if (text.startsWith("SECTION")) {
          sectionHint = text.split("\n")[0].substring(0, 60);
          break;
        }
      }
      if (!sectionHint) {
        // Walk up to find a section-like parent
        for (const el of els) {
          const closest = el.closest("section");
          if (closest) {
            const header = closest.querySelector("h2, h3, p");
            if (header) {
              sectionHint = header.textContent?.trim().substring(0, 60) || "";
              break;
            }
          }
        }
      }

      const id = nextId.current++;
      const annotation: Annotation = {
        id,
        x: xPct,
        y: yPx,
        note: "",
        sectionHint,
        timestamp: new Date().toLocaleTimeString(),
      };

      setAnnotations((prev) => [...prev, annotation]);
      setEditingId(id);
    },
    [active]
  );

  const updateNote = useCallback((id: number, note: string) => {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, note } : a)));
  }, []);

  const deleteAnnotation = useCallback((id: number) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) setEditingId(null);
  }, [editingId]);

  const exportFeedback = useCallback(() => {
    const lines = annotations
      .filter((a) => a.note.trim())
      .map((a, i) => {
        const location = a.sectionHint || `~${Math.round(a.y)}px from top`;
        return `${i + 1}. [${location}]\n   ${a.note}`;
      })
      .join("\n\n");

    const output = `--- PAGE MARKUP FEEDBACK ---\n\n${lines}\n\n--- END FEEDBACK ---`;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [annotations]);

  const clearAll = useCallback(() => {
    setAnnotations([]);
    setEditingId(null);
    nextId.current = 1;
  }, []);

  const main = typeof document !== "undefined" ? document.querySelector("main") : null;
  const mainRect = main?.getBoundingClientRect();

  return (
    <>
      {/* Activation button — bottom-right */}
      <button
        data-markup-ui
        onClick={() => setActive((v) => !v)}
        className="fixed bottom-5 right-5 z-[9999] w-10 h-10 rounded-full flex items-center justify-center text-[16px] shadow-lg transition-all"
        style={{
          backgroundColor: active ? "#e74c3c" : "#333",
          color: "#fff",
        }}
        title="Toggle markup mode (Cmd+M)"
      >
        {active ? "x" : "\u270E"}
      </button>

      {/* Active mode indicator */}
      {active && (
        <div
          data-markup-ui
          className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] bg-[#e74c3c] text-white text-[12px] font-medium px-4 py-1.5 rounded-full shadow-lg flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          MARKUP MODE — click anywhere to annotate
          <button
            data-markup-ui
            onClick={() => setShowPanel((v) => !v)}
            className="ml-2 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[11px]"
          >
            {showPanel ? "Hide" : "Show"} List ({annotations.length})
          </button>
        </div>
      )}

      {/* Click catcher overlay — only when active */}
      {active && (
        <div
          className="fixed inset-0 z-[9990]"
          style={{ cursor: "crosshair", pointerEvents: "all" }}
          onClick={handleClick}
        />
      )}

      {/* Pins rendered on main */}
      {annotations.map((a) => {
        if (!mainRect || !main) return null;
        const pinTop = a.y - main.scrollTop + mainRect.top;
        const pinLeft = mainRect.left + (a.x / 100) * mainRect.width;

        // Only render if visible
        if (pinTop < -50 || pinTop > window.innerHeight + 50) return null;

        return (
          <div
            key={a.id}
            data-markup-ui
            className="fixed z-[9995]"
            style={{
              top: pinTop - 12,
              left: pinLeft - 12,
            }}
          >
            {/* Pin dot */}
            <button
              data-markup-ui
              onClick={(e) => {
                e.stopPropagation();
                setEditingId(editingId === a.id ? null : a.id);
              }}
              className="w-6 h-6 rounded-full bg-[#e74c3c] text-white text-[11px] font-bold flex items-center justify-center shadow-md border-2 border-white hover:scale-110 transition-transform"
            >
              {a.id}
            </button>

            {/* Note editor popover */}
            {editingId === a.id && (
              <div
                data-markup-ui
                className="absolute top-8 left-0 w-[260px] bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-[9998]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Note #{a.id}
                  </span>
                  <button
                    data-markup-ui
                    onClick={() => deleteAnnotation(a.id)}
                    className="text-[10px] text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
                <textarea
                  ref={inputRef}
                  data-markup-ui
                  value={a.note}
                  onChange={(e) => updateNote(a.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      setEditingId(null);
                    }
                    e.stopPropagation();
                  }}
                  placeholder="What needs to change here?"
                  className="w-full h-[80px] text-[13px] p-2 border border-gray-200 rounded resize-none focus:outline-none focus:border-[#e74c3c] text-gray-800"
                />
                <p className="text-[10px] text-gray-300 mt-1">Cmd+Enter to close</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Feedback panel */}
      {showPanel && active && (
        <div
          data-markup-ui
          className="fixed right-4 top-14 bottom-16 w-[320px] z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-gray-800">
              Annotations ({annotations.length})
            </h3>
            <div className="flex gap-2">
              <button
                data-markup-ui
                onClick={exportFeedback}
                className="text-[11px] bg-[#333] text-white px-3 py-1 rounded hover:bg-[#555]"
              >
                {copied ? "Copied!" : "Copy All"}
              </button>
              <button
                data-markup-ui
                onClick={clearAll}
                className="text-[11px] text-red-400 hover:text-red-600 px-2"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {annotations.length === 0 && (
              <p className="text-[12px] text-gray-400 text-center mt-8">
                Click on the page to add annotations
              </p>
            )}
            {annotations.map((a) => (
              <div
                key={a.id}
                data-markup-ui
                className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  // Scroll to annotation
                  const main = document.querySelector("main");
                  if (main) main.scrollTo({ top: a.y - 200, behavior: "smooth" });
                  setEditingId(a.id);
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#e74c3c] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {a.id}
                  </span>
                  <span className="text-[10px] text-gray-400 truncate">
                    {a.sectionHint || `Position: ${Math.round(a.y)}px`}
                  </span>
                </div>
                <p className="text-[12px] text-gray-700 ml-7">
                  {a.note || <span className="text-gray-300 italic">No note yet</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
